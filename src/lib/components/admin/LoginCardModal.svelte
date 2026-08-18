<script lang="ts">
  import { parseDate } from '$lib/utils/date';
  import { generateStudentQrData, getQrCodeImageUrl } from '$lib/utils/qrLogin';

  export let show = false;
  export let classes: { id: number | string; name: string }[] = [];
  export let students: { id: number | string; name: string; username: string; class_id: number | string | null; class_name: string | null; place_of_birth?: string | null; date_of_birth?: string | null; photo?: string | null; nisn?: string | null; nomor_peserta?: string | null; }[] = [];
  export let schoolName: string = '';
  export let schoolLogo: string = '';

  let selectedClassId: string = '';
  let cardSize: string = 'default';

  $: filteredStudents = selectedClassId
    ? students.filter((s) => String(s.class_id) === String(selectedClassId))
    : [];

  $: selectedClassName = classes.find((c) => String(c.id) === String(selectedClassId))?.name ?? '';

  function formatBirth(place?: string | null, dateStr?: string | null) {
    if (!place && !dateStr) return '';
    let formattedDate = '';
    if (dateStr) {
      try {
        formattedDate = parseDate(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      } catch {
        formattedDate = dateStr;
      }
    }
    if (place && formattedDate) return `${place}, ${formattedDate}`;
    return place || formattedDate || '';
  }

  function getLoginUrl() {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return '';
  }

  function portal(node: HTMLElement) {
    let destroyed = false;
    setTimeout(() => {
      if (!destroyed && node && node.parentNode !== document.body) {
        document.body.appendChild(node);
      }
    }, 0);
    return {
      destroy() {
        destroyed = true;
        if (node && node.parentNode) node.parentNode.removeChild(node);
      }
    };
  }

  function close() {
    show = false;
    selectedClassId = '';
  }

  function escapeHtml(str: string) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function printCards() {
    if (!filteredStudents.length) return;
    const loginUrl = getLoginUrl();
    const cn = selectedClassName;
    const sn = schoolName;
    const sl = schoolLogo;

    const logoHtml = sl
      ? `<img src="${escapeHtml(sl)}" alt="Logo" style="width:40px;height:40px;object-fit:contain;border-radius:8px;background:rgba(255,255,255,.2);padding:3px;" />`
      : `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`;

    const cardsHtml = filteredStudents
      .map(
        (s) => {
          const ttl = formatBirth(s.place_of_birth, s.date_of_birth);
          return `
        <div class="card ${cardSize !== 'default' ? 'size-' + cardSize : ''}">
          <div class="card-header">
            <div class="logo-area">
              <div class="logo-circle">${logoHtml}</div>
              <div>
                ${sn ? `<div class="school-name">${escapeHtml(sn)}</div>` : ''}
                <div class="school-label">KARTU LOGIN UJIAN</div>
                <div class="class-label">${escapeHtml(cn)}</div>
              </div>
            </div>
          </div>
          <div class="card-body">
            ${s.photo 
              ? `<img src="${escapeHtml(s.photo)}" class="avatar" style="object-fit:cover;padding:0;background:none;border-radius:50%;" alt="" />`
              : `<div class="avatar">${escapeHtml(s.name.charAt(0).toUpperCase())}</div>`
            }
            <div class="name">${escapeHtml(s.name)}</div>
            ${ttl ? `<div class="ttl">📍 ${escapeHtml(ttl)}</div>` : ''}
            <div class="divider"></div>
            <div class="credentials">
              <div class="cred-row">
                <span class="cred-icon">&#128100;</span>
                <div class="cred-info">
                  <div class="cred-label">Username</div>
                  <div class="cred-value">${escapeHtml(s.username)}</div>
                </div>
              </div>
              <div class="cred-row">
                <span class="cred-icon">&#128273;</span>
                <div class="cred-info">
                  <div class="cred-label">Password</div>
                  <div class="cred-value">${escapeHtml(s.nisn || s.username)}</div>
                </div>
              </div>
            </div>
            <div class="url-row">
              <div class="url-label">&#127758; Link Akses</div>
              <div class="url-value">${escapeHtml(loginUrl)}</div>
            </div>
            <div style="margin-top:8px;display:flex;align-items:center;gap:10px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:6px 10px;">
              <img src="${escapeHtml(getQrCodeImageUrl(generateStudentQrData(s.username, s.nisn || s.username), 100))}" alt="QR" style="width:44px;height:44px;flex-shrink:0;border-radius:6px;" />
              <div style="font-size:9px;line-height:1.2;color:#64748b;">
                <strong style="color:#4f46e5;display:block;font-size:10px;margin-bottom:2px;">QR Login Ujian</strong>
                Scan dengan kamera untuk login otomatis
              </div>
            </div>
          </div>
          <div class="card-footer">Simpan kartu ini baik-baik &#183; Jangan bagikan ke orang lain</div>
        </div>`;
        }
      )
      .join('');

    const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Kartu Login Siswa - ${escapeHtml(cn)}${sn ? ' | ' + escapeHtml(sn) : ''}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Inter',sans-serif;background:#f1f5f9;padding:24px;}
  h1{text-align:center;color:#1e293b;font-size:20px;font-weight:800;margin-bottom:20px;letter-spacing:-0.02em;}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));justify-items:center;gap:20px;max-width:1200px;margin:0 auto;}
  .card{background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(99,102,241,.13);break-inside:avoid;page-break-inside:avoid;display:flex;flex-direction:column;}
  .card.size-b1 { width: 65mm; height: 102mm; border-radius: 12px; }
  .card.size-b2 { width: 79mm; height: 126mm; border-radius: 12px; }
  .card.size-b3 { width: 95mm; height: 126mm; border-radius: 12px; }
  .card.size-b4 { width: 105mm; height: 155mm; border-radius: 12px; }
  .card.size-b1 .avatar { width: 38px; height: 38px; font-size: 16px; margin-bottom: 4px; }
  .card.size-b1 .name { font-size: 11px; }
  .card.size-b1 .ttl { font-size: 8px; margin-top: 1px; }
  .card.size-b1 .cred-value { font-size: 11px; }
  .card.size-b1 .url-value { font-size: 8px; }
  .card.size-b1 .card-header { padding: 8px 10px; }
  .card.size-b1 .card-body { padding: 8px 10px; }
  .card.size-b1 .cred-row { padding: 4px 8px; gap: 4px; }
  .card.size-b1 .url-row { padding: 4px 8px; }
  .card.size-b1 .card-footer { padding: 4px 8px; font-size: 6px; line-height: 1.1; }
  .card.size-b1 .divider { margin: 6px 0; }
  .card.size-b1 .credentials { margin-bottom: 6px; gap: 6px; }

  /* B2, B3 adjustments for vertical height safety */
  .card.size-b2 .card-body, .card.size-b3 .card-body { padding: 12px 16px; }
  .card.size-b2 .avatar, .card.size-b3 .avatar { width: 45px; height: 45px; margin-bottom: 6px; }
  .card.size-b2 .divider, .card.size-b3 .divider { margin: 8px 0; }
  .card.size-b2 .credentials, .card.size-b3 .credentials { margin-bottom: 8px; }
  .card.size-b2 .card-footer, .card.size-b3 .card-footer { font-size: 7.5px; padding: 6px 12px; }
  .card-header{background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);padding:16px 20px;}
  .logo-area{display:flex;align-items:center;gap:12px;}
  .logo-circle{width:46px;height:46px;border-radius:12px;background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;}
  .school-name{font-size:13px;font-weight:800;color:#fff;line-height:1.2;}
  .school-label{font-size:9px;font-weight:700;color:rgba(255,255,255,.65);text-transform:uppercase;letter-spacing:.08em;margin-top:1px;}
  .class-label{font-size:17px;font-weight:800;color:#fff;margin-top:2px;}
  .card-body{padding:20px;flex:1;display:flex;flex-direction:column;justify-content:center;}
  .avatar{width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:800;color:#fff;margin:0 auto 10px;}
  .name{text-align:center;font-size:16px;font-weight:700;color:#1e293b;letter-spacing:-0.01em;line-height:1.3;}
  .ttl{text-align:center;font-size:11px;font-weight:600;color:#64748b;margin-top:3px;}
  .divider{height:1px;background:linear-gradient(90deg,transparent,#e2e8f0,transparent);margin:14px 0;}
  .credentials{display:flex;flex-direction:column;gap:10px;margin-bottom:14px;}
  .cred-row{display:flex;align-items:center;gap:10px;background:#f8fafc;border-radius:12px;padding:10px 14px;border:1px solid #e2e8f0;}
  .cred-icon{font-size:18px;flex-shrink:0;}
  .cred-info{flex:1;min-width:0;}
  .cred-label{font-size:10px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;}
  .cred-value{font-size:18px;font-weight:800;color:#1e293b;letter-spacing:.04em;margin-top:1px;word-break:break-all;}
  .url-row{background:linear-gradient(135deg,#eff6ff,#eef2ff);border:1px solid #c7d2fe;border-radius:12px;padding:10px 14px;text-align:center;}
  .url-label{font-size:10px;font-weight:600;color:#6366f1;margin-bottom:3px;letter-spacing:.04em;}
  .url-value{font-size:13px;font-weight:700;color:#4338ca;word-break:break-all;}
  .card-footer{background:#f8fafc;border-top:1px solid #f1f5f9;padding:6px 12px;font-size:8px;color:#94a3b8;text-align:center;font-weight:500;}
  @media print{
    *{-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important;color-adjust:exact !important;}
    body{background:#ffffff !important;padding:24px;}
    .grid{
      display:grid !important;
      grid-template-columns:repeat(3, 1fr) !important;
      gap:32px !important;
      justify-items:center !important;
    }
    .card{
      box-shadow:none !important;
      border: 1px solid #000 !important;
      margin: 0 !important;
      outline: none !important;
      position: relative !important;
      break-inside: avoid !important;
      page-break-inside: avoid !important;
      -webkit-column-break-inside: avoid !important;
      width: 100% !important; /* Ensure standard cards take full column width */
      max-width: 85mm !important; /* Prevent them from becoming too massive */
    }
    .card::before{
      content: "" !important;
      position: absolute !important;
      top: -12px !important;
      left: -12px !important;
      right: -12px !important;
      bottom: -12px !important;
      border: 1.5px dashed #94a3b8 !important;
      border-radius: 20px !important;
      pointer-events: none !important;
    }
    /* Specific sizes retain their exact physical width */
    .card.size-b1 { width: 65mm !important; max-width: none !important; }
    .card.size-b2 { width: 79mm !important; max-width: none !important; }
    .card.size-b3 { width: 95mm !important; max-width: none !important; }
    .card.size-b4 { width: 105mm !important; max-width: none !important; }
    .card-header{background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%) !important;background-color:#4f46e5 !important;}
    .avatar{background:linear-gradient(135deg,#6366f1,#8b5cf6) !important;background-color:#6366f1 !important;}
    .logo-circle{background:rgba(255,255,255,.2) !important;background-color:rgba(255,255,255,.2) !important;}
    .cred-row{background:#f8fafc !important;}
    .url-row{background:linear-gradient(135deg,#eff6ff,#eef2ff) !important;background-color:#eff6ff !important;}
    .card-footer{background:#f8fafc !important;}
    h1{margin-bottom:10px;}
  }
  @media(max-width:600px){.grid{grid-template-columns:1fr;}}
</style>
</head>
<body>
<h1>Kartu Login Siswa - ${escapeHtml(cn)}</h1>
<div class="grid">${cardsHtml}</div>
<script>window.onload=function(){window.print();}<\/script>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }
</script>

{#if show}
  <div use:portal class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <div
      class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
      on:click={close}
      role="button"
      tabindex="-1"
      aria-label="Tutup modal"
    ></div>

    <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden login-card-modal">
      <!-- Header -->
      <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-violet-50">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-bold text-slate-800">Kartu Login Siswa</h2>
            <p class="text-xs text-slate-500">Cetak kartu login per kelas</p>
          </div>
        </div>
        <button
          class="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-xl transition-colors"
          on:click={close}
          aria-label="Tutup"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="p-5 overflow-y-auto flex-1 space-y-5">
        <div class="mb-6">
          <div>
            <label for="class-select" class="block text-sm font-semibold text-slate-700 mb-2">
              Pilih Kelas
            </label>
            <select
              id="class-select"
              class="input"
              bind:value={selectedClassId}
            >
              <option value="">-- Pilih kelas --</option>
              {#each classes as cls (cls.id)}
                <option value={String(cls.id)}>{cls.name}</option>
              {/each}
            </select>
          </div>
        </div>

        {#if selectedClassId}
          {#if filteredStudents.length > 0}
            <div class="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-4">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                  {filteredStudents.length}
                </div>
                <div>
                  <p class="text-sm font-bold text-indigo-900">{filteredStudents.length} siswa ditemukan</p>
                  <p class="text-xs text-indigo-600">{selectedClassName}</p>
                </div>
              </div>

              <!-- Card preview -->
              <div class="rounded-xl overflow-hidden shadow-md border border-indigo-200">
                <div class="flex items-center gap-2.5 px-4 py-3" style="background: linear-gradient(135deg, #4f46e5, #7c3aed);">
                  <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden" style="background: rgba(255,255,255,.15);">
                    {#if schoolLogo}
                      <img src={schoolLogo} alt="Logo" class="w-full h-full object-contain p-0.5" />
                    {:else}
                      <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0121 13c0 5.523-4.477 10-10 10S2 18.523 2 13c0-.97.13-1.91.38-2.8L12 14z"/>
                      </svg>
                    {/if}
                  </div>
                  <div class="min-w-0">
                    {#if schoolName}
                      <p class="text-white text-xs font-extrabold leading-tight truncate">{schoolName}</p>
                    {/if}
                    <p class="text-white/70 text-[9px] font-bold uppercase tracking-wider">Kartu Login Ujian</p>
                    <p class="text-white text-sm font-bold truncate">{selectedClassName}</p>
                  </div>
                </div>
                <div class="bg-white px-4 py-3">
                  <div class="flex items-center gap-3 mb-3">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden" style="background: linear-gradient(135deg,#6366f1,#8b5cf6);">
                      {#if filteredStudents[0].photo}
                        <img src={filteredStudents[0].photo} class="w-full h-full object-cover" alt="" />
                      {:else}
                        {filteredStudents[0].name.charAt(0).toUpperCase()}
                      {/if}
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-bold text-slate-800 leading-tight truncate">{filteredStudents[0].name}</p>
                      <p class="text-xs text-slate-400">{selectedClassName}</p>
                      {#if formatBirth(filteredStudents[0].place_of_birth, filteredStudents[0].date_of_birth)}
                        <p class="text-[11px] font-semibold text-indigo-600 truncate mt-0.5">
                          📍 {formatBirth(filteredStudents[0].place_of_birth, filteredStudents[0].date_of_birth)}
                        </p>
                      {/if}
                    </div>
                  </div>
                  <div class="space-y-2">
                    <div class="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
                      <span class="text-sm flex-shrink-0">👤</span>
                      <div class="min-w-0">
                        <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Username</p>
                        <p class="text-sm font-bold text-slate-800 truncate">{filteredStudents[0].username}</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
                      <span class="text-sm flex-shrink-0">🔑</span>
                      <div class="min-w-0">
                        <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Password</p>
                        <p class="text-sm font-bold text-slate-800 truncate">{filteredStudents[0].nisn || filteredStudents[0].username}</p>
                      </div>
                    </div>
                    <div class="bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2 text-center">
                      <p class="text-[9px] font-bold text-indigo-500 uppercase tracking-wider mb-0.5">🌐 Link Akses</p>
                      <p class="text-xs font-bold text-indigo-700 break-all">{getLoginUrl()}</p>
                    </div>
                    <div class="flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-xl p-2.5">
                      <img src={getQrCodeImageUrl(generateStudentQrData(filteredStudents[0].username, filteredStudents[0].nisn || filteredStudents[0].username), 80)} alt="QR" class="w-11 h-11 rounded-lg bg-white p-0.5 border border-slate-200 flex-shrink-0" />
                      <div class="min-w-0">
                        <p class="text-[10px] font-bold text-indigo-900 leading-tight">QR Login Ujian</p>
                        <p class="text-[9px] text-slate-500 mt-0.5">Scan langsung untuk login otomatis</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-slate-50 px-4 py-2 border-t border-slate-100 text-center">
                  <p class="text-[9px] font-medium text-slate-400">Simpan kartu ini baik-baik &middot; Jangan bagikan ke orang lain</p>
                </div>
              </div>

              {#if filteredStudents.length > 1}
                <p class="text-center text-xs text-indigo-600 mt-3 font-medium">
                  + {filteredStudents.length - 1} kartu lainnya akan dicetak
                </p>
              {/if}
            </div>
          {:else}
            <div class="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
              <span class="text-3xl block mb-2">🏫</span>
              <p class="text-sm font-semibold text-amber-800">Tidak ada siswa di kelas ini</p>
              <p class="text-xs text-amber-600 mt-1">Pastikan siswa sudah terdaftar di kelas tersebut.</p>
            </div>
          {/if}
        {:else}
          <div class="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-6 text-center">
            <div class="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <svg class="w-7 h-7 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0"/>
              </svg>
            </div>
            <p class="text-sm font-medium text-slate-400">Pilih kelas untuk melihat pratinjau kartu login siswa</p>
          </div>
        {/if}
      </div>

      <!-- Footer -->
      <div class="p-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
        <button class="btn btn-secondary" on:click={close}>Batal</button>
        <button
          class="btn btn-primary gap-2"
          on:click={printCards}
          disabled={!selectedClassId || filteredStudents.length === 0}
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
          </svg>
          Cetak / Unduh Kartu
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .login-card-modal {
    animation: modalIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }
  @keyframes modalIn {
    from { opacity: 0; transform: scale(0.92) translateY(12px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
</style>
