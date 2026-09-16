<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, beforeNavigate, invalidateAll } from '$app/navigation';
	import Timer from '$lib/components/exam/Timer.svelte';
	import QuestionRenderer from '$lib/components/exam/QuestionRenderer.svelte';
	import QuestionNav from '$lib/components/exam/QuestionNav.svelte';
	import { ICONS } from '$lib/utils/constants';
	import Toast from '$lib/components/ui/Toast.svelte';
	import { toasts } from '$lib/stores/toast';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	export let data;

	$: attempt = (data?.attempt || {}) as any;
	$: questions = (data?.questions || []) as any[];
	$: answerMap = (data?.answerMap || {}) as Record<number, any>;
	$: officialReloadKey = `allowed_official_reload_${attempt?.id || ''}`;

	let currentIndex = 0;
	let showNav = false;
	let showSubmitConfirm = false;
	let submitting = false;

	// Anti-cheat v2 state
	let isExamBlurred = false;
	let isFullscreen = false;
	let cheatWarningTimeout: any;
	let cheatCountdownInterval: any;
	let cheatCountdownRemaining = 0;
	let hasEnteredFullscreenOnce = false; // Track jika siswa sudah pernah masuk fullscreen

	// Anti-cheat state
	let currentEndTime = data?.attempt?.end_time;
	let isPausedByProctor = data?.attempt?.is_paused === 1;
	$: if (data?.attempt) {
		if (data.attempt.end_time && data.attempt.end_time !== currentEndTime) {
			currentEndTime = data.attempt.end_time;
		}
		isPausedByProctor = data.attempt.is_paused === 1;
	}
	let statusPollingInterval: any;
	
	let warnings = 0;
	let showWarningModal = false;
	let showDisqualifiedModal = false;
	let showTimeUpModal = false;
	const MAX_WARNINGS = 3;
	let isUnloading = false;
	
	let titleElement: HTMLElement;
	let titleClientWidth = 0;
	let isTitleOverflowing = false;
	$: if (titleElement && titleClientWidth) {
		setTimeout(() => {
			if (titleElement) {
				isTitleOverflowing = titleElement.scrollWidth > titleClientWidth;
			}
		}, 0);
	}


	let wakeLock: any = null;

	async function requestWakeLock() {
		try {
			if ('wakeLock' in navigator) {
				wakeLock = await (navigator as any).wakeLock.request('screen');
				wakeLock.addEventListener('release', () => {
					console.log('Screen Wake Lock released');
				});
				console.log('Screen Wake Lock acquired');
			}
		} catch (err: any) {
			console.error(`Wake Lock error: ${err.name}, ${err.message}`);
		}
	}

	let warningLogs: { time: number, type: string }[] = [];

	onMount(() => {
		if (!attempt?.id) return;
		requestWakeLock();
		
		if (browser) {
			isFullscreen = !!document.fullscreenElement;
		}
		const savedWarnings = localStorage.getItem(`warnings_${attempt.id}`);
		const savedLogs = localStorage.getItem(`warningLogs_${attempt.id}`);
		
		if (savedLogs) {
			try { warningLogs = JSON.parse(savedLogs); } catch {}
		}

		if (savedWarnings) {
			warnings = parseInt(savedWarnings, 10);
			if (warnings > MAX_WARNINGS) {
				triggerDisqualification();
			}
			// Jika siswa sudah punya pelanggaran, berarti sudah pernah masuk fullscreen sebelumnya
			if (warnings > 0) {
				hasEnteredFullscreenOnce = true;
			}
		}
		
		// Cek apakah siswa sudah pernah masuk fullscreen (dari localStorage)
		const savedFullscreenFlag = localStorage.getItem(`hasEnteredFullscreen_${attempt.id}`);
		if (savedFullscreenFlag === 'true') {
			hasEnteredFullscreenOnce = true;
		}
		
		// Jika ada saved deadline, siswa pasti sudah pernah masuk fullscreen
		const hasSavedDeadline = localStorage.getItem(`cheat_deadline_${attempt.id}`) || sessionStorage.getItem(`cheat_deadline_${attempt.id}`);
		if (hasSavedDeadline) {
			hasEnteredFullscreenOnce = true;
		}
		
		const savedIndex = localStorage.getItem(`currentIndex_${attempt.id}`);
		if (savedIndex) {
			const idx = parseInt(savedIndex, 10);
			if (!isNaN(idx) && idx >= 0 && idx < questions.length) {
				currentIndex = idx;
			}
		}

		// Cek apakah reload ini dipicu resmi dari tombol muat ulang website
		if (sessionStorage.getItem(officialReloadKey) === 'true') {
			isOfficialReload = true;
			sessionStorage.removeItem(officialReloadKey);
			// Hapus cheat deadline saat official reload agar tidak tercatat pelanggaran palsu
			localStorage.removeItem(`cheat_deadline_${attempt.id}`);
			localStorage.removeItem(`cheat_type_${attempt.id}`);
			sessionStorage.removeItem(`cheat_deadline_${attempt.id}`);
			sessionStorage.removeItem(`cheat_type_${attempt.id}`);
		}

		// Cek apakah sebelum reload/tutup halaman siswa sedang dalam masa jeda peringatan (misal keluar fullscreen di HP)
		const savedDeadline = localStorage.getItem(`cheat_deadline_${attempt.id}`) || sessionStorage.getItem(`cheat_deadline_${attempt.id}`);
		const savedCheatType = localStorage.getItem(`cheat_type_${attempt.id}`) || sessionStorage.getItem(`cheat_type_${attempt.id}`) || 'Keluar dari Layar Penuh';
		if (savedDeadline && !isOfficialReload) {
			const deadline = parseInt(savedDeadline, 10);
			const remainingMs = deadline - Date.now();
			if (remainingMs <= 0) {
				// Waktu toleransi sudah habis saat halaman ditutup/ditinggalkan! Catat pelanggaran seketika!
				localStorage.removeItem(`cheat_deadline_${attempt.id}`);
				localStorage.removeItem(`cheat_type_${attempt.id}`);
				sessionStorage.removeItem(`cheat_deadline_${attempt.id}`);
				sessionStorage.removeItem(`cheat_type_${attempt.id}`);
				warnings += 1;
				warningLogs.push({ time: Date.now(), type: savedCheatType });
				localStorage.setItem(`warnings_${attempt.id}`, warnings.toString());
				localStorage.setItem(`warningLogs_${attempt.id}`, JSON.stringify(warningLogs));
				triggerAutoSave();
				if (warnings > MAX_WARNINGS) {
					triggerDisqualification();
				} else {
					showWarningModal = true;
				}
			} else {
				// Lanjutkan sisa waktu jeda toleransi tanpa mereset ke 10 detik penuh!
				handleCheatWarning(savedCheatType, remainingMs);
			}
		}

		// Berikan jeda inisialisasi 3 detik agar transisi modal/pop-up awal dan reload resmi tidak memicu false-positive pelanggaran
		setTimeout(() => {
			isMountedAndReady = true;
			isOfficialReload = false;
			// Jika siswa sudah pernah masuk fullscreen sebelumnya, otomatis masuk fullscreen tanpa overlay
			if (hasEnteredFullscreenOnce && !isFullscreen && !showDisqualifiedModal) {
				enterFullscreen();
			}
		}, 3000);

		statusPollingInterval = setInterval(async () => {
			if (isUnloading || submitting || showSubmitConfirm || typeof document !== 'undefined' && document.hidden) return;
			try {
				const res = await fetch(`/api/attempt-status/${attempt.id}`);
				if (res.ok) {
					const data = await res.json() as any;
					if (data.end_time && data.end_time !== currentEndTime) {
						currentEndTime = data.end_time;
					}
					isPausedByProctor = data.is_paused;
					if (data.status !== 'mengerjakan' && data.status !== attempt.status) {
						sessionStorage.setItem(officialReloadKey, 'true');
						window.location.reload();
					}
				}
			} catch (e) {}
		}, 30000);
	});

	let isOfficialReload = false;
	let isMountedAndReady = false;

	onDestroy(() => {
		stopWarningSoundLoop();
		if (wakeLock !== null) {
			wakeLock.release();
			wakeLock = null;
		}
		if (singleAnswerDebounceTimer) {
			clearTimeout(singleAnswerDebounceTimer);
			singleAnswerDebounceTimer = null;
		}
		if (statusPollingInterval) clearInterval(statusPollingInterval);
		if (typeof document !== 'undefined' && document.fullscreenElement) {
			document.exitFullscreen().catch(() => {});
		}
	});

	beforeNavigate(({ cancel, willUnload }) => {
		if (!submitting && !isDisqualifying) {
			if (willUnload) {
				isUnloading = true;
			} else {
				toasts.error('Anda tidak diizinkan keluar dari halaman saat ujian berlangsung!');
				cancel();
			}
		}
	});

	let isManualReload = false;
	
	async function triggerReload() {
		// Masuk ke fullscreen langsung karena ini dipicu oleh klik (user gesture)
		if (!document.fullscreenElement) {
			await enterFullscreen();
		}

		isOfficialReload = true;
		isManualReload = true;
		isUnloading = true;
		
		if (cheatWarningTimeout) clearTimeout(cheatWarningTimeout);
		if (cheatCountdownInterval) clearInterval(cheatCountdownInterval);
		isExamBlurred = false;
		
		try {
			await saveCurrentAnswer(true);
		} catch {}
		
		// Gunakan invalidateAll untuk soft-reload data tanpa mereload DOM/Browser
		await invalidateAll();
		
		setTimeout(() => {
			isOfficialReload = false;
			isManualReload = false;
			isUnloading = false;
			toasts.success('Halaman berhasil dimuat ulang');
		}, 500);
	}

	function handleBeforeUnload(e: BeforeUnloadEvent) {
		isUnloading = true;
		if (cheatWarningTimeout) clearTimeout(cheatWarningTimeout);
		if (cheatCountdownInterval) clearInterval(cheatCountdownInterval);
		if (!submitting && !isDisqualifying && !isManualReload && !isOfficialReload) {
			e.preventDefault();
			e.returnValue = '';
		}
		setTimeout(() => {
			isUnloading = false;
			isManualReload = false;
		}, 1000);
	}

	// Sound Warning Helper (Web Audio API Synthesizer)
	let warningAudioCtx: AudioContext | null = null;
	let warningSoundInterval: any = null;

	function playWarningBeep() {
		try {
			if (!warningAudioCtx) {
				const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
				if (AudioContextClass) {
					warningAudioCtx = new AudioContextClass();
				}
			}
			if (warningAudioCtx && warningAudioCtx.state === 'suspended') {
				warningAudioCtx.resume();
			}
			if (!warningAudioCtx) return;

			// Getarkan perangkat HP/Tablet fisik jika mendukung Vibration API
			if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
				try {
					navigator.vibrate([250, 100, 250]);
				} catch {}
			}

			const now = warningAudioCtx.currentTime;

			// Tone 1: Sirene utama amplitudo maksimal (1400Hz -> 700Hz)
			const osc1 = warningAudioCtx.createOscillator();
			const gain1 = warningAudioCtx.createGain();
			osc1.type = 'sawtooth';
			osc1.frequency.setValueAtTime(1400, now);
			osc1.frequency.exponentialRampToValueAtTime(700, now + 0.22);

			gain1.gain.setValueAtTime(1.0, now); // Gain maksimal 100%
			gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.24);

			osc1.connect(gain1);
			gain1.connect(warningAudioCtx.destination);
			osc1.start(now);
			osc1.stop(now + 0.24);

			// Tone 2: Harmonis nada tinggi (2800Hz) untuk menembus batas frekuensi speaker minim
			const osc2 = warningAudioCtx.createOscillator();
			const gain2 = warningAudioCtx.createGain();
			osc2.type = 'square';
			osc2.frequency.setValueAtTime(2800, now);
			osc2.frequency.exponentialRampToValueAtTime(1400, now + 0.22);

			gain2.gain.setValueAtTime(0.7, now);
			gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.24);

			osc2.connect(gain2);
			gain2.connect(warningAudioCtx.destination);
			osc2.start(now);
			osc2.stop(now + 0.24);
		} catch (e) {
			console.warn('Audio play error:', e);
		}
	}

	function speakWarningAlert() {
		try {
			if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
				window.speechSynthesis.cancel();
				const msg = new SpeechSynthesisUtterance('Peringatan! Segera kembali ke layar penuh!');
				msg.lang = 'id-ID';
				msg.volume = 1.0;
				msg.rate = 1.2;
				window.speechSynthesis.speak(msg);
			}
		} catch (e) {}
	}

	function startWarningSoundLoop() {
		stopWarningSoundLoop();
		playWarningBeep();
		speakWarningAlert();
		warningSoundInterval = setInterval(() => {
			playWarningBeep();
		}, 600);
	}

	function stopWarningSoundLoop() {
		if (warningSoundInterval) {
			clearInterval(warningSoundInterval);
			warningSoundInterval = null;
		}
		try {
			if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
				window.speechSynthesis.cancel();
			}
		} catch (e) {}
	}

	let isDisqualifying = false;

	function sendViolationBeacon(type: string) {
		if (!attempt?.id) return;
		const payload = JSON.stringify({
			attempt_id: attempt.id,
			violation_type: type
		});

		let sent = false;
		if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
			try {
				const blob = new Blob([payload], { type: 'application/json' });
				sent = navigator.sendBeacon('/api/student/log-violation', blob);
			} catch (e) {
				sent = false;
			}
		}

		if (!sent && typeof fetch !== 'undefined') {
			fetch('/api/student/log-violation', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: payload,
				keepalive: true
			}).catch(() => {});
		}
	}

	function triggerViolation(type: string) {
		localStorage.removeItem(`cheat_deadline_${attempt.id}`);
		localStorage.removeItem(`cheat_type_${attempt.id}`);
		sessionStorage.removeItem(`cheat_deadline_${attempt.id}`);
		sessionStorage.removeItem(`cheat_type_${attempt.id}`);
		if (isUnloading || isManualReload || isOfficialReload || !isMountedAndReady || showWarningModal || showDisqualifiedModal || submitting || isPausedByProctor) return;
		
		warnings += 1;
		warningLogs.push({ time: Date.now(), type });
		localStorage.setItem(`warnings_${attempt.id}`, warnings.toString());
		localStorage.setItem(`warningLogs_${attempt.id}`, JSON.stringify(warningLogs));
		
		// Kirim instan tanpa terkena throttle / freeze browser
		sendViolationBeacon(type);
		saveCurrentAnswer(false);
		isExamBlurred = false;

		if (warnings > MAX_WARNINGS) {
			stopWarningSoundLoop();
			triggerDisqualification();
		} else {
			showWarningModal = true;
			startWarningSoundLoop();
		}
	}

	function handleCheatWarning(type: string, toleranceMs: number) {
		if (isUnloading || isManualReload || isOfficialReload || (!isMountedAndReady && !localStorage.getItem(`cheat_deadline_${attempt.id}`) && !sessionStorage.getItem(`cheat_deadline_${attempt.id}`)) || showWarningModal || showDisqualifiedModal || submitting || isPausedByProctor) return;
		
		isExamBlurred = true;
		if (cheatWarningTimeout) clearTimeout(cheatWarningTimeout);
		if (cheatCountdownInterval) clearInterval(cheatCountdownInterval);
		
		const deadline = Date.now() + toleranceMs;
		localStorage.setItem(`cheat_deadline_${attempt.id}`, deadline.toString());
		localStorage.setItem(`cheat_type_${attempt.id}`, type);
		sessionStorage.setItem(`cheat_deadline_${attempt.id}`, deadline.toString());
		sessionStorage.setItem(`cheat_type_${attempt.id}`, type);
		
		cheatCountdownRemaining = Math.max(1, Math.floor(toleranceMs / 1000));

		// Bunyikan alarm suara peringatan selama masa jeda 10 detik
		startWarningSoundLoop();

		cheatCountdownInterval = setInterval(() => {
			cheatCountdownRemaining -= 1;
			if (cheatCountdownRemaining <= 0) {
				clearInterval(cheatCountdownInterval);
			}
		}, 1000);
		
		cheatWarningTimeout = setTimeout(() => {
			triggerViolation(type);
		}, toleranceMs);
	}

	function handleReturnToExam() {
		localStorage.removeItem(`cheat_deadline_${attempt.id}`);
		localStorage.removeItem(`cheat_type_${attempt.id}`);
		sessionStorage.removeItem(`cheat_deadline_${attempt.id}`);
		sessionStorage.removeItem(`cheat_type_${attempt.id}`);
		if (cheatWarningTimeout) clearTimeout(cheatWarningTimeout);
		if (cheatCountdownInterval) clearInterval(cheatCountdownInterval);
		cheatCountdownRemaining = 0;
		if (isExamBlurred) {
			isExamBlurred = false;
		}
		// Hentikan suara alarm begitu siswa kembali ke layar ujian
		stopWarningSoundLoop();
		if (wakeLock !== null && wakeLock.released) {
			requestWakeLock();
		} else if (wakeLock === null) {
			requestWakeLock();
		}
	}

	function unlockAudioAndVibration() {
		try {
			if (!warningAudioCtx) {
				const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
				if (AudioContextClass) {
					warningAudioCtx = new AudioContextClass();
				}
			}
			if (warningAudioCtx && warningAudioCtx.state === 'suspended') {
				warningAudioCtx.resume();
			}
			if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
				navigator.vibrate([100, 50, 100]);
			}
		} catch (e) {}
	}

	async function enterFullscreen() {
		unlockAudioAndVibration();
		handleReturnToExam();
		try {
			if (document.documentElement.requestFullscreen) {
				await document.documentElement.requestFullscreen();
				hasEnteredFullscreenOnce = true;
				localStorage.setItem(`hasEnteredFullscreen_${attempt.id}`, 'true');
			}
		} catch (err) {}
	}

	function handleFullscreenChange() {
		isFullscreen = !!document.fullscreenElement;
		if (isFullscreen) {
			hasEnteredFullscreenOnce = true;
			localStorage.setItem(`hasEnteredFullscreen_${attempt.id}`, 'true');
			handleReturnToExam();
		} else if (isMountedAndReady && !isUnloading && !isManualReload && !isOfficialReload && !isExamBlurred && !showWarningModal && !showDisqualifiedModal && !submitting && hasEnteredFullscreenOnce) {
			// Hanya mulai countdown jika siswa SUDAH PERNAH masuk fullscreen sebelumnya
			handleCheatWarning('Keluar dari Layar Penuh', 10000); // 10 detik jeda toleransi
		}
	}

	function handleVisibilityChange() {
		if (isMountedAndReady && !isUnloading && !isManualReload && !isOfficialReload && document.visibilityState === 'hidden') {
			triggerViolation('Keluar dari aplikasi ujian (Berpindah Tab/Layar)');
		}
	}

	function handleBlur() {
		if (isMountedAndReady && !isUnloading && !isManualReload && !isOfficialReload && document.visibilityState !== 'hidden') {
			// Muncul aplikasi melayang / ditariknya notifikasi bar
			handleCheatWarning('Membuka aplikasi melayang / Notifikasi', 10000); // 10 detik jeda toleransi
		}
	}

	// Local answer state
	let localAnswers: Record<number, string> = {};
	let localDoubts: Record<number, boolean> = {};
	let lastSavedPayload: string | null = null;
	let initializedAttemptId: number | null = null;

	// Initialize from server data only once per attempt load (prevents overwriting user clicks)
	$: if (attempt?.id && attempt.id !== initializedAttemptId && Array.isArray(questions) && questions.length > 0) {
		const newAnswers: Record<number, string> = {};
		const newDoubts: Record<number, boolean> = {};

		let cachedAnswers: Record<number, string> = {};
		let cachedDoubts: Record<number, boolean> = {};
		try {
			const ca = localStorage.getItem(`local_answers_${attempt.id}`);
			if (ca) cachedAnswers = JSON.parse(ca);
			const cd = localStorage.getItem(`local_doubts_${attempt.id}`);
			if (cd) cachedDoubts = JSON.parse(cd);
		} catch {}

		for (const q of questions) {
			const ans = answerMap?.[q.id];
			newAnswers[q.id] = ans?.answer_given || cachedAnswers[q.id] || '';
			newDoubts[q.id] = typeof ans?.is_doubted !== 'undefined' ? (ans.is_doubted === 1) : !!cachedDoubts[q.id];
		}
		localAnswers = newAnswers;
		localDoubts = newDoubts;
		initializedAttemptId = attempt.id;
		if (lastSavedPayload === null && Object.keys(localAnswers).length > 0) {
			lastSavedPayload = JSON.stringify({
				answers: localAnswers,
				doubts: localDoubts,
				warnings: warnings,
				warningLogs: warningLogs
			});
		}
	}

	$: currentQuestion = questions && questions.length > 0 ? questions[currentIndex] : null;
	$: navQuestions = (questions || []).map((q: any, i: number) => {
		let isAnswered = false;
		if (localAnswers && localAnswers[q.id]) {
			isAnswered = localAnswers[q.id] !== '[]' && localAnswers[q.id] !== '{}';
		}
		return {
			id: q.id,
			question_number: q.question_number,
			answered: isAnswered,
			doubted: !!(localDoubts && localDoubts[q.id])
		};
	});

	$: answeredCount = (questions || []).filter((q: any) => localAnswers && localAnswers[q.id] && localAnswers[q.id] !== '[]' && localAnswers[q.id] !== '{}').length;
	$: doubtedCount = (questions || []).filter((q: any) => localDoubts && localDoubts[q.id]).length;
	$: unansweredCount = (questions?.length || 0) - answeredCount;

	function goToQuestion(index: number) {
		flushPendingSingleAnswer();
		// Save current only if there are changes before navigating
		saveCurrentAnswer();
		currentIndex = index;
		localStorage.setItem(`currentIndex_${attempt.id}`, currentIndex.toString());
		showNav = false;
	}

	function prev() {
		if (currentIndex > 0) goToQuestion(currentIndex - 1);
	}

	function next() {
		if (currentIndex < questions.length - 1) goToQuestion(currentIndex + 1);
	}

	let saveTimeout: any;
	let isSaving = false;
	
	function triggerAutoSave() {
		if (saveTimeout) clearTimeout(saveTimeout);
		saveTimeout = setTimeout(() => {
			saveCurrentAnswer();
		}, 1000);
	}

	let singleAnswerDebounceTimer: any = null;
	let pendingAnswerSave: { questionId: number; answer: string; doubted: boolean } | null = null;

	async function executeSaveSingleAnswer(questionId: number, answer: string, doubted: boolean) {
		if (isPausedByProctor || !attempt?.id) return;
		try {
			const res = await fetch('/api/student/save-single', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					attempt_id: attempt.id,
					question_id: questionId,
					answer_given: answer,
					is_doubted: doubted ? 1 : 0
				}),
				keepalive: true
			});

			if (res.ok) {
				const data = (await res.json()) as any;
				if (data) {
					if (data.end_time && data.end_time !== currentEndTime) {
						currentEndTime = data.end_time;
					}
					if (typeof data.is_paused !== 'undefined') {
						isPausedByProctor = data.is_paused;
					}
					if (data.status && data.status !== 'mengerjakan' && data.status !== attempt.status) {
						sessionStorage.setItem(officialReloadKey, 'true');
						window.location.reload();
					}
				}
				// Sinkronkan lastSavedPayload agar navigasi soal (Next/Prev/Nomor) tidak memicu request ?/saveAnswer duplikat
				lastSavedPayload = JSON.stringify({
					answers: localAnswers,
					doubts: localDoubts,
					warnings: warnings,
					warningLogs: warningLogs
				});
			}
		} catch (err) {
			console.warn('Delta save fallback:', err);
			triggerAutoSave();
		}
	}

	async function flushPendingSingleAnswer() {
		if (singleAnswerDebounceTimer) {
			clearTimeout(singleAnswerDebounceTimer);
			singleAnswerDebounceTimer = null;
		}
		if (pendingAnswerSave) {
			const toSave = pendingAnswerSave;
			pendingAnswerSave = null;
			await executeSaveSingleAnswer(toSave.questionId, toSave.answer, toSave.doubted);
		}
	}

	function saveSingleAnswer(questionId: number, answer: string, doubted: boolean) {
		pendingAnswerSave = { questionId, answer, doubted };
		if (singleAnswerDebounceTimer) clearTimeout(singleAnswerDebounceTimer);
		singleAnswerDebounceTimer = setTimeout(() => {
			flushPendingSingleAnswer();
		}, 300);
	}

	function handleAnswer(e: CustomEvent<{ questionId: number; answer: string }>) {
		localAnswers[e.detail.questionId] = e.detail.answer;
		localAnswers = localAnswers; // trigger reactivity
		try {
			localStorage.setItem(`local_answers_${attempt.id}`, JSON.stringify(localAnswers));
		} catch {}
		const isDoubted = !!localDoubts[e.detail.questionId];
		saveSingleAnswer(e.detail.questionId, e.detail.answer, isDoubted);
	}

	function handleDoubt(e: CustomEvent<{ questionId: number; doubted: boolean }>) {
		localDoubts[e.detail.questionId] = e.detail.doubted;
		localDoubts = localDoubts;
		try {
			localStorage.setItem(`local_doubts_${attempt.id}`, JSON.stringify(localDoubts));
		} catch {}
		const currentAns = localAnswers[e.detail.questionId] || '';
		saveSingleAnswer(e.detail.questionId, currentAns, e.detail.doubted);
	}

	async function saveCurrentAnswer(force = false) {
		if (isPausedByProctor) return;
		if (saveTimeout) clearTimeout(saveTimeout);

		const currentPayload = JSON.stringify({
			answers: localAnswers,
			doubts: localDoubts,
			warnings: warnings,
			warningLogs: warningLogs
		});

		// Jika data tidak berubah sama sekali sejak penyimpanan terakhir, jangan kirim request!
		if (!force && lastSavedPayload === currentPayload) {
			return;
		}

		isSaving = true;
		const form = new FormData();
		form.set('answers', JSON.stringify(localAnswers));
		form.set('doubts', JSON.stringify(localDoubts));
		form.set('warnings', warnings.toString());
		form.set('warningLogs', JSON.stringify(warningLogs));

		try {
			const res = await fetch('?/saveAnswer', { 
				method: 'POST', 
				body: form,
				headers: { 'x-sveltekit-action': 'true' } 
			});
			if (res.ok) {
				lastSavedPayload = currentPayload;
			}
		} catch (err) {
			console.error('Save error:', err);
		} finally {
			isSaving = false;
		}
	}

	async function handleTimeUp() {
		if (isPausedByProctor) return;
		toasts.warning('Waktu habis! Jawaban akan disubmit otomatis.');
		handleAutoSubmit();
	}

	async function handleAutoSubmit() {
		if (submitting || isPausedByProctor) return;
		submitting = true;
		saveCurrentAnswer();
		
		const form = new FormData();
		form.set('answers', JSON.stringify(localAnswers));
		form.set('doubts', JSON.stringify(localDoubts));
		form.set('warnings', warnings.toString());
		form.set('warningLogs', JSON.stringify(warningLogs));

		try {
			await fetch('?/submit', { 
				method: 'POST', 
				body: form,
				headers: { 'x-sveltekit-action': 'true' } 
			});
			showTimeUpModal = true;
		} catch (err) {
			console.error('Submit error:', err);
			submitting = false;
		}
	}

	async function triggerDisqualification() {
		showWarningModal = false;
		showDisqualifiedModal = true;
		if (isDisqualifying) return;
		isDisqualifying = true;
		saveCurrentAnswer();
		
		const form = new FormData();
		form.set('answers', JSON.stringify(localAnswers));
		form.set('doubts', JSON.stringify(localDoubts));
		form.set('warnings', warnings.toString());
		form.set('warningLogs', JSON.stringify(warningLogs));

		try {
			await fetch('?/submit', { 
				method: 'POST', 
				body: form,
				headers: { 'x-sveltekit-action': 'true' } 
			});
		} catch (err) {
			console.error('Submit error:', err);
		}
	}
