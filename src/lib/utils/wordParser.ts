export interface FinalQuestion {
	question_text: string;
	// For regular question types: string[]
	// For menjodohkan: { left: string[]; right: string[] }
	options: string[] | { left: string[]; right: string[] };
	correct_answer: string | string[] | Record<string, string> | null;
	type: string;
}

export function parseWordHtmlToQuestions(html: string): FinalQuestion[] {
	// Convert soft returns to separate paragraphs to avoid swallowing KUNCI: tags
	html = html.replace(/<br\s*\/?>/gi, '</p><p>');
	
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, 'text/html');
	
	// Step 1: Chunk elements by KUNCI
	let elements = Array.from(doc.body.children);
	
	// Ignore any preamble instructions if [MULAI SOAL] marker is found
	let startIdx = 0;
	for (let i = 0; i < elements.length; i++) {
		if (/^\[MULAI SOAL\]/i.test(elements[i].textContent?.trim() || '')) {
			startIdx = i + 1;
			break;
		}
	}
	elements = elements.slice(startIdx);
	
	const chunks: Element[][] = [];
	let currentChunk: Element[] = [];
	
	for (let i = 0; i < elements.length; i++) {
		const el = elements[i];
		const text = el.textContent?.trim() || '';
		
		// If we see a new question start, AND the current chunk already has substantial content
		if (/^\d+[\.\)]\s/.test(text)) {
			const hasContent = currentChunk.some(e => e.textContent?.trim() || e.querySelector('img'));
			// Only split if we have already seen options OR a table OR [KIRI] marker in the current chunk
			const hasExplicitOptions = currentChunk.some(e => /^[a-eA-E][\.\)]\s/i.test(e.textContent?.trim() || ''));
			const hasMenjodohkanMarker = currentChunk.some(e => e.tagName === 'TABLE' || /^\[(KIRI|KANAN|MULAI SOAL)\]/i.test(e.textContent?.trim() || ''));
			
			if (hasContent && (hasExplicitOptions || hasMenjodohkanMarker)) {
				chunks.push(currentChunk);
				currentChunk = [];
			}
		}
		
		currentChunk.push(el);
		
		if (/^KUNCI:\s*(.+)/i.test(text)) {
			chunks.push(currentChunk);
			currentChunk = [];
		}
	}
	
	if (currentChunk.length > 0) {
		const hasText = currentChunk.some(e => e.textContent?.trim() || e.querySelector('img'));
		if (hasText) chunks.push(currentChunk);
	}
	
	// Step 2: Parse each chunk
	const parsedQuestions: {
		questionHtml: string[];
		options: {id: string; html: string}[];
		answer: string | null;
		// For menjodohkan:
		isMenjodohkan?: boolean;
		menjodohkanLeft?: string[];
		menjodohkanRight?: string[];
		menjodohkanMapping?: Record<string, string>;
	}[] = [];
	
	for (const chunk of chunks) {
		let answerKey: string | null = null;
		let kunciIndex = -1;
		
		for (let i = chunk.length - 1; i >= 0; i--) {
			const text = chunk[i].textContent?.trim() || '';
			const match = text.match(/^KUNCI:\s*(.+)/i);
			if (match) {
				answerKey = match[1].trim();
				kunciIndex = i;
				break;
			}
		}
		
		const workingElements = kunciIndex >= 0 ? chunk.slice(0, kunciIndex) : chunk;
		if (workingElements.length === 0) continue;

		// ── MENJODOHKAN DETECTION ────────────────────────────────────────
		// Check for 2-column TABLE format
		const tableEl = workingElements.find(el => el.tagName === 'TABLE');
		// Check for [KIRI] / [KANAN] tag format
		const kiriIdx = workingElements.findIndex(el => /^\[(KIRI|PERNYATAAN|KOLOM\s*A|KOLOM\s*KIRI)\]/i.test(el.textContent?.trim() || ''));
		const kananIdx = workingElements.findIndex(el => /^\[(KANAN|PILIHAN|JAWABAN|KOLOM\s*B|KOLOM\s*KANAN)\]/i.test(el.textContent?.trim() || ''));
		
		const isMenjodohkanTable = !!tableEl;
		const isMenjodohkanTags = kiriIdx !== -1 && kananIdx !== -1 && kananIdx > kiriIdx;
		
		if (isMenjodohkanTable || isMenjodohkanTags) {
			const parsed = parseMenjodohkanChunk(workingElements, answerKey, tableEl || null, kiriIdx, kananIdx);
			if (parsed) {
				parsedQuestions.push({
					questionHtml: parsed.questionHtml,
					options: [],
					answer: answerKey,
					isMenjodohkan: true,
					menjodohkanLeft: parsed.left,
					menjodohkanRight: parsed.right,
					menjodohkanMapping: parsed.mapping
				});
				continue;
			}
		}
		// ── END MENJODOHKAN ──────────────────────────────────────────────
		
		let options: {id: string, html: string}[] = [];
		let questionElements: Element[] = [];
		
		let firstOptionIdx = -1;
		for (let i = 0; i < workingElements.length; i++) {
			const el = workingElements[i];
			const text = el.textContent?.trim() || '';
			if (/^([a-eA-E])[\.\)]\s/.test(text)) {
				firstOptionIdx = i;
				break;
			}
		}
		
		if (firstOptionIdx >= 0) {
			questionElements = workingElements.slice(0, firstOptionIdx);
			let currentOptIdx = -1;
			for (let i = firstOptionIdx; i < workingElements.length; i++) {
				const el = workingElements[i];
				const text = el.textContent?.trim() || '';
				const match = text.match(/^([a-eA-E])[\.\)]\s*(.*)/i);
				
				if (match) {
					const cloned = el.cloneNode(true) as Element;
					const walker = document.createTreeWalker(cloned, NodeFilter.SHOW_TEXT);
					let firstText = walker.nextNode();
					while (firstText) {
						if (firstText.nodeValue && firstText.nodeValue.trim().length > 0) {
							firstText.nodeValue = firstText.nodeValue.replace(/^[a-eA-E][\.\)]\s*/i, '');
							break;
						}
						firstText = walker.nextNode();
					}
					options.push({
						id: match[1].toUpperCase(),
						html: cloned.innerHTML || ''
					});
					currentOptIdx++;
				} else {
					if (currentOptIdx >= 0) {
						options[currentOptIdx].html += '<br>' + (el.innerHTML || '');
					}
				}
			}
		} else {
			let lastListIdx = -1;
			for (let i = workingElements.length - 1; i >= 0; i--) {
				const el = workingElements[i];
				if (el.tagName === 'OL' || el.tagName === 'UL') {
					lastListIdx = i;
					break;
				} else if (el.textContent?.trim() === '' && !el.querySelector('img')) {
					continue;
				} else {
					break;
				}
			}
			
			if (lastListIdx >= 0) {
				const listEl = workingElements[lastListIdx];
				const listItems = Array.from(listEl.children).filter(c => c.tagName === 'LI');
				
				if (listItems.length >= 2 && (!answerKey || answerKey.toLowerCase() !== 'essay')) {
					questionElements = workingElements.slice(0, lastListIdx);
					
					if (questionElements.length === 0) {
						// Mammoth collapsed the question and options into a single list
						const firstLi = listItems[0];
						const nestedList = firstLi.querySelector('ol, ul');
						
						if (nestedList) {
							// Nested list: Question is outer item, options are inner items
							const nestedItems = Array.from(nestedList.children).filter(c => c.tagName === 'LI');
							const qClone = firstLi.cloneNode(true) as Element;
							const nestedInClone = qClone.querySelector('ol, ul');
							if (nestedInClone) nestedInClone.remove();
							
							questionElements = [qClone];
							nestedItems.forEach((li, idx) => {
								options.push({
									id: String.fromCharCode(65 + idx),
									html: li.innerHTML || ''
								});
							});
						} else {
							// Flat list: Question is first item, rest are options
							// We only do this if it's a reasonable number of options (e.g. max 5 options)
							// Otherwise it might be a huge list of statements where options were not lists
							if (listItems.length <= 6) {
								questionElements = [firstLi];
								listItems.slice(1).forEach((li, idx) => {
									options.push({
										id: String.fromCharCode(65 + idx),
										html: li.innerHTML || ''
									});
								});
							} else {
								// Too many items to blindly assume they are all options
								questionElements = workingElements;
							}
						}
					} else {
						// Standard fallback
						listItems.forEach((li, idx) => {
							const id = String.fromCharCode(65 + idx);
							options.push({
								id: id,
								html: li.innerHTML || ''
							});
						});
					}
				} else {
					questionElements = workingElements;
				}
			} else {
				questionElements = workingElements;
			}
		}
		
		if (questionElements.length > 0) {
			let firstEl = questionElements[0];
			
			if (firstEl.tagName === 'OL' || firstEl.tagName === 'UL') {
				const liChildren = Array.from(firstEl.children).filter(c => c.tagName === 'LI');
				const newElements = [];
				for (const li of liChildren) {
					const div = document.createElement('div');
					div.innerHTML = li.innerHTML;
					newElements.push(div);
				}
				questionElements.splice(0, 1, ...newElements);
				if (questionElements.length > 0) {
					firstEl = questionElements[0];
				}
			}

			const text = firstEl.textContent?.trim() || '';
			if (/^\d+[\.\)]\s/.test(text)) {
				const cloned = firstEl.cloneNode(true) as Element;
				const walker = document.createTreeWalker(cloned, NodeFilter.SHOW_TEXT);
				let firstText = walker.nextNode();
				while (firstText) {
					if (firstText.nodeValue && firstText.nodeValue.trim().length > 0) {
						firstText.nodeValue = firstText.nodeValue.replace(/^\d+[\.\)]\s*/, '');
						break;
					}
					firstText = walker.nextNode();
				}
				questionElements[0] = cloned;
			}
		}

		// Remove { and } markers used to protect statements
		questionElements = questionElements.filter(el => {
			const text = el.textContent?.trim();
			return text !== '{' && text !== '}';
		});
		
		// Convert any orphaned LI elements in questionElements to DIV to prevent black bullet points
		for (let i = 0; i < questionElements.length; i++) {
			if (questionElements[i].tagName === 'LI') {
				const div = document.createElement('div');
				div.innerHTML = questionElements[i].innerHTML;
				questionElements[i] = div;
			}
		}

		// Detect and format images: inline (connected with text) vs block (standalone per baris)
		formatElementsImages(questionElements);

		// Also format images in options (options should always be inline with option text)
		for (const opt of options) {
			const tempDiv = document.createElement('div');
			tempDiv.innerHTML = opt.html;
			const imgs = Array.from(tempDiv.querySelectorAll('img'));
			for (const img of imgs) {
				img.classList.remove('block', 'mx-auto');
				img.classList.add('inline-block', 'align-middle', 'max-h-48', 'max-w-full', 'object-contain', 'my-0.5', 'mx-1');
				img.style.verticalAlign = 'middle';
				img.setAttribute('data-display', 'inline');
			}
			opt.html = tempDiv.innerHTML;
		}
		
		parsedQuestions.push({
			questionHtml: questionElements.map(e => e.outerHTML),
			options: options,
			answer: answerKey
		});
	}
	
	return parsedQuestions.map(q => {
		const cleanEq = (html: string) => {
			if (!html) return html;

			// 1. Isolate and protect all HTML tags (and their attributes) with safe tokens
			const tags: string[] = [];
			const protectedHtml = html.replace(/<[^>]+>/g, (tag) => {
				const token = `TAGPROTECTTOKEN${tags.length}ENDTAG`;
				tags.push(tag);
				return token;
			});

			// 2. Perform safe mathematical superscripts and subscripts strictly on text
			let cleaned = protectedHtml
				// Subscript with braces: e.g. x_{12}, a_{-1}
				.replace(/([a-zA-Z0-9\)])_\{([^}]+)\}/g, '$1<sub>$2</sub>')
				// Simple subscript: e.g. x_1, H_2O
				.replace(/([a-zA-Z0-9\)])_([a-zA-Z0-9]+)/g, '$1<sub>$2</sub>')
				// Superscript with braces: e.g. x^{2n+1}, 10^{-5}
				.replace(/([a-zA-Z0-9\)])\^\{([^}]+)\}/g, '$1<sup>$2</sup>')
				// Simple superscript: e.g. x^2, y^-3
				.replace(/([a-zA-Z0-9\)])\^([+-]?[a-zA-Z0-9]+)/g, '$1<sup>$2</sup>');

			// 3. Restore all original HTML tags intact
			cleaned = cleaned.replace(/TAGPROTECTTOKEN(\d+)ENDTAG/g, (_, idx) => tags[Number(idx)] || '');

			return cleaned;
		};

		// ── MENJODOHKAN RETURN ────────────────────────────────────────────
		if (q.isMenjodohkan) {
			const leftItems = (q.menjodohkanLeft || []).map(html => normalizeMatchingItemHtml(cleanEq(html)));
			const rightItems = (q.menjodohkanRight || []).map(html => normalizeMatchingItemHtml(cleanEq(html)));
			
			// Convert letter mapping (e.g. {"0": "A"}) to index mapping (e.g. {"0": "0"})
			// The system stores mapping as {leftIdx: rightIdx} where both are string numbers
			const rawMapping = q.menjodohkanMapping || {};
			const finalMapping: Record<string, string> = {};
			for (const [lKey, rVal] of Object.entries(rawMapping)) {
				// rVal may be a letter ("A") or index ("0") — normalise to index
				let rIdx: string;
				if (/^[A-Za-z]$/.test(rVal)) {
					rIdx = String(rVal.toUpperCase().charCodeAt(0) - 65);
				} else {
					rIdx = rVal;
				}
				finalMapping[lKey] = rIdx;
			}
			
			return {
				question_text: normalizeQuestionHtml(cleanEq(q.questionHtml.join(''))),
				options: { left: leftItems, right: rightItems },
				correct_answer: finalMapping,
				type: 'menjodohkan'
			} as FinalQuestion;
		}
		// ── END MENJODOHKAN ───────────────────────────────────────────────
		
		let type = 'pilihan_ganda';
		let finalAnswer: string | string[] | null = q.answer;
		
		if (q.options.length > 0) {
			if (q.answer && (q.answer.includes(',') || q.answer.length > 1)) {
				type = 'pilihan_ganda_kompleks';
				finalAnswer = q.answer.split(',').map(a => a.trim().toUpperCase());
			} else {
				type = 'pilihan_ganda';
				finalAnswer = q.answer ? q.answer.toUpperCase() : null;
			}
		} else {
			if (q.answer && q.answer.toLowerCase() === 'essay') {
				type = 'essay';
				finalAnswer = '';
			} else if (q.answer && (q.answer.toLowerCase() === 'benar' || q.answer.toLowerCase() === 'salah')) {
				type = 'benar_salah';
				q.options = [{ id: 'A', html: 'Benar' }, { id: 'B', html: 'Salah' }];
				finalAnswer = q.answer.toLowerCase() === 'benar' ? 'Benar' : 'Salah';
			} else {
				type = 'isian_singkat';
			}
		}

		return {
			question_text: normalizeQuestionHtml(cleanEq(q.questionHtml.join(''))),
			options: q.options.map(opt => normalizeQuestionHtml(cleanEq(opt.html))),
			correct_answer: finalAnswer,
			type: type
		};
	});
}

