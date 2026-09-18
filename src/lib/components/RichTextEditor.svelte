<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	
	export let value = '';
	export let placeholder = 'Tuliskan teks di sini...';
	export let id = '';
	export let name = 'question_text';
	export let compact = false;
	
	let editor: HTMLDivElement;
	const dispatch = createEventDispatcher();
	
	function exec(command: string, arg?: string) {
		document.execCommand(command, false, arg);
		updateValue();
	}

	function updateValue() {
		if (editor) {
			value = editor.innerHTML;
			dispatch('input', value);
		}
	}
	
	onMount(() => {
		if (editor) {
			editor.innerHTML = value;
		}
	});

	// React to external value changes (e.g. when editing a different question)
	$: if (editor && value !== editor.innerHTML && document.activeElement !== editor) {
		editor.innerHTML = value || '';
	}

	export function insertHtml(html: string) {
		if (editor) {
			editor.focus();
			// document.execCommand is deprecated but still the standard way for simple contenteditable
			document.execCommand('insertHTML', false, html);
			updateValue();
		}
	}

	// Image resizing and manipulation toolbar state
	let selectedImg: HTMLImageElement | null = null;
	let imgDisplay: 'inline' | 'center' | 'left' | 'right' = 'inline';
	let hasBorder: boolean = false;

	function handleEditorClick(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (target && target.tagName === 'IMG') {
			if (selectedImg && selectedImg !== target) {
				selectedImg.classList.remove('active-selected-img');
			}
			selectedImg = target as HTMLImageElement;
			selectedImg.classList.add('active-selected-img');
			detectImageProps();
		} else {
			// Click outside image inside editor
			deselectImage();
		}
	}

	function detectImageProps() {
		if (!selectedImg) return;
		const style = selectedImg.style;
		if (style.float === 'left') {
			imgDisplay = 'left';
		} else if (style.float === 'right') {
			imgDisplay = 'right';
		} else if (style.display === 'block' || selectedImg.classList.contains('block') || selectedImg.classList.contains('mx-auto')) {
			imgDisplay = 'center';
		} else {
			imgDisplay = 'inline';
		}

		hasBorder = !!(style.border && style.border !== 'none') || selectedImg.classList.contains('border');
	}

	function deselectImage() {
		if (selectedImg) {
			selectedImg.classList.remove('active-selected-img');
			selectedImg = null;
		}
	}

	function resizeStep(deltaPercent: number) {
		if (!selectedImg) return;
		const currentW = selectedImg.clientWidth || 100;
		const factor = 1 + deltaPercent / 100;
		const newW = Math.max(24, Math.round(currentW * factor));
		selectedImg.style.width = `${newW}px`;
		selectedImg.style.height = 'auto';
		selectedImg.style.maxWidth = '100%';
		updateValue();
	}

	function setPresetSize(preset: 'xs' | 's' | 'm' | 'l' | 'full' | 'auto') {
		if (!selectedImg) return;
		selectedImg.style.maxWidth = '100%';

		if (preset === 'xs') {
			// Perfect for inline math symbols / equations
			selectedImg.style.width = 'auto';
			selectedImg.style.height = '32px';
			selectedImg.style.maxHeight = '36px';
			selectedImg.style.display = 'inline-block';
			selectedImg.style.verticalAlign = 'middle';
			selectedImg.style.margin = '1px 4px';
			selectedImg.style.border = 'none';
			selectedImg.style.boxShadow = 'none';
			selectedImg.classList.remove('block', 'mx-auto', 'border', 'shadow-xs', 'border-slate-200');
			selectedImg.classList.add('inline-block', 'align-middle');
			imgDisplay = 'inline';
			hasBorder = false;
		} else if (preset === 's') {
			selectedImg.style.width = '140px';
			selectedImg.style.height = 'auto';
			selectedImg.style.maxHeight = 'none';
		} else if (preset === 'm') {
			selectedImg.style.width = '280px';
			selectedImg.style.height = 'auto';
			selectedImg.style.maxHeight = 'none';
		} else if (preset === 'l') {
			selectedImg.style.width = '480px';
			selectedImg.style.height = 'auto';
			selectedImg.style.maxHeight = 'none';
		} else if (preset === 'full') {
			selectedImg.style.width = '100%';
			selectedImg.style.height = 'auto';
			selectedImg.style.maxHeight = 'none';
		} else if (preset === 'auto') {
			selectedImg.style.width = 'auto';
			selectedImg.style.height = 'auto';
			selectedImg.style.maxHeight = '300px';
		}
		updateValue();
	}

	function setAlign(align: 'inline' | 'center' | 'left' | 'right') {
		if (!selectedImg) return;
		imgDisplay = align;

		selectedImg.style.float = '';
		selectedImg.style.margin = '';
		selectedImg.style.display = '';
		selectedImg.style.verticalAlign = '';
		selectedImg.classList.remove('block', 'inline-block', 'mx-auto', 'align-middle');

		if (align === 'inline') {
			selectedImg.style.display = 'inline-block';
			selectedImg.style.verticalAlign = 'middle';
			selectedImg.style.margin = '2px 4px';
			selectedImg.classList.add('inline-block', 'align-middle');
		} else if (align === 'center') {
			selectedImg.style.display = 'block';
			selectedImg.style.margin = '10px auto';
			selectedImg.classList.add('block', 'mx-auto');
		} else if (align === 'left') {
			selectedImg.style.float = 'left';
			selectedImg.style.margin = '4px 12px 4px 0';
			selectedImg.style.display = 'inline-block';
		} else if (align === 'right') {
			selectedImg.style.float = 'right';
			selectedImg.style.margin = '4px 0 4px 12px';
			selectedImg.style.display = 'inline-block';
		}
		updateValue();
	}

	function toggleBorder() {
		if (!selectedImg) return;
		hasBorder = !hasBorder;

		if (hasBorder) {
			selectedImg.style.border = '1px solid #cbd5e1';
			selectedImg.style.borderRadius = '0.5rem';
			selectedImg.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
		} else {
			selectedImg.style.border = 'none';
			selectedImg.style.boxShadow = 'none';
			selectedImg.classList.remove('border', 'border-slate-200', 'shadow-xs');
		}
		updateValue();
	}

	function deleteImage() {
		if (!selectedImg) return;
		selectedImg.remove();
		selectedImg = null;
		updateValue();
	}
