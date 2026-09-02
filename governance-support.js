(() => {
  'use strict';

  const config = {
    occupation: { singular: 'Ocupação', plural: 'Ocupações', listRpc: 'get_workspace_occupations', createRpc: 'create_workspace_occupation', updateRpc: 'update_workspace_occupation', statusRpc: 'set_workspace_occupation_status' },
    function: { singular: 'Função Profissional', plural: 'Funções Profissionais', listRpc: 'get_workspace_professional_functions', createRpc: 'create_workspace_professional_function', updateRpc: 'update_workspace_professional_function', statusRpc: 'set_workspace_professional_function_status' }
  };
  const kind = document.body.dataset.governanceKind;
  const cfg = config[kind];
  let rows = [];
  let editingId = null;
  const $ = (id) => document.getElementById(id);
  const client = () => window.LabMedSysAuth.getSupabaseClient();

  function message(text = '', type = '') { const el = $('governance-message'); el.textContent = text; el.className = `governance-message ${type}`.trim(); }
  function escapeHtml(value) { return String(value ?? '').replace(/[&<>'"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }

  function render() {
    const query = $('governance-search').value.trim().toLowerCase();
    const status = $('governance-filter').value;
    const filtered = rows.filter(row => (!query || [row.code,row.name,row.description].some(v => String(v || '').toLowerCase().includes(query))) && (status === 'all' || row.status === status));
    $('governance-count').textContent = `${filtered.length} ${filtered.length === 1 ? 'registro' : 'registros'}`;
    $('governance-tbody').innerHTML = filtered.length ? filtered.map(row => `<tr><td><span class="governance-code">${escapeHtml(row.code)}</span></td><td><span class="governance-name">${escapeHtml(row.name)}</span></td><td><span class="governance-description">${escapeHtml(row.description || '—')}</span></td><td><span class="governance-status ${row.status}">${row.status === 'active' ? 'Ativo' : 'Inativo'}</span></td><td><div class="governance-actions"><button class="governance-action" data-action="edit" data-id="${row.id}">Editar</button><button class="governance-action danger" data-action="status" data-id="${row.id}">${row.status === 'active' ? 'Inativar' : 'Ativar'}</button></div></td></tr>`).join('') : '<tr><td colspan="5" class="governance-empty">Nenhum registro encontrado.</td></tr>';
  }

  async function load() {
    message('Carregando...');
    const { data, error } = await client().rpc(cfg.listRpc);
    if (error) throw error;
    rows = Array.isArray(data) ? data : [];
    render();
    message('');
  }

  function openModal(row = null) {
    editingId = row?.id || null;
    $('modal-title').textContent = editingId ? `Editar ${cfg.singular}` : `Nova ${cfg.singular}`;
    $('field-code').value = row?.code || '';
    $('field-name').value = row?.name || '';
    $('field-description').value = row?.description || '';
    $('governance-modal').hidden = false;
    setTimeout(() => $('field-code').focus(), 50);
  }
  function closeModal() { $('governance-modal').hidden = true; editingId = null; $('governance-form').reset(); }

  async function save(event) {
    event.preventDefault();
    const code = $('field-code').value.trim(), name = $('field-name').value.trim(), description = $('field-description').value.trim();
    if (!code || !name) return;
    const wasEditing = Boolean(editingId), button = $('save-btn');
    button.disabled = true; button.textContent = 'Salvando...';
    try {
      const params = wasEditing ? {p_id:editingId,p_code:code,p_name:name,p_description:description || null} : {p_code:code,p_name:name,p_description:description || null};
      const { error } = await client().rpc(wasEditing ? cfg.updateRpc : cfg.createRpc, params);
      if (error) throw error;
      closeModal();
      await load();
      message(`${cfg.singular} ${wasEditing ? 'atualizada' : 'criada'} com sucesso.`, 'success');
    } catch (error) { console.error(error); message(error.message || `Não foi possível salvar ${cfg.singular.toLowerCase()}.`, 'error'); }
    finally { button.disabled = false; button.textContent = 'Salvar'; }
  }

  async function changeStatus(id, currentStatus) {
    const next = currentStatus === 'active' ? 'inactive' : 'active', row = rows.find(r => r.id === id), action = next === 'inactive' ? 'inativar' : 'ativar';
    if (!row || !window.confirm(`Deseja ${action} ${row.name}?`)) return;
    try {
      const { error } = await client().rpc(cfg.statusRpc, {p_id:id,p_status:next});
      if (error) throw error;
      await load();
      message(`${cfg.singular} ${next === 'active' ? 'ativada' : 'inativada'} com sucesso.`, 'success');
    } catch (error) { console.error(error); message(error.message || 'Não foi possível alterar o status.', 'error'); }
  }

  async function init() {
    try {
      const session = await window.LabMedSysAuth?.getSession?.();
      if (!session?.user) { window.location.replace('index.html'); return; }
      const metadata = session.user.user_metadata || {}, fullName = metadata.full_name || session.user.email || 'Workspace Admin', initial = fullName.trim().charAt(0).toUpperCase() || 'A';
      $('workspace-user-name').textContent = fullName; $('dropdown-user-name').textContent = fullName; $('dropdown-user-email').textContent = session.user.email || '';
      document.querySelectorAll('.user-avatar').forEach(a => a.textContent = initial);
      const menu = $('user-menu'), dropdown = $('user-dropdown');
      menu?.addEventListener('click', e => { e.stopPropagation(); const open = !dropdown.hidden; dropdown.hidden = open; menu.setAttribute('aria-expanded', String(!open)); });
      document.addEventListener('click', () => { if (dropdown && !dropdown.hidden) { dropdown.hidden = true; menu?.setAttribute('aria-expanded','false'); } });
      dropdown?.addEventListener('click', e => e.stopPropagation());
      $('sign-out-btn')?.addEventListener('click', async () => { try { await window.LabMedSysAuth.signOut(); window.location.replace('index.html'); } catch(e) { console.error(e); } });
      $('governance-search').addEventListener('input', render); $('governance-filter').addEventListener('change', render); $('new-btn').addEventListener('click', () => openModal()); $('modal-close').addEventListener('click', closeModal); $('modal-cancel').addEventListener('click', closeModal); $('governance-modal').addEventListener('click', e => { if (e.target === $('governance-modal')) closeModal(); }); $('governance-form').addEventListener('submit', save);
      $('governance-tbody').addEventListener('click', e => { const button = e.target.closest('[data-action]'); if (!button) return; const row = rows.find(r => r.id === button.dataset.id); if (!row) return; if (button.dataset.action === 'edit') openModal(row); if (button.dataset.action === 'status') changeStatus(row.id, row.status); });
      await load();
    } catch (error) { console.error(error); message(error.message || 'Não foi possível carregar os registros.', 'error'); $('governance-tbody').innerHTML = '<tr><td colspan="5" class="governance-empty">Não foi possível carregar os dados. Verifique o acesso administrativo do Workspace.</td></tr>'; }
  }
  document.addEventListener('DOMContentLoaded', init);
})();
