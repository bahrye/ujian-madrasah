export function pinchZoom(node: HTMLElement) {
	let scale = 1;
	let startX = 0;
	let startY = 0;
	let translateX = 0;
	let translateY = 0;
	let lastX = 0;
	let lastY = 0;

	let initialPinchDistance = 0;
	let initialScale = 1;

	function getDistance(touches: TouchList) {
		const dx = touches[0].clientX - touches[1].clientX;
		const dy = touches[0].clientY - touches[1].clientY;
		return Math.sqrt(dx * dx + dy * dy);
	}

	function updateTransform() {
		// Use requestAnimationFrame for smoother updates
		requestAnimationFrame(() => {
			node.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
		});
	}

	function onTouchStart(e: TouchEvent) {
		if (e.touches.length === 2) {
			e.preventDefault();
			initialPinchDistance = getDistance(e.touches);
			initialScale = scale;
		} else if (e.touches.length === 1) {
			startX = e.touches[0].clientX;
			startY = e.touches[0].clientY;
			lastX = translateX;
			lastY = translateY;
		}
	}

	function onTouchMove(e: TouchEvent) {
		if (e.touches.length === 2) {
			e.preventDefault();
			const currentDistance = getDistance(e.touches);
			scale = Math.min(Math.max(1, initialScale * (currentDistance / initialPinchDistance)), 6);
			
			if (scale === 1) {
				translateX = 0;
				translateY = 0;
			}
			updateTransform();
		} else if (e.touches.length === 1 && scale > 1) {
			e.preventDefault();
			const dx = e.touches[0].clientX - startX;
			const dy = e.touches[0].clientY - startY;
			
			translateX = lastX + dx;
			translateY = lastY + dy;
			updateTransform();
		}
	}

	function onWheel(e: WheelEvent) {
		e.preventDefault();
		const delta = e.deltaY > 0 ? -0.2 : 0.2;
		scale = Math.min(Math.max(1, scale + delta), 6);
		if (scale === 1) {
			translateX = 0;
			translateY = 0;
		}
		updateTransform();
	}

	// Double tap to zoom in/out
	let lastTap = 0;
	function onTouchEnd(e: TouchEvent) {
		const currentTime = new Date().getTime();
		const tapLength = currentTime - lastTap;
		if (tapLength < 300 && tapLength > 0) {
			e.preventDefault();
			// Reset or Zoom in
			if (scale > 1) {
				scale = 1;
				translateX = 0;
				translateY = 0;
			} else {
				scale = 2.5; // Double tap zooms to 2.5x
			}
			node.style.transition = 'transform 0.3s ease-out';
			updateTransform();
			setTimeout(() => { node.style.transition = 'none'; }, 300);
		} else {
			node.style.transition = 'none';
		}
		lastTap = currentTime;
	}

	function onDblClick(e: MouseEvent) {
		if (scale > 1) {
			scale = 1;
			translateX = 0;
			translateY = 0;
		} else {
			scale = 2.5;
		}
		node.style.transition = 'transform 0.3s ease-out';
		updateTransform();
		setTimeout(() => { node.style.transition = 'none'; }, 300);
	}

	node.addEventListener('touchstart', onTouchStart, { passive: false });
	node.addEventListener('touchmove', onTouchMove, { passive: false });
	node.addEventListener('touchend', onTouchEnd, { passive: false });
	node.addEventListener('wheel', onWheel, { passive: false });
	node.addEventListener('dblclick', onDblClick);
	
	node.style.touchAction = 'none'; // Prevent browser default handling (scrolling)
	node.style.transformOrigin = 'center center';
	node.style.willChange = 'transform';

	return {
		destroy() {
			node.removeEventListener('touchstart', onTouchStart);
			node.removeEventListener('touchmove', onTouchMove);
			node.removeEventListener('touchend', onTouchEnd);
			node.removeEventListener('wheel', onWheel);
			node.removeEventListener('dblclick', onDblClick);
		}
	};
}
