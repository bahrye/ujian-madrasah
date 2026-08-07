export function parseWordHtmlToQuestions(html) {
	// Convert soft returns to separate paragraphs to avoid swallowing KUNCI: tags
	html = html.replace(/<br\s*\/?>/gi, '</p><p>');
	
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, 'text/html');
	
	const questions = [];
	let currentQuestion = null;
	let parsingState = 'question'; // 'question' | 'options'
	let hasFoundFirstQuestion = false;
	
	Array.from(doc.body.children).forEach(el => {
		let text = el.textContent.trim();
		
		// Wait until we find the first question to avoid parsing instructions
		if (!hasFoundFirstQuestion) {
			if (/^\d+[\.\)]\s/.test(text)) {
				hasFoundFirstQuestion = true;
			} else {
				return;
			}
		}
		
		// Check if it's a new question (starts with number and dot/parenthesis)
		if (/^\d+[\.\)]\s/.test(text) && parsingState !== 'options') {
			if (currentQuestion) {
				questions.push(currentQuestion);
			}
			currentQuestion = {
				questionHtml: [],
				options: [],
				answer: null,
				type: 'pilihan_ganda'
			};
			
			// Clone and remove the "1. " from the question text
			const cloned = el.cloneNode(true);
			const walker = document.createTreeWalker(cloned, NodeFilter.SHOW_TEXT, null, false);
			let firstText = walker.nextNode();
			while (firstText) {
				if (firstText.nodeValue.trim().length > 0) {
					firstText.nodeValue = firstText.nodeValue.replace(/^\d+[\.\)]\s*/, '');
					break;
				}
				firstText = walker.nextNode();
			}
			
			// Mammoth might produce empty paragraphs with images, we shouldn't skip them
			currentQuestion.questionHtml.push(cloned.outerHTML);
			parsingState = 'question';
			return;
		}
		
		// Check if it's an option (starts with A., B., C., D., E.)
		const optionMatch = text.match(/^([a-eA-E])[\.\)]\s*(.*)/);
		if (optionMatch && currentQuestion) {
			parsingState = 'options';
			const cloned = el.cloneNode(true);
			const walker = document.createTreeWalker(cloned, NodeFilter.SHOW_TEXT, null, false);
			let firstText = walker.nextNode();
			while (firstText) {
				if (firstText.nodeValue.trim().length > 0) {
					firstText.nodeValue = firstText.nodeValue.replace(/^[a-eA-E][\.\)]\s*/i, '');
					break;
				}
				firstText = walker.nextNode();
			}
			
			currentQuestion.options.push({
				id: optionMatch[1].toUpperCase(),
				html: cloned.innerHTML
			});
			return;
		}
		
		// Check if it's the answer key (KUNCI: A)
		const keyMatch = text.match(/^KUNCI:\s*(.+)/i);
		if (keyMatch && currentQuestion) {
			currentQuestion.answer = keyMatch[1].trim();
			parsingState = 'question'; // Reset state for safety
			
			// Push the current question because it's complete
			questions.push(currentQuestion);
			currentQuestion = null;
			return;
		}
		
		// Otherwise, append to current state
		if (currentQuestion) {
			// Ignore completely empty paragraphs unless they have images
			const hasImg = el.querySelector('img');
			if (text.length === 0 && !hasImg) {
				return;
			}
			
			if (parsingState === 'question') {
				// If we don't have a question started yet, but there's text/image,
				// it means the user forgot to start with "1. ". We'll create one.
				if (currentQuestion.questionHtml.length === 0 && !/^\d+[\.\)]/.test(text)) {
					currentQuestion.questionHtml.push(el.outerHTML);
				} else {
					currentQuestion.questionHtml.push(el.outerHTML);
				}
			} else if (parsingState === 'options' && currentQuestion.options.length > 0) {
				// Append to the last option (e.g. multi-paragraph option or image below option text)
				currentQuestion.options[currentQuestion.options.length - 1].html += '<br>' + el.innerHTML;
			}
		} else {
			// If no current question, and we found text without number
			// Initialize a new question implicitly, but only if we are past the first question
			if (hasFoundFirstQuestion && (text.length > 0 || el.querySelector('img'))) {
				currentQuestion = {
					questionHtml: [el.outerHTML],
					options: [],
					answer: null,
					type: 'pilihan_ganda'
				};
				parsingState = 'question';
			}
		}
	});
	
	// If the file ends without KUNCI for the last question, still push it
	if (currentQuestion && !questions.includes(currentQuestion)) {
		questions.push(currentQuestion);
	}
	
	return questions.map(q => {
		// Clean up MS Word Equation format inside options and questions just in case!
		const cleanEq = (html) => {
			if (!html) return html;
			return html
				.replace(/〖([^〗]+)〗\^([a-zA-Z0-9]+)/g, '$1<sup>$2</sup>')
				.replace(/〖([^〗]+)〗_([a-zA-Z0-9]+)/g, '$1<sub>$2</sub>')
				.replace(/([a-zA-Z0-9\)])\^([a-zA-Z0-9]+)/g, '$1<sup>$2</sup>')
				.replace(/([a-zA-Z0-9\)])_([a-zA-Z0-9]+)/g, '$1<sub>$2</sub>');
		};
		let type = 'pilihan_ganda';
		let finalAnswer = q.answer;
		
		if (q.options.length > 0) {
			if (q.answer && (q.answer.includes(',') || q.answer.length > 1)) {
				// Multiple answers = pilihan_ganda_kompleks
				type = 'pilihan_ganda_kompleks';
				finalAnswer = q.answer.split(',').map(a => a.trim().toUpperCase());
			} else {
				type = 'pilihan_ganda';
				finalAnswer = q.answer ? q.answer.toUpperCase() : null;
			}
		} else {
			// No options
			if (q.answer && q.answer.toLowerCase() === 'essay') {
				type = 'essay';
				finalAnswer = ''; // Essays usually have manual grading
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
