<script lang="ts">
  export let show = false;
  export let users: { id: number | string; name: string; username: string; role: string; photo?: string | null }[] = [];
  export let schoolName: string = '';
  export let schoolLogo: string = '';

  let selectedRole: string = '';
  let cardSize: string = 'default';

  $: filteredUsers = selectedRole
    ? users.filter((u) => u.role === selectedRole)
    : [];

  const roleLabels: Record<string, string> = {
    guru: 'Guru',
    pengawas: 'Pengawas',
    admin: 'Administrator'
  };

  function getLoginUrl() {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return '';
  }

  function portal(node: HTMLElement) {
    document.body.appendChild(node);
    return {
      destroy() {
        if (node.parentNode) node.parentNode.removeChild(node);
      }
    };
  }

  function close() {
    show = false;
    selectedRole = '';
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
    if (!filteredUsers.length) return;
    const loginUrl = getLoginUrl();
    const roleLabel = roleLabels[selectedRole] || selectedRole;
    const sn = schoolName;
    const sl = schoolLogo;

    const logoHtml = sl
      ? `<img src="${escapeHtml(sl)}" alt="Logo" style="width:40px;height:40px;object-fit:contain;border-radius:8px;background:rgba(255,255,255,.2);padding:3px;" />`
      : `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`;

    const cardsHtml = filteredUsers
      .map(
        (u) => {
          return `
        <div class="card ${cardSize !== 'default' ? 'size-' + cardSize : ''}">
          <div class="card-header">
            <div class="logo-area">
              <div class="logo-circle">${logoHtml}</div>
              <div>
                ${sn ? `<div class="school-name">${escapeHtml(sn)}</div>` : ''}
                <div class="school-label">KARTU LOGIN PETUGAS</div>
                <div class="class-label">${escapeHtml(roleLabel)}</div>
              </div>
            </div>
          </div>
          <div class="card-body">
            ${u.photo 
              ? `<img src="${escapeHtml(u.photo)}" class="avatar" style="object-fit:cover;" alt="" />`
              : `<div class="avatar-placeholder">${escapeHtml(u.name.charAt(0).toUpperCase())}</div>`
            }
            <div class="name">${escapeHtml(u.name)}</div>
            <div class="divider"></div>
            <div class="credentials">
              <div class="cred-row">
                <span class="cred-icon">&#128100;</span>
                <div class="cred-info">
                  <div class="cred-label">Username</div>
                  <div class="cred-value">${escapeHtml(u.username)}</div>
                </div>
              </div>
              <div class="cred-row">
                <span class="cred-icon">&#128273;</span>
                <div class="cred-info">
                  <div class="cred-label">Password</div>
                  <div class="cred-value">********</div>
                </div>
              </div>
            </div>
            <div class="url-row">
              <div class="url-label">&#127758; Link Akses</div>
              <div class="url-value">${escapeHtml(loginUrl)}</div>
            </div>
          </div>
          <div class="card-footer">Kerahasiaan data adalah tanggung jawab Anda</div>
        </div>`;
        }
      )
      .join('');

    const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Kartu Login ${escapeHtml(roleLabel)}${sn ? ' | ' + escapeHtml(sn) : ''}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Inter',sans-serif;background:#f8fafc;padding:24px;}
  h1{text-align:center;color:#0f172a;font-size:22px;font-weight:800;margin-bottom:20px;letter-spacing:-0.02em;}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));justify-items:center;gap:24px;max-width:1200px;margin:0 auto;}
  .card{background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 10px 30px rgba(15,23,42,.08);break-inside:avoid;page-break-inside:avoid;display:flex;flex-direction:column;border:1px solid #e2e8f0;position:relative;}
  
  .card.size-b1 { width: 65mm; height: 102mm; border-radius: 12px; }
  .card.size-b2 { width: 79mm; height: 126mm; border-radius: 12px; }
  .card.size-b3 { width: 95mm; height: 126mm; border-radius: 12px; }
  .card.size-b4 { width: 105mm; height: 155mm; border-radius: 12px; }
  
  .card.size-b1 .avatar, .card.size-b1 .avatar-placeholder { width: 32px; height: 42px; font-size: 16px; margin-bottom: 4px; border-radius: 6px; }
  .card.size-b1 .name { font-size: 11px; }
  .card.size-b1 .cred-value { font-size: 11px; }
  .card.size-b1 .url-value { font-size: 8px; }
  .card.size-b1 .card-header { padding: 8px 10px; }
  .card.size-b1 .card-body { padding: 8px 10px; }
  .card.size-b1 .cred-row { padding: 4px 8px; gap: 4px; border-radius:8px; }
  .card.size-b1 .url-row { padding: 4px 8px; border-radius:8px; }
  .card.size-b1 .card-footer { padding: 4px 8px; font-size: 6px; line-height: 1.1; }
  .card.size-b1 .divider { margin: 6px 0; }
  .card.size-b1 .credentials { margin-bottom: 6px; gap: 6px; }

  .card-header{background:#0f172a;padding:18px 22px;position:relative;overflow:hidden;}
  .card-header::after{content:'';position:absolute;top:0;right:0;width:150px;height:150px;background:radial-gradient(circle,rgba(56,189,248,0.2) 0%,transparent 70%);transform:translate(30%,-30%);}
  
  .logo-area{display:flex;align-items:center;gap:12px;position:relative;z-index:2;}
  .logo-circle{width:48px;height:48px;border-radius:12px;background:rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;border:1px solid rgba(255,255,255,0.2);}
  .school-name{font-size:14px;font-weight:800;color:#fff;line-height:1.2;}
  .school-label{font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.1em;margin-top:2px;}
  .class-label{font-size:18px;font-weight:800;color:#38bdf8;margin-top:2px;}
  
  .card-body{padding:22px;flex:1;display:flex;flex-direction:column;justify-content:center;background:#ffffff;}
  
  .avatar, .avatar-placeholder{width:64px;height:84px;border-radius:12px;margin:0 auto 12px;box-shadow:0 4px 12px rgba(0,0,0,0.1);border:2px solid #fff;outline:1px solid #e2e8f0;}
  .avatar-placeholder{background:linear-gradient(135deg,#0ea5e9,#3b82f6);display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:800;color:#fff;}
  
  .name{text-align:center;font-size:17px;font-weight:800;color:#0f172a;letter-spacing:-0.01em;line-height:1.2;text-transform:capitalize;}
  
  .divider{height:1px;background:linear-gradient(90deg,transparent,#cbd5e1,transparent);margin:16px 0;}
  
  .credentials{display:flex;flex-direction:column;gap:12px;margin-bottom:16px;}
  .cred-row{display:flex;align-items:center;gap:12px;background:#f8fafc;border-radius:12px;padding:12px 16px;border:1px solid #e2e8f0;transition:all 0.2s;}
  .cred-icon{font-size:20px;flex-shrink:0;}
  .cred-info{flex:1;min-width:0;}
  .cred-label{font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.08em;}
  .cred-value{font-size:16px;font-weight:800;color:#0f172a;letter-spacing:.05em;margin-top:2px;word-break:break-all;}
  
  .url-row{background:linear-gradient(135deg,#f0f9ff,#e0f2fe);border:1px solid #bae6fd;border-radius:12px;padding:12px 16px;text-align:center;}
  .url-label{font-size:10px;font-weight:800;color:#0284c7;margin-bottom:4px;letter-spacing:.05em;}
  .url-value{font-size:14px;font-weight:700;color:#0369a1;word-break:break-all;}
  
  .card-footer{background:#0f172a;padding:8px 16px;font-size:9px;color:#cbd5e1;text-align:center;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;}
  
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
      border: 1px solid #cbd5e1 !important;
      margin: 0 !important;
      outline: none !important;
      position: relative !important;
      break-inside: avoid !important;
      page-break-inside: avoid !important;
      width: 100% !important;
      max-width: 85mm !important;
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
    .card.size-b1 { width: 65mm !important; max-width: none !important; }
    .card.size-b2 { width: 79mm !important; max-width: none !important; }
    .card.size-b3 { width: 95mm !important; max-width: none !important; }
    .card.size-b4 { width: 105mm !important; max-width: none !important; }
    .card-header{background:#0f172a !important;}
    .avatar-placeholder{background:linear-gradient(135deg,#0ea5e9,#3b82f6) !important;}
    .cred-row{background:#f8fafc !important;}
    .url-row{background:linear-gradient(135deg,#f0f9ff,#e0f2fe) !important;}
    .card-footer{background:#0f172a !important;}
  }
</style>
</head>
<body>
<h1>Kartu Login ${escapeHtml(roleLabel)}</h1>
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

    <div class="bg-white w-full max-w-md rounded-3xl shadow-2xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden login-card-modal">
      <!-- Header -->
      <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
            <svg class="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-bold">Kartu Login Petugas</h2>
            <p class="text-sm text-slate-400 font-medium">Cetak kartu akses sistem</p>
          </div>
        </div>
        <button
          class="text-slate-400 hover:text-white p-2 hover:bg-white/10 rounded-xl transition-colors"
          on:click={close}
          aria-label="Tutup"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50">
        <div>
          <label for="role-select" class="block text-sm font-bold text-slate-700 mb-2">
            Pilih Role Petugas
          </label>
          <select
            id="role-select"
            class="input bg-white shadow-sm border-slate-200"
            bind:value={selectedRole}
          >
            <option value="">-- Pilih role --</option>
            <option value="guru">Guru</option>
            <option value="pengawas">Pengawas</option>
          </select>
        </div>

        {#if selectedRole}
          {#if filteredUsers.length > 0}
            <div class="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
              <div class="flex items-center gap-3 mb-5">
                <div class="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                  {filteredUsers.length}
                </div>
                <div>
                  <p class="text-sm font-bold text-slate-900">{filteredUsers.length} pengguna ditemukan</p>
                  <p class="text-xs text-slate-500 font-medium">Role: {roleLabels[selectedRole]}</p>
                </div>
              </div>

              <!-- Card preview (miniature) -->
              <div class="rounded-2xl overflow-hidden shadow-lg border border-slate-200 transform origin-top left-1/2">
                <div class="flex items-center gap-3 px-5 py-4 bg-slate-900 relative overflow-hidden">
                  <div class="absolute top-0 right-0 w-24 h-24 bg-sky-500/20 rounded-full blur-xl -mr-10 -mt-10"></div>
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-white/20 bg-white/10 relative z-10">
                    {#if schoolLogo}
                      <img src={schoolLogo} alt="Logo" class="w-full h-full object-contain p-1" />
                    {:else}
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0121 13c0 5.523-4.477 10-10 10S2 18.523 2 13c0-.97.13-1.91.38-2.8L12 14z"/>
                      </svg>
                    {/if}
                  </div>
                  <div class="min-w-0 relative z-10">
                    {#if schoolName}
                      <p class="text-white text-xs font-extrabold leading-tight truncate">{schoolName}</p>
                    {/if}
                    <p class="text-slate-400 text-[9px] font-bold uppercase tracking-wider mt-0.5">Kartu Login Petugas</p>
                    <p class="text-sky-400 text-sm font-bold truncate">{roleLabels[selectedRole]}</p>
                  </div>
                </div>
                
                <div class="bg-white px-5 py-5 text-center">
                  <div class="w-16 h-20 mx-auto rounded-xl shadow-md border-2 border-white outline outline-1 outline-slate-200 overflow-hidden mb-3 flex items-center justify-center text-white font-bold text-2xl" style="background: linear-gradient(135deg,#0ea5e9,#3b82f6);">
                    {#if filteredUsers[0].photo}
                      <img src={filteredUsers[0].photo} class="w-full h-full object-cover" alt="" />
                    {:else}
                      {filteredUsers[0].name.charAt(0).toUpperCase()}
                    {/if}
                  </div>
                  
                  <p class="text-base font-extrabold text-slate-900 leading-tight truncate capitalize">{filteredUsers[0].name}</p>
                  
                  <div class="mt-4 space-y-2 text-left">
                    <div class="flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
                      <span class="text-base">👤</span>
                      <div class="min-w-0">
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Username</p>
                        <p class="text-sm font-bold text-slate-800 truncate">{filteredUsers[0].username}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          {:else}
            <div class="bg-slate-100 border border-slate-200 rounded-3xl p-6 text-center">
              <span class="text-4xl block mb-3 opacity-50">👥</span>
              <p class="text-sm font-bold text-slate-600">Tidak ada pengguna</p>
              <p class="text-xs text-slate-400 mt-1">Belum ada akun terdaftar untuk role ini.</p>
            </div>
          {/if}
        {:else}
          <div class="bg-slate-100 border border-slate-200 border-dashed rounded-3xl p-8 text-center">
            <div class="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-4 border border-slate-200">
              <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0"/>
              </svg>
            </div>
            <p class="text-sm font-bold text-slate-500">Pilih role untuk melihat pratinjau kartu</p>
          </div>
        {/if}
      </div>

      <!-- Footer -->
      <div class="p-6 border-t border-slate-100 bg-white flex items-center justify-end gap-3">
        <button class="btn btn-secondary shadow-sm" on:click={close}>Batal</button>
        <button
          class="btn bg-slate-900 text-white hover:bg-slate-800 shadow-md shadow-slate-900/20 gap-2 font-bold px-5"
          on:click={printCards}
          disabled={!selectedRole || filteredUsers.length === 0}
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
          </svg>
          Cetak Kartu Login
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .login-card-modal {
    animation: modalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }
  @keyframes modalIn {
    from { opacity: 0; transform: scale(0.95) translateY(20px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
</style>