</script>

<div class="border border-slate-300 rounded-lg overflow-hidden flex flex-col bg-white focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
	<!-- Standard formatting toolbar -->
	<div class="bg-slate-50 border-b border-slate-200 p-1.5 flex gap-1 items-center flex-wrap">
		<button type="button" class="p-1.5 text-slate-600 hover:bg-slate-200 hover:text-indigo-600 rounded transition-colors" on:click={() => exec('bold')} title="Tebal (Bold)">
			<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path></svg>
		</button>
		<button type="button" class="p-1.5 text-slate-600 hover:bg-slate-200 hover:text-indigo-600 rounded transition-colors" on:click={() => exec('italic')} title="Miring (Italic)">
			<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line></svg>
		</button>
		<button type="button" class="p-1.5 text-slate-600 hover:bg-slate-200 hover:text-indigo-600 rounded transition-colors" on:click={() => exec('underline')} title="Garis Bawah (Underline)">
			<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path><line x1="4" y1="21" x2="20" y2="21"></line></svg>
		</button>
		
		<div class="w-px h-4 bg-slate-300 mx-1"></div>

		<button type="button" class="p-1.5 text-slate-600 hover:bg-slate-200 hover:text-indigo-600 rounded transition-colors" on:click={() => exec('subscript')} title="Subscript / Tulisan Bawah (Kimia)">
			<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 5 8 8"/><path d="m12 5-8 8"/><path d="M20 19h-4c0-1.5.44-2 1.5-2.5S20 15.33 20 14c0-.47-.17-.93-.48-1.29a2.11 2.11 0 0 0-2.62-.44c-.42.24-.74.62-.9 1.07"/></svg>
		</button>
		<button type="button" class="p-1.5 text-slate-600 hover:bg-slate-200 hover:text-indigo-600 rounded transition-colors" on:click={() => exec('superscript')} title="Superscript / Pangkat">
			<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 19 8-8"/><path d="m12 19-8-8"/><path d="M20 8h-4c0-1.5.44-2 1.5-2.5S20 4.33 20 3c0-.47-.17-.93-.48-1.29a2.11 2.11 0 0 0-2.62-.44c-.42.24-.74.62-.9 1.07"/></svg>
		</button>
		<div class="w-px h-4 bg-slate-300 mx-1"></div>
		
		<button type="button" class="p-1.5 text-slate-600 hover:bg-slate-200 hover:text-indigo-600 rounded transition-colors" on:click={() => exec('insertOrderedList')} title="Daftar Angka">
			<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="10" y1="6" x2="21" y2="6"></line><line x1="10" y1="12" x2="21" y2="12"></line><line x1="10" y1="18" x2="21" y2="18"></line><path d="M4 6h1v4"></path><path d="M4 10h2"></path><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path></svg>
		</button>
		<button type="button" class="p-1.5 text-slate-600 hover:bg-slate-200 hover:text-indigo-600 rounded transition-colors" on:click={() => exec('insertUnorderedList')} title="Daftar Simbol">
			<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
		</button>

		<div class="w-px h-4 bg-slate-300 mx-1 flex-1"></div>
		
		<slot name="toolbar-right"></slot>
	</div>

	<!-- Dedicated Image Resize & Formatting Toolbar (appears when an image is clicked) -->
	{#if selectedImg}
		<div class="bg-indigo-50 border-b border-indigo-100 px-2 py-1.5 flex items-center gap-1.5 flex-wrap text-xs text-slate-700 animate-in slide-in-from-top-1">
			<div class="flex items-center gap-1 shrink-0 font-bold text-indigo-700 mr-1">
				<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v12a2 2 0 002 2z"/></svg>
				<span>Atur Gambar:</span>
			</div>

			<!-- Step buttons -->
			<div class="inline-flex rounded-md shadow-xs bg-white border border-slate-200 p-0.5">
				<button type="button" class="px-2 py-1 text-slate-700 hover:bg-slate-100 rounded text-xs font-semibold flex items-center gap-1 transition-colors" on:click={() => resizeStep(-15)} title="Perkecil Ukuran Gambar (-15%)">
					<svg class="w-3 h-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 12H4"/></svg>
					<span>Perkecil</span>
				</button>
				<div class="w-px h-4 bg-slate-200 my-auto"></div>
				<button type="button" class="px-2 py-1 text-slate-700 hover:bg-slate-100 rounded text-xs font-semibold flex items-center gap-1 transition-colors" on:click={() => resizeStep(15)} title="Perbesar Ukuran Gambar (+15%)">
					<svg class="w-3 h-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
					<span>Perbesar</span>
				</button>
			</div>

			<div class="w-px h-4 bg-indigo-200 mx-0.5"></div>

			<!-- Presets -->
			<div class="flex items-center gap-1">
				<button type="button" class="px-2 py-1 bg-white hover:bg-indigo-100 border border-slate-200 text-indigo-700 rounded text-[11px] font-bold shadow-xs transition-colors" on:click={() => setPresetSize('xs')} title="Ukuran sebaris rumus matematika (tinggi 32px sejajar teks)">
					∑ Rumus (XS)
				</button>
				<button type="button" class="px-1.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 rounded text-[11px] font-medium transition-colors" on:click={() => setPresetSize('s')} title="Lebar 140px">
					S
				</button>
				<button type="button" class="px-1.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 rounded text-[11px] font-medium transition-colors" on:click={() => setPresetSize('m')} title="Lebar 280px">
					M
				</button>
				<button type="button" class="px-1.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 rounded text-[11px] font-medium transition-colors" on:click={() => setPresetSize('l')} title="Lebar 480px">
					L
				</button>
				<button type="button" class="px-1.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 rounded text-[11px] font-medium transition-colors" on:click={() => setPresetSize('full')} title="Lebar Penuh (100%)">
					100%
				</button>
				<button type="button" class="px-1.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 rounded text-[11px] font-medium transition-colors" on:click={() => setPresetSize('auto')} title="Reset ke Ukuran Asli">
					Asli
				</button>
			</div>

			<div class="w-px h-4 bg-indigo-200 mx-0.5"></div>

			<!-- Alignment buttons -->
			<div class="inline-flex rounded-md shadow-xs bg-white border border-slate-200 p-0.5">
				<button type="button" class="px-1.5 py-1 rounded text-xs transition-colors {imgDisplay === 'inline' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'}" on:click={() => setAlign('inline')} title="Sejajar dalam kalimat (Inline)">
					Sejajar
				</button>
				<button type="button" class="px-1.5 py-1 rounded text-xs transition-colors {imgDisplay === 'center' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'}" on:click={() => setAlign('center')} title="Tengah (Center Baris Baru)">
					Tengah
				</button>
				<button type="button" class="px-1.5 py-1 rounded text-xs transition-colors {imgDisplay === 'left' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'}" on:click={() => setAlign('left')} title="Rata Kiri (Teks mengalir di kanan)">
					Kiri
				</button>
				<button type="button" class="px-1.5 py-1 rounded text-xs transition-colors {imgDisplay === 'right' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'}" on:click={() => setAlign('right')} title="Rata Kanan (Teks mengalir di kiri)">
					Kanan
				</button>
			</div>

			<div class="w-px h-4 bg-indigo-200 mx-0.5"></div>

			<!-- Border toggle -->
			<button type="button" class="px-2 py-1 rounded border text-xs font-medium transition-colors {hasBorder ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'}" on:click={toggleBorder} title="Nyalakan/Matikan Bingkai Gambar">
				Bingkai
			</button>

			<!-- Action buttons -->
			<div class="flex items-center gap-1 ml-auto">
				<button type="button" class="p-1 text-rose-600 hover:bg-rose-100 rounded transition-colors" on:click={deleteImage} title="Hapus Gambar">
					<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
				</button>
				<button type="button" class="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded transition-colors" on:click={deselectImage} title="Tutup Toolbar Gambar">
					<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
				</button>
			</div>
		</div>
	{/if}
	
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div 
		bind:this={editor}
		class="{compact ? 'p-2 min-h-[40px] text-sm' : 'p-4 min-h-[150px] text-sm'} outline-none prose max-w-none text-slate-800 leading-relaxed"
		contenteditable="true"
		on:input={updateValue}
		on:blur={updateValue}
		on:click={handleEditorClick}
		on:paste
		{id}
		{placeholder}
	></div>
	
	<!-- Hidden input to submit the HTML content with the form -->
	<input type="hidden" {name} bind:value={value} />
</div>

<style>
	/* Active image highlight when selected */
	div[contenteditable] :global(img.active-selected-img) {
		outline: 2px solid #6366f1 !important;
		outline-offset: 3px !important;
		border-radius: 0.375rem;
	}

	div[contenteditable] :global(img) {
		max-width: 100%;
		object-fit: contain;
		cursor: pointer;
		transition: outline 0.15s ease, box-shadow 0.15s ease;
	}

	div[contenteditable] :global(img:hover) {
		outline: 1.5px dashed #818cf8;
		outline-offset: 2px;
	}

	div[contenteditable] :global(ul) {
		list-style-type: disc;
		padding-left: 1.5rem;
		margin: 0.5rem 0;
	}
	div[contenteditable] :global(ol) {
		list-style-type: decimal;
		padding-left: 1.5rem;
		margin: 0.5rem 0;
	}
	div[contenteditable] {
		cursor: text;
	}
	div[contenteditable]:empty:before {
		content: attr(placeholder);
		color: #94a3b8;
		pointer-events: none;
		display: block; /* For Firefox */
	}
	div[contenteditable] :global(table) {
		border-collapse: collapse;
		margin: 1rem 0;
	}
	div[contenteditable] :global(th),
	div[contenteditable] :global(td) {
		border: 1px solid #cbd5e1;
		padding: 0.5rem;
	}
</style>
