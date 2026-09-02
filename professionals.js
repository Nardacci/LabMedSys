(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const client = () => window.LabMedSysAuth.getSupabaseClient();
  let rows = [], occupations = [], functions = [], editingId = null;

  const esc = v => String(v ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const message = (text='', type='') => { const e=$('professionals-message'); e.textContent=text; e.className=`professionals-message ${type}`.trim(); };
  const formMessage = (text='', type='') => { const e=$('professional-form-message'); e.textContent=text; e.className=`professional-form-message ${type}`.trim(); };

  function render(){
    const q=$('professionals-search').value.trim().toLowerCase(), status=$('professionals-filter').value;
    const filtered=rows.filter(r => (!q || [r.code,r.name,r.occupation_name,r.professional_function_name,r.registration_number].some(v=>String(v||'').toLowerCase().includes(q))) && (status==='all'||r.status===status));
    $('professionals-count').textContent=`${filtered.length} ${filtered.length===1?'registro':'registros'}`;
    $('professionals-tbody').innerHTML=filtered.length ? filtered.map(r=>`<tr><td><span class="professional-code">${esc(r.code)}</span></td><td><strong class="professional-name">${esc(r.name)}</strong></td><td>${esc(r.occupation_name||'—')}</td><td>${esc(r.professional_function_name||'—')}</td><td>${r.registration_number?`<span class="professional-registration">${esc(r.council?r.council+' · ':'')}${esc(r.registration_number)}</span>`:'—'}</td><td><span class="professional-status ${r.status}">${r.status==='active'?'Ativo':'Inativo'}</span></td><td><div class="professional-actions"><button class="professional-action" data-action="edit" data-id="${r.id}">Editar</button><button class="professional-action danger" data-action="status" data-id="${r.id}">${r.status==='active'?'Inativar':'Ativar'}</button></div></td></tr>`).join(''):'<tr><td colspan="7" class="professionals-empty">Nenhum profissional encontrado.</td></tr>';
  }

  async function load(){
    message('Carregando...');
    const {data,error}=await client().rpc('get_workspace_professionals'); if(error) throw error;
    rows=Array.isArray(data)?data:[]; render(); message('');
  }
  async function loadLookups(){
    const [o,f]=await Promise.all([client().rpc('get_workspace_occupations'),client().rpc('get_workspace_professional_functions')]);
    if(o.error) throw o.error; if(f.error) throw f.error;
    occupations=Array.isArray(o.data)?o.data.filter(x=>x.status==='active'):[]; functions=Array.isArray(f.data)?f.data.filter(x=>x.status==='active'):[];
    $('field-occupation').innerHTML='<option value="">Selecione...</option>'+occupations.map(x=>`<option value="${x.id}">${esc(x.name)}</option>`).join('');
    $('field-function').innerHTML='<option value="">Selecione...</option>'+functions.map(x=>`<option value="${x.id}">${esc(x.name)}</option>`).join('');
  }
  function openModal(row=null){
    editingId=row?.id||null; $('modal-title').textContent=editingId?'Editar profissional':'Novo profissional';
    $('field-code').value=row?.code||''; $('field-name').value=row?.name||''; $('field-occupation').value=row?.occupation_id||''; $('field-function').value=row?.professional_function_id||''; $('field-council').value=row?.council||''; $('field-registration').value=row?.registration_number||''; $('field-email').value=row?.email||''; $('field-phone').value=row?.phone||''; formMessage(''); $('professional-modal').hidden=false; setTimeout(()=>$('field-code').focus(),50);
  }
  function closeModal(){ $('professional-modal').hidden=true; editingId=null; $('professional-form').reset(); formMessage(''); }
  async function save(e){
    e.preventDefault(); formMessage(''); const button=$('save-btn'); button.disabled=true; button.textContent='Salvando...';
    const params={p_code:$('field-code').value.trim(),p_name:$('field-name').value.trim(),p_occupation_id:$('field-occupation').value||null,p_professional_function_id:$('field-function').value||null,p_council:$('field-council').value.trim()||null,p_registration_number:$('field-registration').value.trim()||null,p_email:$('field-email').value.trim()||null,p_phone:$('field-phone').value.trim()||null};
    try{ const {error}=await client().rpc(editingId?'update_workspace_professional':'create_workspace_professional',editingId?{p_id:editingId,...params}:params); if(error) throw error; closeModal(); await load(); message(`Profissional ${editingId?'atualizado':'criado'} com sucesso.`,'success'); }
    catch(err){console.error(err); formMessage(err.message||'Não foi possível salvar o profissional.','error');}
    finally{button.disabled=false;button.textContent='Salvar';}
  }
  async function changeStatus(id,status){ const row=rows.find(r=>r.id===id); if(!row)return; const next=status==='active'?'inactive':'active'; if(!confirm(`Deseja ${next==='inactive'?'inativar':'ativar'} ${row.name}?`))return; try{const {error}=await client().rpc('set_workspace_professional_status',{p_id:id,p_status:next});if(error)throw error;await load();message(`Profissional ${next==='active'?'ativado':'inativado'} com sucesso.`,'success');}catch(err){console.error(err);message(err.message||'Não foi possível alterar o status.','error');}}

  async function init(){
    try{
      const session=await window.LabMedSysAuth?.getSession?.(); if(!session?.user){location.replace('index.html');return;}
      const name=session.user.user_metadata?.full_name||session.user.email||'Administrador', initial=name.trim().charAt(0).toUpperCase()||'A'; $('workspace-user-name').textContent=name;$('dropdown-user-name').textContent=name;$('dropdown-user-email').textContent=session.user.email||'';document.querySelectorAll('.user-avatar').forEach(a=>a.textContent=initial);
      const menu=$('user-menu'),drop=$('user-dropdown');menu?.addEventListener('click',e=>{e.stopPropagation();const open=!drop.hidden;drop.hidden=open;menu.setAttribute('aria-expanded',String(!open));});document.addEventListener('click',()=>{if(drop&&!drop.hidden){drop.hidden=true;menu?.setAttribute('aria-expanded','false');}});drop?.addEventListener('click',e=>e.stopPropagation());$('sign-out-btn')?.addEventListener('click',async()=>{await window.LabMedSysAuth.signOut();location.replace('index.html');});
      $('professionals-search').addEventListener('input',render);$('professionals-filter').addEventListener('change',render);$('new-btn').addEventListener('click',()=>openModal());$('modal-close').addEventListener('click',closeModal);$('modal-cancel').addEventListener('click',closeModal);$('professional-modal').addEventListener('click',e=>{if(e.target===$('professional-modal'))closeModal();});$('professional-form').addEventListener('submit',save);$('professionals-tbody').addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b)return;const r=rows.find(x=>x.id===b.dataset.id);if(!r)return;b.dataset.action==='edit'?openModal(r):changeStatus(r.id,r.status);});
      await loadLookups(); await load();
    }catch(err){console.error(err);message(err.message||'Não foi possível carregar os profissionais.','error');$('professionals-tbody').innerHTML='<tr><td colspan="7" class="professionals-empty">Não foi possível carregar os dados. Verifique o acesso administrativo do Workspace.</td></tr>';}
  }
  document.addEventListener('DOMContentLoaded',init);
})();