/**
 * Parse a menjodohkan chunk from a 2-column table or [KIRI]/[KANAN] markers.
 * Returns { questionHtml, left, right, mapping } or null if detection failed.
 */
function parseMenjodohkanChunk(
	workingElements: Element[],
	answerKey: string | null,
	tableEl: Element | null,
	kiriIdx: number,
	kananIdx: number
): { questionHtml: string[]; left: string[]; right: string[]; mapping: Record<string, string> } | null {
	
	const leftItems: string[] = [];
	const rightItems: string[] = [];
	let questionElements: Element[] = [];

	if (tableEl) {
		// ── FORMAT A: TABLE ──────────────────────────────────────────────
		const tableIdx = workingElements.indexOf(tableEl);
		// Everything before the table is the question text
		questionElements = workingElements.slice(0, tableIdx).filter(el => {
			const t = el.textContent?.trim();
			return t !== '{' && t !== '}';
		});

		const rows = Array.from(tableEl.querySelectorAll('tr'));
		if (rows.length < 2) return null;

		// Detect if first row is a header row (text-only, descriptive)
		const firstRowCells = Array.from(rows[0].querySelectorAll('td, th'));
		if (firstRowCells.length < 2) return null;

		const c0text = firstRowCells[0].textContent?.trim().toLowerCase() || '';
		const c1text = firstRowCells[1].textContent?.trim().toLowerCase() || '';
		const isHeaderRow = (
			c0text.includes('pernyataan') || c0text.includes('kolom') || c0text.includes('kiri') || c0text.includes('soal') ||
			c1text.includes('jawaban') || c1text.includes('pilihan') || c1text.includes('kanan')
		) && !firstRowCells[0].querySelector('img');

		const dataRows = isHeaderRow ? rows.slice(1) : rows;
		
		for (const row of dataRows) {
			const cells = Array.from(row.querySelectorAll('td, th'));
			if (cells.length < 2) continue;
			
			const lCell = cells[0];
			const rCell = cells[1];
			const lText = lCell.textContent?.trim() || '';
			const rText = rCell.textContent?.trim() || '';
			
			// Extract left cell: strip leading number prefix (e.g. "1. ", "(1) ")
			if (lText || lCell.querySelector('img')) {
				const lHtml = formatMatchingCellHtml(lCell);
				const stripped = stripLeadingNumberPrefix(lHtml);
				leftItems.push(stripped);
			}
			
			// Extract right cell: strip leading letter prefix (e.g. "A. ", "(A) ")
			if (rText || rCell.querySelector('img')) {
				const rHtml = formatMatchingCellHtml(rCell);
				const stripped = stripLeadingLetterPrefix(rHtml);
				rightItems.push(stripped);
			}
		}
		
		if (leftItems.length === 0) return null;

	} else if (kiriIdx !== -1 && kananIdx !== -1) {
		// ── FORMAT B: [KIRI] / [KANAN] TAGS ─────────────────────────────
		questionElements = workingElements.slice(0, kiriIdx).filter(el => {
			const t = el.textContent?.trim();
			return t !== '{' && t !== '}';
		});
		
		const leftEls = workingElements.slice(kiriIdx + 1, kananIdx);
		const rightEls = workingElements.slice(kananIdx + 1);
		
		for (const el of leftEls) {
			const text = el.textContent?.trim();
			if (!text && !el.querySelector('img')) continue;
			const html = formatMatchingCellHtml(el);
			leftItems.push(stripLeadingNumberPrefix(html));
		}
		
		for (const el of rightEls) {
			const text = el.textContent?.trim();
			if (!text && !el.querySelector('img')) continue;
			const html = formatMatchingCellHtml(el);
			rightItems.push(stripLeadingLetterPrefix(html));
		}
		
		if (leftItems.length === 0) return null;
	} else {
		return null;
	}

	// Strip question number prefix from first question element
	if (questionElements.length > 0) {
		const firstEl = questionElements[0];
		const t = firstEl.textContent?.trim() || '';
		if (/^\d+[\.\)]\s/.test(t)) {
			const cloned = firstEl.cloneNode(true) as Element;
			const walker = document.createTreeWalker(cloned, NodeFilter.SHOW_TEXT);
			let node = walker.nextNode();
			while (node) {
				if (node.nodeValue && node.nodeValue.trim().length > 0) {
					node.nodeValue = node.nodeValue.replace(/^\d+[\.\)]\s*/, '');
					break;
				}
				node = walker.nextNode();
			}
			questionElements[0] = cloned;
		}
		formatElementsImages(questionElements);
	}

	// ── PARSE MAPPING FROM ANSWER KEY ────────────────────────────────
	// Supported formats:
	//   "1-C, 2-A, 3-B"  "1:C, 2:A"  "1=C, 2=A"  "1->C, 2->A"
	//   "C, A, B"  (positional, same order as left items)
	//   "MENJODOHKAN" (default 1-to-1)
	const mapping: Record<string, string> = {};
	const cleanKey = (answerKey || '').replace(/^(MENJODOHKAN|JODOHKAN)\s*[:\-]?\s*/i, '').trim();
	
	if (cleanKey) {
		// Try explicit pair format: "1-C" or "1:C" or "1=C" or "1->C"
		const pairRegex = /(?:no\.?\s*)?(\d+)\s*(?:[-:=]|->|➔)\s*([A-Za-z\d]+)/gi;
		let m;
		const found: Array<{l: number; r: string}> = [];
		while ((m = pairRegex.exec(cleanKey)) !== null) {
			found.push({ l: parseInt(m[1], 10) - 1, r: m[2].trim().toUpperCase() });
		}
		
		if (found.length > 0) {
			for (const pair of found) {
				let rIdx: string;
				if (/^[A-Z]$/.test(pair.r)) {
					rIdx = String(pair.r.charCodeAt(0) - 65);
				} else {
					rIdx = pair.r;
				}
				mapping[String(pair.l)] = rIdx;
			}
		} else {
			// Positional: "C, A, B" → left[0]→C(2), left[1]→A(0), left[2]→B(1)
			const letters = cleanKey.split(/[,\s]+/).map(s => s.trim().toUpperCase()).filter(Boolean);
			letters.forEach((letter, idx) => {
				if (idx < leftItems.length) {
					let rIdx: string;
					if (/^[A-Z]$/.test(letter)) {
						rIdx = String(letter.charCodeAt(0) - 65);
					} else {
						rIdx = letter;
					}
					mapping[String(idx)] = rIdx;
				}
			});
		}
	} else {
		// No key or just "MENJODOHKAN" → default 1-to-1
		for (let i = 0; i < leftItems.length; i++) {
			mapping[String(i)] = String(i);
		}
	}

	return {
		questionHtml: questionElements.map(e => e.outerHTML),
		left: leftItems,
		right: rightItems,
		mapping
	};
}

