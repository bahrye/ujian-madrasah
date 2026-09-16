let renderMathInElementFn: any = null;

export function mathRender(node: HTMLElement, trigger?: any) {
	let timer: any = null;

	async function render() {
		if (typeof window === 'undefined' || !node || !node.isConnected) return;
		try {
			if (!renderMathInElementFn) {
				const mod = await import('katex/dist/contrib/auto-render.mjs');
				renderMathInElementFn = (mod as any).default || mod;
			}
			renderMathInElementFn(node, {
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

	if (typeof window !== 'undefined') {
		timer = setTimeout(render, 50);
	}

	return {
		update(trigger: any) {
			if (timer) clearTimeout(timer);
			timer = setTimeout(render, 50);
		},
		destroy() {
			if (timer) clearTimeout(timer);
		}
	};
}
