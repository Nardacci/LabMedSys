import './style.css';
import { createClient } from '@supabase/supabase-js';

const app = document.querySelector('#app');
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

const shell = (title, content) => `
  <main>
    <section class="brand">
      <div>
        <span class="eyebrow">LABMEDSYS</span>
        <h1>Pharmaceutical operations, connected.</h1>
        <p>A secure workspace for the next generation of pharmaceutical industry.</p>
      </div>
    </section>
    <section class="panel">
      <div class="card">
        <div class="eyebrow">LABMEDSYS</div>
        <h2>${title}</h2>
        ${content}
      </div>
    </section>
  </main>`;

const configMessage = () => !supabase
  ? '<small id="msg">Application configuration is incomplete. Configure the Supabase environment variables.</small>'
  : '<small id="msg"></small>';

function login() {
  app.innerHTML = shell('Welcome back', `
    <p>Access your workspace.</p>
    <form id="login">
      <label>Email<input name="email" type="email" required></label>
      <label>Password<input name="password" type="password" required></label>
      <button>Sign in</button>
    </form>
    <div class="divider"></div>
    <p>New to LabMedSys? <a href="#signup">Create your workspace →</a></p>
    ${configMessage()}
  `);

  document.querySelector('#login').onsubmit = async (e) => {
    e.preventDefault();
    const msg = document.querySelector('#msg');
    if (!supabase) {
      msg.textContent = 'Application configuration is incomplete. Configure the Supabase environment variables.';
      return;
    }
    const f = new FormData(e.target);
    const { error } = await supabase.auth.signInWithPassword({
      email: f.get('email'),
      password: f.get('password')
    });
    msg.textContent = error?.message || '';
    if (!error) route();
  };
}

function signup() {
  app.innerHTML = shell('Create your workspace', `
    <p>Start with your company and administrator account.</p>
    <form id="signup">
      <label>Full name<input name="name" required></label>
      <label>Company name<input name="company" required></label>
      <label>Work email<input name="email" type="email" required></label>
      <label>Password<input name="password" type="password" minlength="6" required></label>
      <button>Create workspace</button>
    </form>
    <p><a href="#login">← Back to sign in</a></p>
    ${configMessage()}
  `);

  document.querySelector('#signup').onsubmit = async (e) => {
    e.preventDefault();
    const msg = document.querySelector('#msg');
    if (!supabase) {
      msg.textContent = 'Application configuration is incomplete. Configure the Supabase environment variables.';
      return;
    }
    const f = new FormData(e.target);
    const { data, error } = await supabase.auth.signUp({
      email: f.get('email'),
      password: f.get('password'),
      options: {
        data: {
          full_name: f.get('name'),
          company_name: f.get('company')
        }
      }
    });
    if (error) {
      msg.textContent = error.message;
      return;
    }
    msg.textContent = data.user
      ? 'Workspace created. Confirm your email if required.'
      : 'Unable to create workspace.';
  };
}

async function dashboard() {
  if (!supabase) {
    login();
    return;
  }
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    login();
    return;
  }

  app.innerHTML = `
    <div class="dashboard">
      <header>
        <b>LABMEDSYS</b>
        <span>Workspace</span>
        <button id="out">Sign out</button>
      </header>
      <div class="empty">
        <span class="eyebrow">DASHBOARD</span>
        <h1>Your workspace is ready.</h1>
        <p>Package 01 — SaaS Foundation</p>
      </div>
    </div>`;

  document.querySelector('#out').onclick = async () => {
    await supabase.auth.signOut();
    location.hash = 'login';
  };
}

async function route() {
  if (location.hash === '#signup') signup();
  else await dashboard();
}

window.addEventListener('hashchange', route);
route();