/**
 * Format images inside a matching cell or [KIRI]/[KANAN] item.
 * Images rendered inline with text (max-h-36) or block-centered if image-only.
 */
function formatMatchingCellHtml(el: Element): string {
	const tempDiv = document.createElement('div');
	// Flatten all paragraph content from cell into tempDiv
	const paras = Array.from(el.querySelectorAll('p'));
	if (paras.length > 0) {
		// Use inner content of paragraphs, joined by space
		tempDiv.innerHTML = paras.map(p => p.innerHTML).join(' ');
	} else {
		tempDiv.innerHTML = el.innerHTML;
	}
	
	const imgs = Array.from(tempDiv.querySelectorAll('img'));
	const textContent = tempDiv.textContent?.replace(/\s+/g, '').trim() || '';
	const isImageOnly = imgs.length > 0 && textContent.length === 0;
	
	for (const img of imgs) {
		img.removeAttribute('width');
		img.removeAttribute('height');
		img.classList.remove('block', 'mx-auto', 'inline-block', 'align-middle');
		if (isImageOnly) {
			// Block-centered image — no accompanying text
			img.classList.add('block', 'mx-auto', 'max-h-36', 'max-w-full', 'object-contain', 'rounded-lg', 'my-1');
			img.setAttribute('data-display', 'block');
		} else {
			// Inline image alongside text
			img.classList.add('inline-block', 'align-middle', 'max-h-24', 'max-w-full', 'object-contain', 'mx-1', 'my-0.5');
			img.style.verticalAlign = 'middle';
			img.setAttribute('data-display', 'inline');
		}
	}
	
	return tempDiv.innerHTML.trim();
}

