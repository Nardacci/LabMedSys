import './style.css';

document.querySelector('#app').innerHTML = `
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
          <label>
            Email
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@company.com"
              autocomplete="email"
            />
          </label>

          <label>
            Password
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              autocomplete="current-password"
            />
          </label>

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
  // Authentication will be connected in the next package layer.
});
