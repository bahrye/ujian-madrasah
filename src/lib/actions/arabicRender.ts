export function arabicRender(node: HTMLElement, trigger?: any) {
	let timer: any = null;

	function render() {
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			if (!node || !node.isConnected) return;
			const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
			const textNodes: Text[] = [];
			let currentNode;
			
			while ((currentNode = walker.nextNode())) {
				if (
					currentNode.parentElement &&
					!['SCRIPT', 'STYLE', 'CODE', 'TEXTAREA', 'INPUT'].includes(currentNode.parentElement.tagName) &&
					!currentNode.parentElement.closest('.katex') &&
					!currentNode.parentElement.classList.contains('arabic-wrapped')
				) {
					textNodes.push(currentNode as Text);
				}
			}

			// RegExp menangkap blok berurutan yang mengandung karakter Arab, spasi, tanda baca arab, dan tanda kurung.
			const arabicRegex = /([\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u0660-\u0669\s،؛؟()]+)/g;

			textNodes.forEach((textNode) => {
				if (!textNode.parentNode) return;
				const text = textNode.nodeValue || '';
				// Cek apakah ada setidaknya satu huruf Arab beneran, bukan sekadar spasi/tanda baca
				if (/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text)) {
					const fragment = document.createDocumentFragment();
					let lastIndex = 0;
					let match;

					arabicRegex.lastIndex = 0;

					while ((match = arabicRegex.exec(text)) !== null) {
						// Jika match hanya berisi spasi atau tanda kurung (tanpa huruf arab), lewatkan.
						if (!/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(match[0])) {
							continue;
						}

						if (match.index > lastIndex) {
							fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
						}

						const arabicSpan = document.createElement('span');
						arabicSpan.className = 'arabic-wrapped text-[1.75em] leading-[2] inline-block my-1 px-1';
						arabicSpan.style.fontFamily = "'Amiri', serif";
						arabicSpan.dir = 'rtl';
						arabicSpan.textContent = match[0];
						fragment.appendChild(arabicSpan);

						lastIndex = arabicRegex.lastIndex;
					}

					if (lastIndex < text.length) {
						fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
					}

					if (fragment.childNodes.length > 0 && textNode.parentNode) {
						try {
							textNode.parentNode.replaceChild(fragment, textNode);
						} catch (e) {}
					}
				}
			});
		}, 30);
	}

	render();

	return {
		update(newTrigger?: any) {
			render();
		},
		destroy() {
			if (timer) clearTimeout(timer);
		}
	};
}