/**
 * Strip a leading number prefix like "1. ", "2) ", "(3) " from the beginning of HTML content.
 */
function stripLeadingNumberPrefix(html: string): string {
	return html.replace(/^\s*(?:\(\d+\)|\d+[.\)])\s*/i, '').trim();
}

/**
 * Strip a leading letter prefix like "A. ", "B) ", "(C) " from the beginning of HTML content.
 */
function stripLeadingLetterPrefix(html: string): string {
	return html.replace(/^\s*(?:\([A-Za-z]\)|[A-Za-z][.\)])\s*/i, '').trim();
}

/**
 * Normalize HTML for a menjodohkan item (left or right card).
 * Applies image classes, merges broken paragraphs, cleans empty tags.
 */
function normalizeMatchingItemHtml(html: string): string {
	if (!html || typeof html !== 'string') return html || '';
	let res = html;
	// Apply correct image classes based on data-display attribute
	res = res.replace(/<img\b([^>]*)>/gi, (match, attrs) => {
		let newAttrs = attrs;
		const isBlock = /\bdata-display\s*=\s*"block"/i.test(newAttrs);
		if (/class\s*=\s*"([^"]*)"/i.test(newAttrs)) {
			newAttrs = newAttrs.replace(/class\s*=\s*"([^"]*)"/i, (_: string, cls: string) => {
				let classes = cls.split(/\s+/).filter(Boolean);
				if (isBlock) {
					classes = classes.filter(c => c !== 'inline-block' && c !== 'align-middle');
					if (!classes.includes('block')) classes.push('block');
					if (!classes.includes('mx-auto')) classes.push('mx-auto');
					if (!classes.some(c => c.startsWith('max-h-'))) classes.push('max-h-36');
					if (!classes.includes('object-contain')) classes.push('object-contain');
					if (!classes.includes('rounded-lg')) classes.push('rounded-lg');
				} else {
					classes = classes.filter(c => c !== 'block' && c !== 'mx-auto');
					if (!classes.includes('inline-block')) classes.push('inline-block');
					if (!classes.includes('align-middle')) classes.push('align-middle');
					if (!classes.some(c => c.startsWith('max-h-'))) classes.push('max-h-24');
					if (!classes.includes('object-contain')) classes.push('object-contain');
				}
				return `class="${classes.join(' ')}"`;
			});
		} else {
			if (isBlock) {
				newAttrs += ' class="block mx-auto max-h-36 max-w-full object-contain rounded-lg my-1"';
			} else {
				newAttrs += ' class="inline-block align-middle max-h-24 max-w-full object-contain mx-1 my-0.5"';
			}
		}
		return `<img${newAttrs}>`;
	});
	// Clean empty paragraphs
	res = res.replace(/<p[^>]*>\s*<\/p>/gi, '');
	return res.trim();
}

