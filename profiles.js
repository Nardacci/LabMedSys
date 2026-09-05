document.addEventListener('DOMContentLoaded', async () => {
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const tbody = document.getElementById('profile-tbody');
  const search = document.getElementById('profile-search');
  const count = document.getElementById('profile-count');
  const message = document.getElementById('profile-message');
  let rows = [];

  async function load() {
    const { data, error } = await supabase.rpc('get_workspace_access_profiles');
    if (error) { tbody.innerHTML = '<tr><td colspan="7" class="governance-empty">Não foi possível carregar os perfis.</td></tr>'; message.textContent = error.message; message.className='governance-message error'; return; }
    rows = data || []; render();
  }
  function render() {
    const q=(search.value||'').trim().toLowerCase();
    const filtered=rows.filter(r => [r.code,r.name,r.description].some(v => String(v||'').toLowerCase().includes(q)));
    count.textContent=`${filtered.length} ${filtered.length===1?'registro':'registros'}`;
    if(!filtered.length){tbody.innerHTML='<tr><td colspan="7" class="governance-empty">Nenhum perfil encontrado.</td></tr>';return;}
    tbody.innerHTML=filtered.map(r=>`<tr><td><span class="governance-code">${esc(r.code)}</span></td><td><span class="governance-name">${esc(r.name)}</span></td><td><span class="governance-description">${esc(r.description||'—')}</span></td><td>${Number(r.user_count||0)}</td><td>${Number(r.permission_count||0)}</td><td><span class="governance-status ${r.status==='active'?'active':'inactive'}">${r.status==='active'?'Ativo':'Inativo'}</span></td><td><div class="governance-actions"><a class="governance-action" href="profile-form.html?id=${encodeURIComponent(r.id)}">Editar</a></div></td></tr>`).join('');
  }
  function esc(v){return String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
  search.addEventListener('input',render);
  load();
});