</script>

<svelte:head><title>{attempt?.exam_title || 'Ujian Online'} — Ujian Online Madrasah</title></svelte:head>

<svelte:window 
	on:beforeunload={handleBeforeUnload}
	on:contextmenu|preventDefault 
	on:copy|preventDefault 
	on:cut|preventDefault 
	on:paste|preventDefault 
	on:blur={handleBlur}
/>
<svelte:document 
	on:visibilitychange={handleVisibilityChange}
	on:fullscreenchange={handleFullscreenChange}
/>

<Toast />

<div class="min-h-screen bg-slate-50 flex flex-col select-none">
	<!-- Exam Header -->
	<header class="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 py-2.5 shadow-xs">
		<div class="max-w-4xl mx-auto flex flex-col gap-2">
			<!-- Row 1: Nama Mapel / Judul Ujian (Satu Baris & Berjalan jika Panjang) -->
			<div 
				class="w-full overflow-hidden relative" 
				bind:clientWidth={titleClientWidth}
			>
				{#if isTitleOverflowing}
					<div class="inline-flex whitespace-nowrap gap-10 animate-marquee py-0.5">
						<span bind:this={titleElement} class="text-sm sm:text-base font-bold text-slate-800 tracking-tight shrink-0">
							{attempt?.exam_title || ''}
						</span>
						<span class="text-sm sm:text-base font-bold text-slate-800 tracking-tight shrink-0" aria-hidden="true">
							{attempt?.exam_title || ''}
						</span>
					</div>
				{:else}
					<div class="w-full flex items-center py-0.5">
						<h1 bind:this={titleElement} class="text-sm sm:text-base font-bold text-slate-800 tracking-tight truncate">
							{attempt?.exam_title || ''}
						</h1>
					</div>
				{/if}
			</div>

			<!-- Row 2: Status Tersimpan (Ikon Keren), Pelanggaran & Waktu Ujian -->
			<div class="flex items-center justify-between gap-3">
				<!-- Kiri: Status Penyimpanan Jawaban (Ikon Keren) -->
				<div class="flex items-center gap-1.5">
					{#if isSaving}
						<div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 shadow-xs" title="Menyimpan jawaban...">
							<svg class="w-3.5 h-3.5 animate-spin text-amber-600" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							<span class="text-[11px] font-semibold">Menyimpan</span>
						</div>
					{:else}
						<div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-xs" title="Jawaban tersimpan di server">
							<svg class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
								<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
							</svg>
							<span class="text-[11px] font-semibold">Tersimpan</span>
						</div>
					{/if}
				</div>

				<!-- Kanan: Pelanggaran & Waktu Ujian -->
				<div class="flex items-center gap-2 sm:gap-3 shrink-0">
					{#if warnings > 0}
						<div class="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-600 rounded-full border border-red-200 shadow-xs animate-in fade-in slide-in-from-right-4">
							<svg class="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
							</svg>
							<span class="text-xs font-bold">{warnings}/{MAX_WARNINGS}</span>
						</div>
					{/if}
					<Timer endTime={currentEndTime} isPaused={isPausedByProctor} on:timeup={handleTimeUp} />
				</div>
			</div>

			<!-- Progress Bar -->
			<div class="w-full">
				<div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
					<div
						class="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
						style="width: {questions && questions.length > 0 ? ((answeredCount) / questions.length) * 100 : 0}%"
					></div>
				</div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
		{#if currentQuestion}
			{#key currentQuestion.id}
				<QuestionRenderer
					question={currentQuestion}
					displayNumber={currentIndex + 1}
					answer={localAnswers[currentQuestion.id] || ''}
					isDoubted={localDoubts[currentQuestion.id] || false}
					on:answer={handleAnswer}
					on:doubt={handleDoubt}
				/>
			{/key}
		{/if}
	</main>

	<!-- Bottom Navigation -->
	<footer class="sticky bottom-0 z-30 bg-white/90 backdrop-blur-xl border-t border-slate-200">
		<div class="max-w-4xl mx-auto px-4 py-3">
			<!-- Nav Toggle + Info -->
			<div class="flex items-center justify-between mb-3">
				<div class="flex items-center gap-2">
					<button
						class="btn-sm btn-ghost border border-slate-200"
						on:click={() => (showNav = !showNav)}
					>
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
						</svg>
						Navigasi Soal
					</button>
					<button class="btn-sm btn-ghost border border-slate-200" on:click={triggerReload} title="Muat Ulang Halaman">
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
						</svg>
					</button>
				</div>
				<div class="flex items-center gap-3 text-xs">
					<span class="text-emerald-600 font-semibold">{answeredCount} terjawab</span>
					{#if doubtedCount > 0}
						<span class="text-amber-600 font-semibold">{doubtedCount} ragu</span>
					{/if}
					<span class="text-slate-400">{unansweredCount} belum</span>
				</div>
			</div>

			<!-- Question Grid (collapsible) -->
			{#if showNav}
				<div class="mb-3 p-3 bg-slate-50 rounded-xl animate-in">
					<QuestionNav
						questions={navQuestions}
						{currentIndex}
						on:navigate={(e) => goToQuestion(e.detail.index)}
					/>
				</div>
			{/if}

			<!-- Prev / Next / Submit -->
			<div class="flex items-center gap-3">
				<button
					class="btn-ghost flex-1 justify-center"
					disabled={currentIndex === 0}
					on:click={prev}
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.chevronLeft} />
					</svg>
					Sebelumnya
				</button>

				{#if questions && currentIndex < questions.length - 1}
					<button class="btn-primary flex-1 justify-center" on:click={next}>
						Selanjutnya
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.chevronRight} />
						</svg>
					</button>
				{:else}
					<button
						class="btn-success flex-1 justify-center"
						on:click={() => { saveCurrentAnswer(); showSubmitConfirm = true; }}
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.check} />
						</svg>
						Selesai & Kumpulkan
					</button>
				{/if}
			</div>
		</div>
	</footer>
</div>

<!-- Submit Confirmation Modal -->
{#if showSubmitConfirm}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" on:click={() => (showSubmitConfirm = false)}>
		<div class="max-h-[90vh] overflow-y-auto card p-6 w-full max-w-sm animate-bounce-in text-center" on:click|stopPropagation>
			<div class="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-4">
				<svg class="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.check} />
				</svg>
			</div>
			<h3 class="text-lg font-bold text-slate-800 mb-2">Kumpulkan Jawaban?</h3>

			<div class="bg-slate-50 rounded-xl p-3 mb-4 text-left text-sm space-y-1">
				<p class="flex justify-between"><span class="text-slate-500">Terjawab:</span> <span class="font-semibold text-emerald-600">{answeredCount} / {questions?.length || 0}</span></p>
				<p class="flex justify-between"><span class="text-slate-500">Ragu-ragu:</span> <span class="font-semibold text-amber-600">{doubtedCount}</span></p>
				<p class="flex justify-between"><span class="text-slate-500">Belum dijawab:</span> <span class="font-semibold text-rose-600">{unansweredCount}</span></p>
			</div>

			{#if unansweredCount > 0}
				<p class="text-sm text-amber-600 mb-4 font-medium">⚠ Masih ada {unansweredCount} soal yang belum dijawab!</p>
			{/if}

			<div class="flex gap-3 mt-8">
				<button type="button" class="btn-ghost flex-1" on:click={() => (showSubmitConfirm = false)}>Kembali</button>
				<form id="submit-form" method="POST" action="?/submit" use:enhance={({ cancel, formData }) => {
					if (isPausedByProctor) {
						cancel();
						return;
					}
					flushPendingSingleAnswer();
					submitting = true;
					formData.set('answers', JSON.stringify(localAnswers));
					formData.set('doubts', JSON.stringify(localDoubts));
					formData.set('warnings', warnings.toString());
					formData.set('warningLogs', JSON.stringify(warningLogs));
					return async ({ result, update }) => {
						if (result.type !== 'redirect') {
							submitting = false; 
						}
						await update();
					};
				}} class="flex-1">
					<button type="submit" disabled={submitting || isPausedByProctor} class="btn-success w-full justify-center">
						{#if submitting}
							Mengirim...
						{:else}
							Ya, Kumpulkan
						{/if}
					</button>
				</form>
			</div>
		</div>
	</div>
{/if}

{#if !isFullscreen && !isExamBlurred && !isPausedByProctor}
	<div class="fixed inset-0 z-[60] flex flex-col items-center justify-center p-4 bg-slate-900/95 backdrop-blur-xl">
		<div class="text-center text-white max-w-md animate-in fade-in zoom-in duration-300">
			<svg class="w-16 h-16 mx-auto mb-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
			</svg>
			<h2 class="text-2xl font-bold mb-4">Mode Layar Penuh Diperlukan</h2>
			<p class="text-slate-300 text-sm mb-6">Ujian ini wajib menggunakan mode layar penuh untuk mencegah kecurangan dan menutupi notifikasi sistem. Silakan masuk ke Layar Penuh untuk mulai/melanjutkan.</p>
			
			{#if cheatCountdownRemaining > 0}
				<div class="bg-rose-500/10 border border-rose-500/20 rounded-lg p-4 mb-6 relative overflow-hidden">
					<div class="flex items-center justify-between mb-2">
						<p class="text-rose-300 text-xs text-left font-medium">⚠ Batas Waktu Toleransi:</p>
						<span class="text-3xl font-black tracking-wider {cheatCountdownRemaining <= 5 ? 'text-red-500 animate-pulse' : 'text-rose-400'}">{cheatCountdownRemaining}d</span>
					</div>
					<div class="w-full bg-rose-900/30 h-2 rounded-full overflow-hidden mb-3">
						<div class="h-full bg-rose-500 transition-all duration-1000 ease-linear" style="width: {Math.max(0, (cheatCountdownRemaining / 10) * 100)}%"></div>
					</div>
					<p class="text-rose-300 text-xs text-left">💡 Segera masuk ke layar penuh sebelum waktu habis, atau Anda akan dikenakan pelanggaran!</p>
				</div>
			{/if}

			<button class="btn-primary w-full justify-center py-3" on:click={enterFullscreen}>Masuk Layar Penuh</button>
		</div>
	</div>
{/if}

{#if isExamBlurred}
	<div class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-xl">
		<div class="text-center text-white max-w-md animate-in fade-in zoom-in duration-300">
			<div class="w-16 h-16 mx-auto mb-6 bg-slate-800 rounded-full flex items-center justify-center">
				<svg class="w-8 h-8 text-rose-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
				</svg>
			</div>
			<h2 class="text-2xl font-bold mb-3 text-rose-400">Ujian Dijeda Sementara</h2>
			<p class="text-slate-300 text-sm mb-6">Anda terdeteksi keluar dari layar ujian atau membuka aplikasi melayang (Messenger, Notifikasi, dsb). Ujian disembunyikan demi keamanan.</p>
			
			<div class="bg-rose-500/10 border border-rose-500/20 rounded-lg p-4 mb-6 relative overflow-hidden">
				<div class="flex items-center justify-between mb-2">
					<p class="text-rose-300 text-xs text-left font-medium">Batas Waktu Toleransi:</p>
					<span class="text-3xl font-black tracking-wider {cheatCountdownRemaining <= 10 ? 'text-red-500 animate-pulse' : 'text-rose-400'}">{cheatCountdownRemaining}d</span>
				</div>
				<div class="w-full bg-rose-900/30 h-2 rounded-full overflow-hidden mb-3">
					<div class="h-full bg-rose-500 transition-all duration-1000 ease-linear" style="width: {Math.max(0, (cheatCountdownRemaining / 10) * 100)}%"></div>
				</div>
				<p class="text-rose-300 text-xs text-left">💡 Jika Anda sedang memperbaiki masalah koneksi, segera tutup notifikasi bar Anda. Anda akan dikenakan pelanggaran berat jika waktu habis!</p>
			</div>
			
			<button class="btn-primary w-full justify-center" on:click={enterFullscreen}>Saya Sudah Kembali</button>
		</div>
	</div>
{/if}

{#if showWarningModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
		<div class="max-h-[90vh] overflow-y-auto bg-white rounded-2xl w-full max-w-sm p-6 text-center shadow-xl animate-in fade-in zoom-in-95 duration-200">
			<div class="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
				<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
				</svg>
			</div>
			<h3 class="text-xl font-bold text-slate-800 mb-2">Peringatan Kecurangan!</h3>
			<p class="text-slate-600 mb-6 text-sm">Anda terdeteksi melakukan aktivitas di luar halaman ujian. Peringatan ke-{warnings} dari {MAX_WARNINGS}. Jika melebihi batas, ujian akan otomatis dihentikan.</p>
			<button class="btn-primary w-full" on:click={() => { showWarningModal = false; stopWarningSoundLoop(); if (!isFullscreen && hasEnteredFullscreenOnce) { handleCheatWarning('Keluar dari Layar Penuh', 10000); } }}>
				Saya Mengerti
			</button>
		</div>
	</div>
{/if}

{#if showDisqualifiedModal}
	<div class="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
		<div class="max-h-[90vh] overflow-y-auto bg-white rounded-2xl w-full max-w-sm p-6 text-center shadow-xl animate-in fade-in zoom-in-95 duration-200 border-t-4 border-rose-500">
			<div class="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
				<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
				</svg>
			</div>
			<h3 class="text-xl font-bold text-slate-800 mb-2">Ujian Dihentikan</h3>
			<p class="text-slate-600 mb-6 text-sm">Anda telah melanggar batas maksimal peringatan ({MAX_WARNINGS} kali). Ujian Anda diselesaikan secara otomatis.</p>
			<button class="btn-danger w-full" disabled={isDisqualifying} on:click={() => window.location.href = '/siswa'}>
				{isDisqualifying ? 'Memproses Penghentian...' : 'Kembali ke Dashboard'}
			</button>
		</div>
	</div>
{/if}

{#if showTimeUpModal}
	<div class="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
		<div class="max-h-[90vh] overflow-y-auto bg-white rounded-2xl w-full max-w-sm p-6 text-center shadow-xl animate-in fade-in zoom-in-95 duration-200 border-t-4 border-indigo-500">
			<div class="w-16 h-16 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
				<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
			</div>
			<h3 class="text-xl font-bold text-slate-800 mb-2">Waktu Habis!</h3>
			<p class="text-slate-600 mb-6 text-sm">Waktu pengerjaan ujian Anda telah selesai. Jawaban Anda telah berhasil dikumpulkan secara otomatis oleh sistem.</p>
			<button class="btn-primary w-full" on:click={() => window.location.href = '/siswa'}>
				Kembali ke Dashboard
			</button>
		</div>
	</div>
{/if}

{#if isPausedByProctor}
	<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-xl">
		<div class="text-center text-white max-w-md animate-in fade-in zoom-in duration-300">
			<svg class="w-20 h-20 mx-auto mb-6 text-amber-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<h2 class="text-3xl font-bold mb-4">Ujian Ditahan</h2>
			<p class="text-slate-300 text-lg">Waktu ujian Anda sedang dibekukan oleh Pengawas.</p>
			<p class="text-slate-400 mt-4 text-sm">Silakan hubungi pengawas ujian jika ini adalah sebuah kesalahan. Anda tidak dapat melanjutkan ujian atau melihat soal hingga akses dibuka kembali.</p>
		</div>
	</div>
{/if}

<style>
	@keyframes marquee-scroll {
		0% {
			transform: translateX(0%);
		}
		100% {
			transform: translateX(calc(-50% - 1.25rem));
		}
	}
	.animate-marquee {
		display: inline-flex;
		animation: marquee-scroll 18s linear infinite;
	}
	.animate-marquee:hover {
		animation-play-state: paused;
	}
</style>
