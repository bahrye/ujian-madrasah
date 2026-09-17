/**
 * Camera Utility for Battery-Friendly & Low-Data Micro-Snapshots
 * Designed for Madrasah Exam Anti-Cheating & Proctoring
 */

export interface CameraSnapshotOptions {
	maxWidth?: number;
	maxHeight?: number;
	quality?: number; // 0.1 - 1.0 (default 0.65 for sharp ~20-30KB file)
	timeoutMs?: number;
}

/**
 * Captures a single lightweight micro-snapshot from the front webcam/camera,
 * compresses it to 480x360 WebP (or JPEG fallback), and immediately shuts off
 * the camera hardware to prevent battery drain and overheating.
 */
export async function captureMicroSnapshot(options: CameraSnapshotOptions = {}): Promise<string | null> {
	if (typeof window === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
		return null;
	}

	const width = options.maxWidth || 480;
	const height = options.maxHeight || 360;
	const quality = options.quality || 0.65;
	const timeoutMs = options.timeoutMs || 2500;

	let stream: MediaStream | null = null;

	try {
		// Enforce timeout so slow devices never freeze the UI
		const streamPromise = navigator.mediaDevices.getUserMedia({
			video: {
				facingMode: 'user',
				width: { ideal: width },
				height: { ideal: height }
			},
			audio: false
		});

		const timeoutPromise = new Promise<null>((_, reject) => {
			setTimeout(() => reject(new Error('Camera timeout')), timeoutMs);
		});

		stream = (await Promise.race([streamPromise, timeoutPromise])) as MediaStream;
		if (!stream) return null;

		const video = document.createElement('video');
		video.muted = true;
		video.playsInline = true;
		video.autoplay = true;
		video.srcObject = stream;

		await new Promise<void>((resolve) => {
			video.onloadeddata = () => resolve();
			setTimeout(resolve, 800); // safety fallback
		});

		try {
			await video.play();
		} catch {}

		// Render frame to small canvas
		const canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext('2d');
		if (!ctx) return null;

		ctx.drawImage(video, 0, 0, width, height);

		// Compress to WebP or JPEG
		let dataUrl = canvas.toDataURL('image/webp', quality);
		if (!dataUrl.startsWith('data:image/webp')) {
			dataUrl = canvas.toDataURL('image/jpeg', quality);
		}

		return dataUrl;
	} catch (err) {
		// Gracefully handle devices with no camera, permission denied, or background restrictions
		console.warn('captureMicroSnapshot skipped:', (err as any)?.message || err);
		return null;
	} finally {
		// Crucial: Stop all tracks IMMEDIATELY to put camera sensor to sleep
		if (stream) {
			try {
				stream.getTracks().forEach((track) => {
					track.stop();
				});
			} catch {}
		}
	}
}

/**
 * Starts a live stream into a provided video element for the pre-exam selfie check-in.
 */
export async function startCameraPreview(
	videoElement: HTMLVideoElement,
	width = 480,
	height = 360
): Promise<MediaStream | null> {
	if (typeof window === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
		return null;
	}

	try {
		const stream = await navigator.mediaDevices.getUserMedia({
			video: {
				facingMode: 'user',
				width: { ideal: width },
				height: { ideal: height }
			},
			audio: false
		});

		videoElement.srcObject = stream;
		videoElement.muted = true;
		videoElement.playsInline = true;
		videoElement.autoplay = true;
		try {
			await videoElement.play();
		} catch {}

		return stream;
	} catch (err) {
		console.warn('startCameraPreview error:', err);
		return null;
	}
}

/**
 * Stops an active MediaStream.
 */
export function stopCameraStream(stream: MediaStream | null) {
	if (!stream) return;
	try {
		stream.getTracks().forEach((track) => track.stop());
	} catch {}
}

/**
 * Takes snapshot from an already playing video element without re-requesting stream.
 */
export function snapshotFromVideo(
	video: HTMLVideoElement,
	width = 480,
	height = 360,
	quality = 0.65
): string {
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext('2d');
	if (ctx) {
		ctx.drawImage(video, 0, 0, width, height);
	}
	let dataUrl = canvas.toDataURL('image/webp', quality);
	if (!dataUrl.startsWith('data:image/webp')) {
		dataUrl = canvas.toDataURL('image/jpeg', quality);
	}
	return dataUrl;
}
