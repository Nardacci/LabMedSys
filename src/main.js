import './style.css';

const app = document.querySelector('#app');

function renderLogin() {
  app.innerHTML = `
    <main class="auth-page">
      <section class="auth-brand">
        <div class="brand-content">
          <div class="brand-mark">L</div>
          <div class="brand-label">PHARMACEUTICAL OPERATIONS PLATFORM</div>
          <div class="brand-name">Lab<span>Med</span>Sys</div>
          <div class="brand-message">
            <p>Build compliant operations.</p>
            <p>Run better pharmaceutical processes.</p>
          </div>
          <div class="brand-footer">
            <div class="brand-footer-icon">✓</div>
            <div>
              <strong>Built for secure workspaces</strong>
              <span>Each company operates in its own protected environment.</span>
            </div>
          </div>
        </div>
      </section>

      <section class="auth-panel">
        <div class="auth-card">
          <div class="eyebrow">WELCOME BACK</div>
          <h1>Sign in</h1>
          <p class="auth-subtitle">Access your company workspace.</p>

          <form id="login-form" novalidate>
            <label>Email<input name="email" type="email" placeholder="you@company.com"></label>
            <label>Password<input name="password" type="password" placeholder="Enter your password"></label>
            <button type="submit">Sign in</button>
          </form>

          <div class="auth-divider"></div>

          <div class="auth-create">
            <span>New to LabMedSys?</span>
            <a href="#signup">Create your workspace →</a>
          </div>

          <div class="auth-version">LabMedSys · SaaS Foundation · Development</div>
        </div>
      </section>
    </main>
  `;

  document.querySelector('#login-form').addEventListener('submit', (event) => {
    event.preventDefault();
    location.hash = 'dashboard';
  });
}

function renderSignup() {
  app.innerHTML = `
    <main class="auth-page">
      <section class="auth-brand">
        <div class="brand-content">
          <div class="brand-mark">L</div>
          <div class="brand-label">PHARMACEUTICAL OPERATIONS PLATFORM</div>
          <div class="brand-name">Lab<span>Med</span>Sys</div>

          <div class="brand-message signup-message">
            <p>Your pharmaceutical workspace</p>
            <p>starts here.</p>
          </div>

          <div class="brand-footer">
            <div class="brand-footer-icon">✓</div>
            <div>
              <strong>Start with a secure foundation</strong>
              <span>Your company receives an isolated workspace designed for controlled operations.</span>
            </div>
          </div>
        </div>
      </section>

      <section class="auth-panel">
        <div class="auth-card auth-card-wide">
          <div class="eyebrow">CREATE YOUR WORKSPACE</div>
          <h1>Start building better.</h1>
          <p class="auth-subtitle">Create your company account and start your LabMedSys workspace.</p>

          <form id="signup-form" novalidate>
            <div class="form-grid">
              <label>Full name<input name="fullName" type="text" placeholder="Your full name"></label>
              <label>Company name<input name="companyName" type="text" placeholder="Your company"></label>
            </div>

            <label>Work email<input name="email" type="email" placeholder="you@company.com"></label>

            <div class="form-grid">
              <label>Password<input name="password" type="password" placeholder="Minimum 8 characters"></label>
              <label>Confirm password<input name="confirmPassword" type="password" placeholder="Repeat password"></label>
            </div>

            <label class="terms">
              <input type="checkbox" name="terms">
              <span>I agree to the Terms of Service and Privacy Policy.</span>
            </label>

            <button type="submit">Create workspace →</button>
          </form>

          <div class="auth-create auth-create-centered">
            <span>Already have an account?</span>
            <a href="#login">Sign in</a>
          </div>

          <div class="auth-version">LabMedSys · SaaS Foundation · Development</div>
        </div>
      </section>
    </main>
  `;

  document.querySelector('#signup-form').addEventListener('submit', (event) => {
    event.preventDefault();
    location.hash = 'dashboard';
  });
}

function renderDashboard() {
  app.innerHTML = `<div class="app-shell"><aside class="sidebar"><div class="sidebar-logo"><div class="sidebar-mark">L</div><div>Lab<span>Med</span>Sys</div></div><div class="workspace-switcher"><div class="workspace-avatar">A</div><div><strong>Acme Pharma</strong><span>Workspace</span></div><span class="workspace-more">⌄</span></div><nav class="sidebar-nav"><a class="nav-item active" href="#dashboard"><span>⌘</span>Overview</a><div class="nav-label">WORKSPACE</div><a class="nav-item" href="#dashboard"><span>▦</span>Company</a><a class="nav-item" href="#dashboard"><span>◉</span>Users</a><a class="nav-item" href="#dashboard"><span>◇</span>Access & Roles</a><div class="nav-label">SYSTEM</div><a class="nav-item" href="#dashboard"><span>⚙</span>Settings</a></nav><div class="sidebar-bottom"><div class="user-mini"><div class="user-avatar">A</div><div><strong>Administrator</strong><span>Company Admin</span></div><button id="logout" title="Sign out">↗</button></div></div></aside><main class="dashboard-main"><header class="topbar"><div><div class="page-eyebrow">WORKSPACE</div><h1>Overview</h1></div><div class="topbar-actions"><button class="icon-button">⌕</button><button class="icon-button notification">◌<i></i></button></div></header><section class="dashboard-content"><div class="welcome-card"><div><span class="eyebrow">WELCOME TO LABMEDSYS</span><h2>Your workspace is ready.</h2><p>This is the starting point for your pharmaceutical operations platform. Build your foundation one module at a time.</p></div><div class="welcome-symbol">L</div></div><div class="section-heading"><div><span class="eyebrow">GET STARTED</span><h2>Set up your workspace</h2></div></div><div class="setup-grid"><article class="setup-card"><div class="setup-icon">▦</div><h3>Company profile</h3><p>Configure the essential information for your organization.</p><span>Coming soon</span></article><article class="setup-card"><div class="setup-icon">◉</div><h3>Invite your team</h3><p>Add the people who will operate inside your workspace.</p><span>Coming soon</span></article><article class="setup-card"><div class="setup-icon">◇</div><h3>Access control</h3><p>Define roles and permissions for secure operations.</p><span>Coming soon</span></article></div><div class="empty-state"><div class="empty-icon">□</div><h3>Your operational modules will appear here.</h3><p>We are building the foundation first. The pharmaceutical modules come next.</p></div></section></main></div>`;
  document.querySelector('#logout').addEventListener('click', () => { location.hash = 'login'; });
}

function route() {
  if (location.hash === '#signup') renderSignup();
  else renderLogin();
}

window.addEventListener('hashchange', route);
route();
