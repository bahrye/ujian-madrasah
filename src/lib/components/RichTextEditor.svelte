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
</script>

<div class="border border-slate-300 rounded-lg overflow-hidden flex flex-col bg-white focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
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
	
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div 
		bind:this={editor}
		class="{compact ? 'p-2 min-h-[40px] text-sm' : 'p-4 min-h-[150px] text-sm'} outline-none prose max-w-none text-slate-800"
		contenteditable="true"
		on:input={updateValue}
		on:blur={updateValue}
		on:paste
		{id}
		{placeholder}
	></div>
	
	<!-- Hidden input to submit the HTML content with the form -->
	<input type="hidden" {name} bind:value={value} />
</div>

<style>
	/* Some basic styles to ensure images inside contenteditable don't overflow */
	div[contenteditable] :global(img) {
		max-width: 100%;
		height: auto;
		max-height: 300px;
		object-fit: contain;
		border-radius: 0.5rem;
		border: 1px solid #e2e8f0;
		margin: 0.5rem 0;
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
</style>
