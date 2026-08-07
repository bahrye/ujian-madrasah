export interface FinalQuestion {
	question_text: string;
	options: string[];
	correct_answer: string | string[] | null;
	type: string;
}

export function parseWordHtmlToQuestions(html: string): FinalQuestion[] {
	// Convert soft returns to separate paragraphs to avoid swallowing KUNCI: tags
	html = html.replace(/<br\s*\/?>/gi, '</p><p>');
	
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, 'text/html');
	
	// Step 1: Chunk elements by KUNCI
	const elements = Array.from(doc.body.children);
	const chunks: Element[][] = [];
	let currentChunk: Element[] = [];
	
	for (let i = 0; i < elements.length; i++) {
		const el = elements[i];
		const text = el.textContent?.trim() || '';
		
		// If we see a new question start, AND the current chunk already has substantial content
		if (/^\d+[\.\)]\s/.test(text)) {
			const hasContent = currentChunk.some(e => e.textContent?.trim() || e.querySelector('img'));
			if (hasContent) {
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
					listItems.forEach((li, idx) => {
						const id = String.fromCharCode(65 + idx);
						options.push({
							id: id,
							html: li.innerHTML || ''
						});
					});
				} else {
					questionElements = workingElements;
				}
			} else {
				questionElements = workingElements;
			}
		}
		
		if (questionElements.length > 0) {
			const firstEl = questionElements[0];
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
		
		parsedQuestions.push({
			questionHtml: questionElements.map(e => e.outerHTML),
			options: options,
			answer: answerKey
		});
	}
	
	return parsedQuestions.map(q => {
		const cleanEq = (html: string) => {
			if (!html) return html;
			return html
				.replace(/a?-([^a?-]+)a?-\^([a-zA-Z0-9]+)/g, '$1<sup>$2</sup>')
				.replace(/a?-([^a?-]+)a?-_([a-zA-Z0-9]+)/g, '$1<sub>$2</sub>')
				.replace(/([a-zA-Z0-9\)])\^([a-zA-Z0-9]+)/g, '$1<sup>$2</sup>')
				.replace(/([a-zA-Z0-9\)])_([a-zA-Z0-9]+)/g, '$1<sub>$2</sub>');
		};
		
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
			question_text: cleanEq(q.questionHtml.join('')),
			options: q.options.map(opt => cleanEq(opt.html)),
			correct_answer: finalAnswer,
			type: type
		};
	});
}
