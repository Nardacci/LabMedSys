const app = document.querySelector('#app');

async function checkSupabaseConnection() {
  try {
    const { error } = await window.LABMEDSYS_SUPABASE.auth.getSession();
    if (error) throw error;
    return { ok: true };
  } catch (error) {
    console.error('Supabase connection failed:', error);
    return { ok: false, error };
  }
}

function connectionBadge() {
  return '<div class="connection-status" id="connection-status"><span></span> Connecting secure foundation...</div>';
}

async function updateConnectionBadge() {
  const el = document.querySelector('#connection-status');
  if (!el) return;
  const result = await checkSupabaseConnection();
  if (result.ok) {
    el.innerHTML = '<span></span> Supabase connected.';
    el.classList.remove('connection-error');
    el.classList.add('connection-ok');
  } else {
    el.innerHTML = '<span></span> Connection unavailable.';
    el.classList.remove('connection-ok');
    el.classList.add('connection-error');
  }
}

function renderLogin() {
  app.innerHTML = `<main class="auth-page">
    <section class="auth-brand"><div class="brand-content">
      <div class="brand-mark">L</div>
      <div class="brand-label">PHARMACEUTICAL OPERATIONS PLATFORM</div>
      <div class="brand-name">Lab<span>Med</span>Sys</div>
      <div class="brand-message"><p>Build compliant operations.</p><p>Run better pharmaceutical processes.</p></div>
      <div class="brand-footer"><div class="brand-footer-icon">✓</div><div><strong>Built for secure workspaces</strong><span>Each company operates in its own protected environment.</span></div></div>
    </div></section>
    <section class="auth-panel"><div class="auth-card">
      <div class="eyebrow">WELCOME BACK</div><h1>Sign in</h1><p class="auth-subtitle">Access your company workspace.</p>
      <form id="login-form">
        <label>Email<input name="email" type="email" placeholder="you@company.com" required></label>
        <label>Password<input name="password" type="password" placeholder="Enter your password" required></label>
        <div id="form-message"></div><button type="submit">Sign in</button>${connectionBadge()}
      </form>
      <div class="auth-divider"></div><div class="auth-create"><span>New to LabMedSys?</span><a href="#signup">Create your workspace →</a></div>
      <div class="auth-version">LabMedSys · SaaS Foundation · Development</div>
    </div></section>
  </main>`;
  document.querySelector('#login-form').onsubmit = e => { e.preventDefault(); location.hash = 'welcome'; };
  updateConnectionBadge();
}

function renderSignup() {
  app.innerHTML = `<main class="auth-page">
    <section class="auth-brand"><div class="brand-content">
      <div class="brand-mark">L</div><div class="brand-label">PHARMACEUTICAL OPERATIONS PLATFORM</div>
      <div class="brand-name">Lab<span>Med</span>Sys</div>
      <div class="brand-message signup-message"><p>Your pharmaceutical workspace</p><p>starts here.</p></div>
      <div class="brand-footer"><div class="brand-footer-icon">✓</div><div><strong>Start with a secure foundation</strong><span>Your company receives an isolated workspace designed for controlled operations.</span></div></div>
    </div></section>
    <section class="auth-panel"><div class="auth-card auth-card-wide">
      <div class="eyebrow">CREATE YOUR WORKSPACE</div><h1>Start building better.</h1><p class="auth-subtitle">Create your company account and start your LabMedSys workspace.</p>
      <form id="signup-form">
        <div class="form-grid"><label>Full name<input name="fullName" type="text" placeholder="Your full name" required></label><label>Company name<input name="companyName" type="text" placeholder="Your company" required></label></div>
        <label>Work email<input name="email" type="email" placeholder="you@company.com" required></label>
        <div class="form-grid"><label>Password<input name="password" type="password" placeholder="Minimum 8 characters" minlength="8" required></label><label>Confirm password<input name="confirmPassword" type="password" placeholder="Repeat password" required></label></div>
        <label class="terms"><input type="checkbox" required><span>I agree to the Terms of Service and Privacy Policy.</span></label>
        <div id="form-message"></div><button type="submit">Create workspace →</button>${connectionBadge()}
      </form>
      <div class="auth-create auth-create-centered"><span>Already have an account?</span><a href="#login">Sign in</a></div>
      <div class="auth-version">LabMedSys · SaaS Foundation · Development</div>
    </div></section>
  </main>`;
  updateConnectionBadge();
  document.querySelector('#signup-form').onsubmit = e => {
    e.preventDefault();
    const f = e.currentTarget;
    if (f.password.value !== f.confirmPassword.value) {
      document.querySelector('#form-message').innerHTML = '<div class="form-message error">Passwords do not match.</div>';
      return;
    }
    sessionStorage.setItem('labmedsys_name', f.fullName.value.trim());
    sessionStorage.setItem('labmedsys_company', f.companyName.value.trim());
    location.hash = 'welcome';
  };
}

function renderWelcome() {
  const name = sessionStorage.getItem('labmedsys_name') || 'there';
  const company = sessionStorage.getItem('labmedsys_company') || 'your company';
  const firstName = name.split(' ')[0];
  app.innerHTML = `<main class="welcome-page"><section class="welcome-panel">
    <div class="welcome-logo"><div class="brand-mark">L</div><span>Lab<span>Med</span>Sys</span></div>
    <div class="welcome-content"><div class="welcome-check">✓</div><div class="eyebrow">WORKSPACE CREATED</div>
      <h1>Welcome, ${firstName}.</h1><p>Your workspace for <strong>${company}</strong> is ready to go.</p>
      <p class="welcome-description">You now have a secure foundation for building and managing your pharmaceutical operations.</p>
      <div class="welcome-workspace"><div class="workspace-avatar">${firstName[0]?.toUpperCase() || 'L'}</div><div><span>YOUR WORKSPACE</span><strong>${company}</strong></div></div>
      <button id="enter-workspace">Enter workspace →</button>
      <button id="welcome-logout" class="welcome-secondary">Back to Sign in</button>
    </div>
    <div class="auth-version">LabMedSys · SaaS Foundation · Development</div>
  </section></main>`;
  document.querySelector('#enter-workspace').onclick = () => alert('Package 1.1 complete. Workspace access will be connected in the next layer.');
  document.querySelector('#welcome-logout').onclick = () => { location.hash = 'login'; };
}

function route() {
  switch (location.hash) {
    case '#signup': return renderSignup();
    case '#welcome': return renderWelcome();
    case '#login':
    case '': return renderLogin();
    default: return renderLogin();
  }
}
window.addEventListener('hashchange', route);
route();