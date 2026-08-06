import renderMathInElement from 'katex/dist/contrib/auto-render.mjs';

export function mathRender(node: HTMLElement) {
	function render() {
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
			setTimeout(() => {
				render();
			}, 10);
		},
		destroy() {}
	};
}