function formatElementsImages(elements: Element[]) {
	for (let i = 0; i < elements.length; i++) {
		const el = elements[i];
		const imgs = Array.from(el.querySelectorAll('img'));
		if (imgs.length === 0) continue;

		const textTrimmed = (el.textContent || '').replace(/\s+/g, ' ').trim();

		if (textTrimmed.length > 0) {
			// Case 1: Image is in the same paragraph as text (sambung dengan teks)
			for (const img of imgs) {
				img.classList.remove('block', 'mx-auto');
				img.classList.add('inline-block', 'align-middle', 'max-h-48', 'max-w-full', 'object-contain', 'my-0.5', 'mx-1');
				img.style.verticalAlign = 'middle';
				img.setAttribute('data-display', 'inline');
			}
		} else {
			// Case 2: Paragraph contains ONLY image(s) and no text
			const prev = i > 0 ? elements[i - 1] : null;
			const next = i < elements.length - 1 ? elements[i + 1] : null;
			const prevText = (prev?.textContent || '').trim();
			const nextText = (next?.textContent || '').trim();

			// Check if this was an accidental mid-sentence split
			const prevEndsWithoutPunctuation = prevText.length > 0 && !/[\.\:\?\!\;]$/.test(prevText);
			const nextStartsWithContinuation = nextText.length > 0 && /^[a-z0-9,\.\+\-\*\/=><\(\[\{]/.test(nextText);

			if (prev && next && prevEndsWithoutPunctuation && nextStartsWithContinuation) {
				// Mid-sentence split: merge into prev paragraph
				for (const img of imgs) {
					img.classList.remove('block', 'mx-auto');
					img.classList.add('inline-block', 'align-middle', 'max-h-48', 'max-w-full', 'object-contain', 'my-0.5', 'mx-1');
					img.style.verticalAlign = 'middle';
					img.setAttribute('data-display', 'inline');
					prev.appendChild(document.createTextNode(' '));
					prev.appendChild(img);
					prev.appendChild(document.createTextNode(' '));
				}
				while (next.firstChild) {
					prev.appendChild(next.firstChild);
				}
				elements.splice(i, 2);
				i--;
			} else {
				// Standalone block image (dibuat per baris di Word)
				for (const img of imgs) {
					img.classList.remove('inline-block', 'align-middle');
					img.classList.add('block', 'mx-auto', 'max-h-72', 'max-w-full', 'object-contain', 'rounded-lg', 'border', 'border-slate-200', 'my-2');
					img.setAttribute('data-display', 'block');
				}
				el.classList.add('text-center', 'my-2');
			}
		}
	}
}

export function normalizeQuestionHtml(html: string): string {
	if (!html || typeof html !== 'string') return html || '';

	let res = html;

	// 1. Normalize image elements while respecting inline vs block
	res = res.replace(/<img\b([^>]*)>/gi, (match, attrs) => {
		let newAttrs = attrs;
		const isExplicitBlock = /\bdata-display\s*=\s*"block"/i.test(newAttrs) || (/\bclass\s*=\s*"[^"]*\bblock\b[^"]*"/i.test(newAttrs) && !/\binline-block\b/i.test(newAttrs));

		if (/class\s*=\s*"([^"]*)"/i.test(newAttrs)) {
			newAttrs = newAttrs.replace(/class\s*=\s*"([^"]*)"/i, (_: string, cls: string) => {
				let classes = cls.split(/\s+/).filter(Boolean);
				if (isExplicitBlock) {
					classes = classes.filter(c => c !== 'inline-block' && c !== 'align-middle');
					if (!classes.includes('block')) classes.push('block');
					if (!classes.includes('mx-auto')) classes.push('mx-auto');
					if (!classes.includes('max-h-72') && !classes.includes('max-h-64') && !classes.includes('max-h-96')) {
						classes.push('max-h-72');
					}
					if (!classes.includes('object-contain')) classes.push('object-contain');
					if (!classes.includes('rounded-lg')) classes.push('rounded-lg');
					if (!classes.includes('border')) classes.push('border', 'border-slate-200');
					if (!classes.includes('my-2') && !classes.includes('my-3')) classes.push('my-2');
				} else {
					// Inline image
					classes = classes.filter(c => c !== 'block' && c !== 'mx-auto');
					if (!classes.includes('inline-block')) classes.push('inline-block');
					if (!classes.includes('align-middle')) classes.push('align-middle');
					if (!classes.includes('max-h-48') && !classes.includes('max-h-32')) classes.push('max-h-48');
					if (!classes.includes('object-contain')) classes.push('object-contain');
					// Strip heavy border/shadow from inline formulas so they flow seamlessly
					if (classes.includes('border-slate-200') || classes.includes('shadow-xs')) {
						classes = classes.filter(c => !['border', 'border-slate-200', 'shadow-xs', 'rounded-lg'].includes(c));
					}
					classes = classes.map(c => (c === 'my-2' || c === 'my-3' ? 'my-0.5' : c));
					if (!classes.includes('mx-0.5') && !classes.includes('mx-1')) {
						classes.push('mx-0.5');
					}
				}
				return `class="${classes.join(' ')}"`;
			});
		} else {
			if (isExplicitBlock) {
				newAttrs += ' class="block mx-auto max-h-72 max-w-full object-contain rounded-lg border border-slate-200 my-2"';
			} else {
				newAttrs += ' class="inline-block align-middle max-h-48 max-w-full object-contain my-0.5 mx-1" style="vertical-align: middle;"';
			}
		}

		if (!isExplicitBlock && !/style\s*=/i.test(newAttrs)) {
			newAttrs += ' style="vertical-align: middle;"';
		}

		return `<img${newAttrs}>`;
	});

	// 2. Only merge paragraphs broken around inline images:
	// DO NOT merge standalone block images (data-display="block" or class containing block)
	res = res.replace(/<\/p>\s*<p[^>]*>\s*(<img\b(?![^>]*(?:data-display="block"|\bblock\b))[^>]*>)\s*<\/p>\s*<p[^>]*>/gi, ' $1 ');
	res = res.replace(/<\/p>\s*<p[^>]*>\s*(<img\b(?![^>]*(?:data-display="block"|\bblock\b))[^>]*>)/gi, ' $1');
	res = res.replace(/(<img\b(?![^>]*(?:data-display="block"|\bblock\b))[^>]*>)\s*<\/p>\s*<p[^>]*>(?=\s*[a-z0-9,\.\+\-\*\/=><\(\[\{])/gi, '$1 ');

	// Merge continuation paragraphs that start with lowercase (e.g. broken math sentences), without matching opening HTML tags
	res = res.replace(/<\/p>\s*<p[^>]*>(?=\s*[a-z,\.\+\-\*\/=])/g, ' ');

	// Clean up empty paragraphs
	res = res.replace(/<p[^>]*>\s*<\/p>/gi, '');

	return res;
}
