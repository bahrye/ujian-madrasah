<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import * as XLSX from 'xlsx';
  
  export let show = false;
  
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
      
      // Cari sheet yang bukan petunjuk penggunaan (biasanya 'Template Soal')
      let targetSheetName = workbook.SheetNames.find(name => name !== "Petunjuk Penggunaan") || workbook.SheetNames[0];
      const worksheet = workbook.Sheets[targetSheetName];
      
      // Convert to JSON
      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      // The first row is headers, subsequent rows are data
      if (rawData.length <= 1) {
        throw new Error('File Excel tampak kosong atau tidak memiliki baris data.');
      }
      
      const headers = rawData[0] as string[];
      const dataRows = rawData.slice(1) as any[][];
      
      // Map to expected format
      const questions = [];
      for (let index = 0; index < dataRows.length; index++) {
        const row = dataRows[index];
        // Skip empty rows completely
        if (!row || row.length === 0 || !row.some(cell => cell !== undefined && cell !== null && cell !== '')) continue;
        
        const rowNum = index + 2; // For error messages (header is 1, data starts at 2)

        const tipeRaw = String(row[0] || '').trim();
        const teks = String(row[1] || '').trim();
        let bobot = parseInt(String(row[8] || '1'));
        if (isNaN(bobot)) bobot = 1;
        
        if (!tipeRaw || !teks) {
          throw new Error(`Baris ${rowNum}: Kehilangan Tipe Soal atau Teks Soal. Harap periksa file Anda.`);
        }

        let type = '';
        if (tipeRaw.toLowerCase() === 'pilihan ganda') type = 'pilihan_ganda';
        else if (tipeRaw.toLowerCase() === 'benar salah') type = 'benar_salah';
        else if (tipeRaw.toLowerCase() === 'isian singkat') type = 'isian_singkat';
        else if (tipeRaw.toLowerCase() === 'esai') type = 'essay';
        else {
          throw new Error(`Baris ${rowNum}: Tipe soal tidak valid "${tipeRaw}". Gunakan "Pilihan Ganda", "Benar Salah", "Isian Singkat", atau "Esai".`);
        }

        const q: any = { type, question_text: teks, points: bobot };

        if (type === 'pilihan_ganda') {
          const opts = [];
          for (let i = 2; i <= 6; i++) {
             const optText = String(row[i] || '').trim();
             if (optText) opts.push(optText);
          }
          if (opts.length < 2) throw new Error(`Baris ${rowNum}: Pilihan Ganda minimal harus memiliki 2 opsi jawaban (diisi di kolom Opsi A dan Opsi B).`);
          q.options_json = JSON.stringify(opts);
          
          let correctAnswer = String(row[7] || '').trim().toUpperCase();
          if (!['A','B','C','D','E'].includes(correctAnswer)) {
             throw new Error(`Baris ${rowNum}: Jawaban Benar untuk Pilihan Ganda harus huruf A, B, C, D, atau E.`);
          }
          // Correct index mapping: A is 0, B is 1, etc. Wait, we usually save the actual answer text or index?
          // The database expects the correct answer in options_json if not, wait.
          // Let's check how the regular form saves it.
          // The regular form saves it as '"A"' (JSON string of "A"). So we just need to stringify it.
          q.correct_answer_json = JSON.stringify(correctAnswer);
        } else if (type === 'benar_salah') {
          q.options_json = JSON.stringify(['Benar', 'Salah']);
          let correctAnswer = String(row[7] || '').trim();
          if (correctAnswer.toLowerCase() !== 'benar' && correctAnswer.toLowerCase() !== 'salah') {
            throw new Error(`Baris ${rowNum}: Jawaban Benar untuk tipe Benar Salah harus berisi "Benar" atau "Salah".`);
          }
          correctAnswer = correctAnswer.toLowerCase() === 'benar' ? 'Benar' : 'Salah';
          q.correct_answer_json = JSON.stringify(correctAnswer);
        } else if (type === 'isian_singkat' || type === 'essay') {
          q.correct_answer_json = JSON.stringify(String(row[7] || '').trim());
        }

        questions.push(q);
      }
      
      if (questions.length === 0) {
        throw new Error('Tidak ada soal valid yang ditemukan dalam file.');
      }
      
      parsedData = questions;

      // Submit immediately if valid
      setTimeout(() => {
        const submitBtn = document.getElementById('submit-import-btn');
        if (submitBtn) submitBtn.click();
      }, 100);

    } catch (e: any) {
      errorMsg = e.message || 'Terjadi kesalahan saat membaca file Excel.';
    } finally {
      isParsing = false;
    }
  }

  function downloadTemplate() {
    const headers = [
      "Tipe Soal", 
      "Teks Soal", 
      "Opsi A", 
      "Opsi B", 
      "Opsi C", 
      "Opsi D", 
      "Opsi E", 
      "Jawaban Benar", 
      "Bobot Nilai"
    ];
    
    const sampleRow1 = ["Pilihan Ganda", "Siapakah penemu bola lampu?", "Thomas Edison", "Albert Einstein", "Nikola Tesla", "Isaac Newton", "", "A", 1];
    const sampleRow2 = ["Benar Salah", "Bumi itu bulat", "", "", "", "", "", "Benar", 1];
    const sampleRow3 = ["Isian Singkat", "Ibukota Indonesia adalah...", "", "", "", "", "", "Jakarta", 1];
    const sampleRow4 = ["Esai", "Jelaskan proses terjadinya hujan!", "", "", "", "", "", "Hujan terjadi karena penguapan air laut yang mengembun menjadi awan, lalu turun sebagai titik-titik air.", 5];
    
    const ws = XLSX.utils.aoa_to_sheet([headers, sampleRow1, sampleRow2, sampleRow3, sampleRow4]);
    
    ws['!cols'] = [
      { wch: 15 },
      { wch: 40 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 12 }
    ];

    // Buat Sheet Petunjuk
    const instructionData = [
      ["PETUNJUK PENGISIAN SOAL"],
      [],
      ["1. TIPE SOAL", "Harus diisi dengan ejaan persis: Pilihan Ganda, Benar Salah, Isian Singkat, atau Esai"],
      ["2. TEKS SOAL", "Isi dengan pertanyaan soal Anda"],
      ["3. OPSI A - E", "Khusus untuk tipe Pilihan Ganda. Minimal isi Opsi A dan B."],
      ["4. JAWABAN BENAR", "Untuk Pilihan Ganda: A, B, C, D, atau E. \nUntuk Benar Salah: Benar atau Salah. \nUntuk Isian Singkat: Kata kuncinya.\nUntuk Esai: Penjelasan/Kunci Jawabannya."],
      ["5. BOBOT NILAI", "Angka (misal: 1, 2, 5). Default adalah 1."],
      [],
      ["CONTOH PENGISIAN BENAR:"],
      ["Pilihan Ganda", "Siapakah penemu bola lampu?", "Thomas Edison", "Albert Einstein", "Nikola Tesla", "Isaac Newton", "", "A", 1],
      ["Esai", "Jelaskan proses terjadinya hujan!", "", "", "", "", "", "Hujan terjadi karena penguapan air laut yang mengembun menjadi awan, lalu turun sebagai titik air.", 5],
      [],
      ["CONTOH PENGISIAN SALAH (AKAN DITOLAK SISTEM):"],
      ["Pilihan Ganda", "Siapakah penemu bola lampu?", "Thomas Edison", "Albert Einstein", "", "", "", "Thomas Edison", 1, "<- SALAH! Jawaban benar harus berupa huruf A, B, C, D, atau E"]
    ];

    const wsInstructions = XLSX.utils.aoa_to_sheet(instructionData);
    wsInstructions['!cols'] = [
      { wch: 25 },
      { wch: 60 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 12 },
      { wch: 60 }
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsInstructions, "Petunjuk Penggunaan");
    XLSX.utils.book_append_sheet(wb, ws, "Template Soal");
    XLSX.writeFile(wb, "Template_Import_Soal.xlsx");
  }
