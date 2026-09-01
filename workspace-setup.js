(() => {
  'use strict';

  const steps = [
    { name: 'Welcome', kicker: 'WORKSPACE SETUP' },
    { name: 'Workspace', kicker: 'STEP 2 · WORKSPACE' },
    { name: 'Company', kicker: 'STEP 3 · COMPANY' },
    { name: 'Location & Preferences', kicker: 'STEP 4 · LOCATION & PREFERENCES' },
    { name: 'Review', kicker: 'STEP 5 · REVIEW' },
    { name: 'Ready', kicker: 'STEP 6 · READY' }
  ];
  let current = 0;
  let sessionUser = null;
  let workspaceId = null;

  const data = {
    workspaceName: '', companyLegalName: '', companyTradeName: '',
    country: 'Brazil', timezone: 'America/Sao_Paulo', locale: 'pt-BR',
    dateFormat: 'DD/MM/YYYY', timeFormat: '24h'
  };

  const $ = (id) => document.getElementById(id);
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>'\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

  function setMessage(text, type = '') {
    const el = $('setup-message');
    if (!el) return;
    el.textContent = text || '';
    el.className = 'setup-message' + (type ? ' ' + type : '');
  }

  function input(id, label, value, placeholder, hint = '') {
    return `<div class="setup-field"><label for="${id}">${label}</label><input id="${id}" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}" required>${hint ? `<small>${hint}</small>` : ''}</div>`;
  }

  function render() {
    const step = steps[current];
    $('setup-step-label').textContent = `Step ${current + 1} of ${steps.length}`;
    $('setup-step-name').textContent = step.name;
    $('setup-progress-bar').style.width = `${((current + 1) / steps.length) * 100}%`;
    $('step-kicker').textContent = step.kicker;
    $('back-btn').style.visibility = current === 0 ? 'hidden' : 'visible';
    $('next-btn').textContent = current === steps.length - 1 ? 'Enter Workspace →' : 'Continue →';
    setMessage('');

    let html = '';
    if (current === 0) html = `<div class="setup-welcome-icon">L</div><h1>Let’s set up your workspace.</h1><p class="lead">Before you enter LabMedSys, we need a few essentials to create your secure pharmaceutical environment.</p><div class="setup-points"><div class="setup-point"><b>01</b><div><b>Workspace identity</b><br><span>Define the environment your team will work in.</span></div></div><div class="setup-point"><b>02</b><div><b>Company foundation</b><br><span>Tell us the minimum legal identity needed to start.</span></div></div><div class="setup-point"><b>03</b><div><b>Preferences</b><br><span>Set language, timezone and regional formats.</span></div></div></div>`;
    if (current === 1) html = `<h2>Name your workspace.</h2><p class="lead">This is the SaaS environment that will contain your users, companies, configuration and modules.</p><div class="setup-form">${input('workspace-name','Workspace name',data.workspaceName,'e.g. Nardacci Pharma','Choose a clear name for this working environment.')}</div>`;
    if (current === 2) html = `<h2>Tell us about the company.</h2><p class="lead">Only the minimum information is collected here. The complete company master data will live later in Central de Governança.</p><div class="setup-form">${input('company-legal-name','Legal name',data.companyLegalName,'e.g. Nardacci Indústria Farmacêutica Ltda.','Required to establish the workspace foundation.')}${input('company-trade-name','Trade name',data.companyTradeName,'e.g. Nardacci Pharma','Optional.')}</div>`;
    if (current === 3) html = `<h2>Set your regional preferences.</h2><p class="lead">These defaults can be refined later. They establish how LabMedSys presents dates, times and language in this workspace.</p><div class="setup-form"><div class="setup-grid-2"><div class="setup-field"><label for="country">Country</label><select id="country"><option value="Brazil">Brazil</option><option value="Germany">Germany</option><option value="Italy">Italy</option><option value="United States">United States</option><option value="Portugal">Portugal</option></select></div><div class="setup-field"><label for="locale">Language</label><select id="locale"><option value="pt-BR">Português (Brasil)</option><option value="en-US">English (US)</option><option value="de-DE">Deutsch</option><option value="it-IT">Italiano</option></select></div></div><div class="setup-grid-2"><div class="setup-field"><label for="timezone">Timezone</label><select id="timezone"><option value="America/Sao_Paulo">São Paulo (UTC−03:00)</option><option value="Europe/Berlin">Berlin (UTC+01:00/+02:00)</option><option value="Europe/Rome">Rome (UTC+01:00/+02:00)</option><option value="America/New_York">New York (UTC−05:00/−04:00)</option></select></div><div class="setup-field"><label for="time-format">Time format</label><select id="time-format"><option value="24h">24-hour</option><option value="12h">12-hour</option></select></div></div><div class="setup-field"><label for="date-format">Date format</label><select id="date-format"><option value="DD/MM/YYYY">DD/MM/YYYY</option><option value="MM/DD/YYYY">MM/DD/YYYY</option><option value="YYYY-MM-DD">YYYY-MM-DD</option></select></div></div>`;
    if (current === 4) html = `<h2>Review your setup.</h2><p class="lead">Everything below will be used to create the workspace. You can refine configuration later.</p><div class="setup-review"><div class="review-row"><strong>Workspace</strong><span>${escapeHtml(data.workspaceName)}</span></div><div class="review-row"><strong>Legal name</strong><span>${escapeHtml(data.companyLegalName)}</span></div><div class="review-row"><strong>Trade name</strong><span>${escapeHtml(data.companyTradeName || '—')}</span></div><div class="review-row"><strong>Country</strong><span>${escapeHtml(data.country)}</span></div><div class="review-row"><strong>Language</strong><span>${escapeHtml(data.locale)}</span></div><div class="review-row"><strong>Timezone</strong><span>${escapeHtml(data.timezone)}</span></div><div class="review-row"><strong>Formats</strong><span>${escapeHtml(data.dateFormat)} · ${escapeHtml(data.timeFormat)}</span></div></div>`;
    if (current === 5) html = `<div class="setup-ready"><div class="ready-badge">✓ Workspace created successfully</div><div class="setup-welcome-icon">✓</div><h2>You’re ready to go.</h2><p class="lead">Your LabMedSys workspace is now configured. From here, you can manage the environment and start working with the platform modules.</p></div>`;
    $('step-content').innerHTML = html;
    hydrateStep();
  }

  function hydrateStep() {
    const bindings = {'workspace-name':'workspaceName','company-legal-name':'companyLegalName','company-trade-name':'companyTradeName','country':'country','timezone':'timezone','locale':'locale','date-format':'dateFormat','time-format':'timeFormat'};
    Object.entries(bindings).forEach(([id,key]) => { const el=$(id); if(el){el.value=data[key]; el.addEventListener('input',()=>data[key]=el.value); el.addEventListener('change',()=>data[key]=el.value);} });
  }

  function validateStep() {
    if (current === 1 && !data.workspaceName.trim()) return 'Enter a workspace name to continue.';
    if (current === 2 && !data.companyLegalName.trim()) return 'Enter the company legal name to continue.';
    return '';
  }

  function getClient() {
    if (!window.LabMedSysAuth?.getSupabaseClient) throw new Error('Authentication service is unavailable. Please refresh and try again.');
    return window.LabMedSysAuth.getSupabaseClient();
  }

  async function checkExistingWorkspace() {
    const client = getClient();
    if (!sessionUser) return false;
    const {data:members,error}=await client.from('workspace_members').select('workspace_id,status,workspaces!inner(id,status)').eq('user_id',sessionUser.id).eq('status','active').limit(1);
    if(error) throw error;
    const existing=members?.find(m=>m.workspaces?.status==='active');
    if(existing){workspaceId=existing.workspace_id;return true;}
    return false;
  }

  async function createWorkspace() {
    const client = getClient();
    const {data:createdId,error}=await client.rpc('create_workspace_setup',{p_workspace_name:data.workspaceName.trim(),p_company_legal_name:data.companyLegalName.trim(),p_company_trade_name:data.companyTradeName.trim(),p_country:data.country,p_timezone:data.timezone,p_locale:data.locale,p_date_format:data.dateFormat,p_time_format:data.timeFormat});
    if(error)throw error;
    workspaceId=createdId;
  }

  async function next() {
    setMessage('');
    const error=validateStep();
    if(error){setMessage(error);return;}
    if(current<steps.length-2){current+=1;render();return;}
    if(current===steps.length-2){
      const button=$('next-btn'); button.disabled=true; button.textContent='Creating workspace...';
      try{await createWorkspace();current+=1;render();}catch(err){console.error(err);setMessage(err?.message||'Unable to create the workspace. Please try again.');}finally{button.disabled=false;}
      return;
    }
    window.location.replace('workspace.html');
  }

  function back(){if(current>0){current-=1;render();}}

  function initUserMenu(){
    const menu=$('setup-user-menu'), dropdown=$('setup-user-dropdown');
    menu?.addEventListener('click',event=>{event.stopPropagation();const isOpen=!dropdown.hidden;dropdown.hidden=isOpen;menu.setAttribute('aria-expanded',String(!isOpen));});
    document.addEventListener('click',()=>{if(dropdown&&!dropdown.hidden){dropdown.hidden=true;menu?.setAttribute('aria-expanded','false');}});
    dropdown?.addEventListener('click',event=>event.stopPropagation());
    $('setup-sign-out-btn')?.addEventListener('click',async()=>{const button=$('setup-sign-out-btn');try{button.disabled=true;button.innerHTML='<span>↪</span> Signing out...';await window.LabMedSysAuth.signOut();window.location.replace('index.html');}catch(error){console.error('Sign out failed:',error);button.disabled=false;button.innerHTML='<span>↪</span> Sign out';}});
  }

  async function init(){
    try{
      const session=await window.LabMedSysAuth?.getSession?.();
      if(!session?.user){window.location.replace('index.html');return;}
      sessionUser=session.user;
      const name=session.user.user_metadata?.full_name||session.user.email||'Workspace Admin';
      const initial=name.trim().charAt(0).toUpperCase()||'A';
      $('setup-user-name').textContent=name;
      $('setup-dropdown-name').textContent=name;
      $('setup-user-email').textContent=session.user.email||'';
      $('setup-user-avatar').textContent=initial;
      $('setup-dropdown-avatar').textContent=initial;
      initUserMenu();
      if(await checkExistingWorkspace()){window.location.replace('workspace.html');return;}
      render();
    }catch(error){console.error('Workspace setup initialization failed:',error);setMessage(error?.message||'Unable to load workspace setup. Please refresh and try again.');}
  }

  $('next-btn').addEventListener('click',next);
  $('back-btn').addEventListener('click',back);
  document.addEventListener('DOMContentLoaded',init);
})();