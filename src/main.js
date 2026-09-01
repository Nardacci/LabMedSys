import './style.css';
import { supabase } from './supabase.js';

const app = document.querySelector('#app');
const slugify = v => v.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'').slice(0,50);
const msg = (el,text,type='error') => el.innerHTML = text ? `<div class="form-message ${type}">${text}</div>` : '';

async function ensureWorkspace(user) {
  let { data: member, error } = await supabase.from('workspace_members').select('workspace_id, workspaces(id,name)').eq('user_id',user.id).eq('status','active').limit(1).maybeSingle();
  if (error) throw error;
  if (member) return member;
  const m=user.user_metadata||{};
  if (!m.company_name || !m.workspace_slug) return null;
  const { error: rpcError } = await supabase.rpc('create_workspace',{p_name:m.company_name,p_slug:m.workspace_slug});
  if (rpcError && !/duplicate|unique/i.test(rpcError.message)) throw rpcError;
  ({data:member,error}=await supabase.from('workspace_members').select('workspace_id, workspaces(id,name)').eq('user_id',user.id).eq('status','active').limit(1).maybeSingle());
  if(error) throw error;
  return member;
}

function renderLogin(){
app.innerHTML=`<main class="auth-page"><section class="auth-brand"><div class="brand-content"><div class="brand-mark">L</div><div class="brand-label">PHARMACEUTICAL OPERATIONS PLATFORM</div><div class="brand-name">Lab<span>Med</span>Sys</div><div class="brand-message"><p>Build compliant operations.</p><p>Run better pharmaceutical processes.</p></div><div class="brand-footer"><div class="brand-footer-icon">✓</div><div><strong>Built for secure workspaces</strong><span>Each company operates in its own protected environment.</span></div></div></div></section><section class="auth-panel"><div class="auth-card"><div class="eyebrow">WELCOME BACK</div><h1>Sign in</h1><p class="auth-subtitle">Access your company workspace.</p><form id="login-form"><label>Email<input name="email" type="email" placeholder="you@company.com" required></label><label>Password<input name="password" type="password" placeholder="Enter your password" required></label><div id="form-message"></div><button id="login-button" type="submit">Sign in</button></form><div class="auth-divider"></div><div class="auth-create"><span>New to LabMedSys?</span><a href="#signup">Create your workspace →</a></div><div class="auth-version">LabMedSys · SaaS Foundation · Development</div></div></section></main>`;
document.querySelector('#login-form').onsubmit=async e=>{e.preventDefault();const form=e.currentTarget, m=document.querySelector('#form-message'), b=document.querySelector('#login-button');msg(m,'');b.disabled=true;b.textContent='Signing in...';try{const {data,error}=await supabase.auth.signInWithPassword({email:form.email.value.trim(),password:form.password.value});if(error)throw error;await ensureWorkspace(data.user);location.hash='dashboard'}catch(err){msg(m,err.message||'Unable to sign in.')}finally{b.disabled=false;b.textContent='Sign in'}};
}

