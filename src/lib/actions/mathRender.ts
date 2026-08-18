import renderMathInElement from 'katex/dist/contrib/auto-render.mjs';

export function mathRender(node: HTMLElement, trigger?: any) {
	let timer: any = null;

	function render() {
		if (!node || !node.isConnected) return;
		try {
			renderMathInElement(node, {
				delimiters: [
					{ left: '$$', right: '$$', display: true },
					{ left: '\\[', right: '\\]', display: true },
					{ left: '$', right: '$', display: false },
					{ left: '\\(', right: '\\)', display: false }
				],
				throwOnError: false,
				errorColor: '#ef4444'
			});
		} catch (err) {
			console.error('KaTeX rendering error:', err);
		}
	}

	render();

	return {
		update(trigger: any) {
			if (timer) clearTimeout(timer);
			timer = setTimeout(() => {
				render();
			}, 10);
		},
		destroy() {
			if (timer) clearTimeout(timer);
		}
	};
}