</script>

{#if show}
  <div use:portal class="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" on:click={close}></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
        
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Import Soal dari Excel
              </h3>
              
              <div class="mt-4">
                <button type="button" on:click={downloadTemplate} class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                  <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Unduh Template Excel
                </button>
                <div class="mt-2 text-xs text-gray-600 p-2 bg-gray-50 rounded border border-gray-100">
                  <p class="font-semibold mb-1">Panduan Pengisian:</p>
                  <ul class="list-disc pl-4 space-y-1">
                    <li>Gunakan <strong>Pilihan Ganda</strong>, <strong>Benar Salah</strong>, <strong>Isian Singkat</strong>, atau <strong>Esai</strong> di kolom Tipe Soal.</li>
                    <li>Jawaban Benar untuk Pilihan Ganda cukup diisi <strong>A/B/C/D/E</strong>.</li>
                    <li>Biarkan kolom opsi jawaban kosong untuk tipe selain Pilihan Ganda.</li>
                  </ul>
                </div>
              </div>

              <div class="mt-6 border-t border-gray-200 pt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Pilih File Excel (.xlsx)</label>
                <input 
                  bind:this={fileInput}
                  type="file" 
                  accept=".xlsx, .xls"
                  on:change={handleFileChange}
                  class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors"
                />
              </div>

              {#if errorMsg}
                <div class="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm text-red-700">{errorMsg}</p>
                    </div>
                  </div>
                </div>
              {/if}

            </div>
          </div>
        </div>
        
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button 
            type="button" 
            on:click={parseExcel}
            disabled={!selectedFile || isParsing}
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {#if isParsing}
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Memproses...
            {:else}
              Mulai Import
            {/if}
          </button>
          <button 
            type="button" 
            on:click={close}
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
          >
            Batal
          </button>
        </div>

        <!-- Hidden form for actual submission -->
        <form method="POST" action="?/importExcel" class="hidden">
          <input type="hidden" name="questions_json" value={JSON.stringify(parsedData)} />
          <button type="submit" id="submit-import-btn"></button>
        </form>

      </div>
    </div>
  </div>
{/if}