function renderSignup(){
app.innerHTML=`<main class="auth-page"><section class="auth-brand"><div class="brand-content"><div class="brand-mark">L</div><div class="brand-label">PHARMACEUTICAL OPERATIONS PLATFORM</div><div class="brand-name">Lab<span>Med</span>Sys</div><div class="brand-message signup-message"><p>Your pharmaceutical workspace</p><p>starts here.</p></div><div class="brand-footer"><div class="brand-footer-icon">✓</div><div><strong>Start with a secure foundation</strong><span>Your company receives an isolated workspace designed for controlled operations.</span></div></div></div></section><section class="auth-panel"><div class="auth-card auth-card-wide"><div class="eyebrow">CREATE YOUR WORKSPACE</div><h1>Start building better.</h1><p class="auth-subtitle">Create your company account and start your LabMedSys workspace.</p><form id="signup-form"><div class="form-grid"><label>Full name<input name="fullName" type="text" placeholder="Your full name" required></label><label>Company name<input name="companyName" type="text" placeholder="Your company" required></label></div><label>Work email<input name="email" type="email" placeholder="you@company.com" required></label><div class="form-grid"><label>Password<input name="password" type="password" placeholder="Minimum 8 characters" minlength="8" required></label><label>Confirm password<input name="confirmPassword" type="password" placeholder="Repeat password" required></label></div><label class="terms"><input type="checkbox" name="terms" required><span>I agree to the Terms of Service and Privacy Policy.</span></label><div id="form-message"></div><button id="signup-button" type="submit">Create workspace →</button></form><div class="auth-create auth-create-centered"><span>Already have an account?</span><a href="#login">Sign in</a></div><div class="auth-version">LabMedSys · SaaS Foundation · Development</div></div></section></main>`;
document.querySelector('#signup-form').onsubmit=async e=>{e.preventDefault();const f=e.currentTarget,m=document.querySelector('#form-message'),b=document.querySelector('#signup-button'),full_name=f.fullName.value.trim(),company_name=f.companyName.value.trim(),workspace_slug=slugify(company_name);msg(m,'');if(f.password.value!==f.confirmPassword.value)return msg(m,'Passwords do not match.');b.disabled=true;b.textContent='Creating...';try{const {data,error}=await supabase.auth.signUp({email:f.email.value.trim(),password:f.password.value,options:{data:{full_name,company_name,workspace_slug}}});if(error)throw error;if(data.session){await ensureWorkspace(data.user);location.hash='dashboard'}else{msg(m,'Account created. Check your email to confirm your account, then sign in.','success');f.reset()}}catch(err){msg(m,err.message||'Unable to create your workspace.')}finally{b.disabled=false;b.textContent='Create workspace →'}};
}

function renderDashboard(user,workspace){
const name=user.user_metadata?.full_name||user.email, company=workspace?.workspaces?.name||user.user_metadata?.company_name||'My Workspace', initial=name[0].toUpperCase();
app.innerHTML=`<div class="app-shell"><aside class="sidebar"><div class="sidebar-logo"><div class="sidebar-mark">L</div><div>Lab<span>Med</span>Sys</div></div><div class="workspace-switcher"><div class="workspace-avatar">${initial}</div><div><strong>${company}</strong><span>Workspace</span></div><span class="workspace-more">⌄</span></div><nav class="sidebar-nav"><a class="nav-item active" href="#dashboard"><span>⌘</span>Overview</a><div class="nav-label">WORKSPACE</div><a class="nav-item" href="#dashboard"><span>▦</span>Company</a><a class="nav-item" href="#dashboard"><span>◉</span>Users</a><a class="nav-item" href="#dashboard"><span>◇</span>Access & Roles</a><div class="nav-label">SYSTEM</div><a class="nav-item" href="#dashboard"><span>⚙</span>Settings</a></nav><div class="sidebar-bottom"><div class="user-mini"><div class="user-avatar">${initial}</div><div><strong>${name}</strong><span>Workspace Owner</span></div><button id="logout" title="Sign out">↗</button></div></div></aside><main class="dashboard-main"><header class="topbar"><div><div class="page-eyebrow">WORKSPACE</div><h1>Overview</h1></div></header><section class="dashboard-content"><div class="welcome-card"><div><span class="eyebrow">WELCOME TO LABMEDSYS</span><h2>Your workspace is ready.</h2><p>This is the starting point for your pharmaceutical operations platform. Build your foundation one module at a time.</p></div><div class="welcome-symbol">L</div></div><div class="section-heading"><span class="eyebrow">GET STARTED</span><h2>Set up your workspace</h2></div><div class="setup-grid"><article class="setup-card"><div class="setup-icon">▦</div><h3>Company profile</h3><p>Configure your organization.</p><span>Coming soon</span></article><article class="setup-card"><div class="setup-icon">◉</div><h3>Invite your team</h3><p>Add workspace users.</p><span>Coming soon</span></article><article class="setup-card"><div class="setup-icon">◇</div><h3>Access control</h3><p>Define secure roles.</p><span>Coming soon</span></article></div></section></main></div>`;
document.querySelector('#logout').onclick=async()=>{await supabase.auth.signOut();location.hash='login'};
}

async function route(){
if(location.hash==='#signup')return renderSignup();
const {data:{session}}=await supabase.auth.getSession();
if(location.hash==='#dashboard'){if(!session){location.hash='login';return}try{const workspace=await ensureWorkspace(session.user);return renderDashboard(session.user,workspace)}catch(e){console.error(e);location.hash='login';return}}
if(session){location.hash='dashboard';return}renderLogin();
}
window.addEventListener('hashchange',route);
route();
