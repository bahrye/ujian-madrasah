<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import * as XLSX from 'xlsx';
  import { toasts } from '$lib/stores/toast';
  
  export let show = false;
  export let classes: { id: number; name: string }[] = [];
  
  const dispatch = createEventDispatcher();
  
  let fileInput: HTMLInputElement;
  let selectedFile: File | null = null;
  let isParsing = false;
  let parsedData: any[] = [];
  let errorMsg = '';

  function close() {
    show = false;
    selectedFile = null;
    parsedData = [];
    errorMsg = '';
    dispatch('close');
  }

  function portal(node: HTMLElement) {
    document.body.appendChild(node);
    return {
      destroy() {
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
      }
    };
  }

  function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      selectedFile = input.files[0];
      errorMsg = '';
      parsedData = [];
    }
  }

  async function parseExcel() {
    if (!selectedFile) return;
    isParsing = true;
    errorMsg = '';

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
      
      const targetSheetName = workbook.SheetNames.find(name => name === "Data Siswa") || workbook.SheetNames[0];
      const worksheet = workbook.Sheets[targetSheetName];
      
      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (rawData.length <= 1) {
        throw new Error("File Excel kosong atau tidak memiliki baris data setelah header.");
      }

      // Format: [NISN, NAMA LENGKAP, NAMA KELAS]
      const results = [];
      for (let i = 1; i < rawData.length; i++) {
        const row = rawData[i] as any[];
        // Skip baris jika NISN dan NAMA kosong
        if (!row[0] && !row[1]) continue;

        const nisn = row[0] ? String(row[0]).trim() : '';
        const name = row[1] ? String(row[1]).trim() : '';
        const classNameStr = row[2] ? String(row[2]).trim() : '';
        
        let classId: number | null = null;
        if (classNameStr) {
          // Cari ID kelas berdasarkan nama kelas dari referensi
          const matchedClass = classes.find(c => c.name.toLowerCase() === classNameStr.toLowerCase());
          if (matchedClass) {
            classId = matchedClass.id;
          }
        }

        if (nisn && name) {
          results.push({ nisn, name, class_id: classId, class_name: classNameStr });
        }
      }

      if (results.length === 0) {
        throw new Error("Tidak ada data valid yang dapat dibaca.");
      }

      parsedData = results;
      
      // Submit form
      setTimeout(() => {
        const submitBtn = document.getElementById('submit-import-students-btn');
        if (submitBtn) submitBtn.click();
      }, 100);

    } catch (err: any) {
      console.error(err);
      errorMsg = err.message || "Gagal membaca file Excel. Pastikan format sesuai template.";
      isParsing = false;
    }
  }

  function downloadTemplate() {
    const workbook = XLSX.utils.book_new();
    
    // Sheet 1: Data Siswa
    const headers = ["NISN", "NAMA LENGKAP", "NAMA KELAS"];
    const sampleRow = ["1234567890", "Budi Santoso", classes.length > 0 ? classes[0].name : "X MIPA 1"];
    const wsData = XLSX.utils.aoa_to_sheet([headers, sampleRow]);
    
    wsData['!cols'] = [{ wch: 15 }, { wch: 30 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(workbook, wsData, "Data Siswa");
    
    // Sheet 2: Referensi Kelas
    const classHeaders = ["ID KELAS", "NAMA KELAS"];
    const classRows = classes.map(c => [c.id, c.name]);
    const wsRef = XLSX.utils.aoa_to_sheet([
      ["PETUNJUK: Isikan persis tulisan pada kolom NAMA KELAS ke sheet Data Siswa"],
      [],
      classHeaders, 
      ...classRows
    ]);
    wsRef['!cols'] = [{ wch: 10 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(workbook, wsRef, "Referensi Kelas");

    XLSX.writeFile(workbook, "Template_Import_Siswa.xlsx");
  }
</script>

{#if show}
  <div use:portal class="fixed inset-0 z-[100] flex items-center justify-center">
    <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" on:click={close}></div>
    
    <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
      <div class="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
        <h2 class="text-xl font-bold text-slate-800">Import Data Siswa</h2>
        <button class="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-colors" on:click={close}>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      
      <div class="p-6 overflow-y-auto">
        {#if errorMsg}
          <div class="mb-4 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 flex items-start gap-3">
            <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <p>{errorMsg}</p>
          </div>
        {/if}

        <div class="space-y-6">
          <div class="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-5">
            <h3 class="font-bold text-indigo-900 mb-2 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Langkah Import
            </h3>
            <ol class="list-decimal list-inside text-sm text-indigo-800 space-y-2 ml-1">
              <li>Unduh template Excel yang disediakan.</li>
              <li>Isi data siswa sesuai format (Kolom <strong>NISN</strong>, <strong>NAMA LENGKAP</strong>, dan <strong>NAMA KELAS</strong>).</li>
              <li>Lihat sheet <strong>Referensi Kelas</strong> untuk panduan nama kelas.</li>
              <li>Simpan dan unggah kembali file Excel tersebut.</li>
            </ol>
            
            <!-- Download Template Card -->
            <button
              on:click={downloadTemplate}
              class="mt-5 w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-4 p-4 text-left"
            >
              <!-- Icon container -->
              <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
              </div>
              <!-- Text -->
              <div class="flex-1 min-w-0">
                <p class="font-bold text-white text-sm">Unduh Template Excel</p>
                <p class="text-indigo-200 text-xs mt-0.5">Format siap pakai dengan Referensi Kelas</p>
              </div>
              <!-- Arrow -->
              <svg class="w-5 h-5 text-indigo-200 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <!-- Shine effect -->
              <div class="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-in-out pointer-events-none"></div>
            </button>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Pilih File Excel (.xlsx)</label>
            <input 
              bind:this={fileInput}
              type="file" 
              accept=".xlsx, .xls"
              class="block w-full text-sm text-slate-500
                file:mr-4 file:py-2.5 file:px-4
                file:rounded-xl file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100
                border border-slate-200 rounded-xl
                cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              on:change={handleFileChange}
              disabled={isParsing}
            />
          </div>
        </div>

        <form method="POST" action="?/importExcel" class="hidden">
          <input type="hidden" name="students_json" value={JSON.stringify(parsedData)} />
          <button type="submit" id="submit-import-students-btn" aria-label="Submit Form"></button>
        </form>
      </div>

      <div class="p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl flex justify-end gap-3 sticky bottom-0">
        <button class="btn btn-secondary" on:click={close} disabled={isParsing}>
          Batal
        </button>
        <button 
          class="btn btn-primary min-w-[120px]" 
          on:click={parseExcel}
          disabled={!selectedFile || isParsing}
        >
          {#if isParsing}
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Memproses...
          {:else}
            Import Data
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}
