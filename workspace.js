(() => {
  'use strict';

  async function init() {
    try {
      const session = await window.LabMedSysAuth?.getSession?.();
      if (!session?.user) {
        window.location.replace('index.html');
        return;
      }

      const metadata = session.user.user_metadata || {};
      const fullName = metadata.full_name || session.user.email || 'Workspace Admin';
      const initial = fullName.trim().charAt(0).toUpperCase() || 'A';

      document.getElementById('workspace-user-name').textContent = fullName;
      document.getElementById('dropdown-user-name').textContent = fullName;
      document.getElementById('dropdown-user-email').textContent = session.user.email || '';
      document.querySelectorAll('.user-avatar').forEach((avatar) => avatar.textContent = initial);
    } catch (error) {
      console.error('Unable to initialize workspace:', error);
    }

    const menu = document.getElementById('user-menu');
    const dropdown = document.getElementById('user-dropdown');

    menu?.addEventListener('click', (event) => {
      event.stopPropagation();
      const isOpen = !dropdown.hidden;
      dropdown.hidden = isOpen;
      menu.setAttribute('aria-expanded', String(!isOpen));
    });

    document.addEventListener('click', () => {
      if (dropdown && !dropdown.hidden) {
        dropdown.hidden = true;
        menu?.setAttribute('aria-expanded', 'false');
      }
    });

    dropdown?.addEventListener('click', (event) => event.stopPropagation());

    document.getElementById('sign-out-btn')?.addEventListener('click', async () => {
      const button = document.getElementById('sign-out-btn');
      try {
        button.disabled = true;
        button.innerHTML = '<span>↪</span> Signing out...';
        await window.LabMedSysAuth.signOut();
        window.location.replace('index.html');
      } catch (error) {
        console.error('Sign out failed:', error);
        button.disabled = false;
        button.innerHTML = '<span>↪</span> Sign out';
      }
    });

    document.querySelectorAll('[data-module]').forEach((card) => {
      card.addEventListener('click', (event) => {
        // Implemented module cards are real links and must keep their normal navigation.
        if (card.tagName === 'A' && card.getAttribute('href')) return;

        const moduleName = card.querySelector('h3')?.textContent || 'Module';
        window.alert(moduleName + ' is the next implementation step.');
      });
    });

    document.getElementById('workspace-settings')?.addEventListener('click', () => {
      window.alert('Workspace settings will manage users, modules and platform configuration.');
    });
  }

  document.addEventListener('DOMContentLoaded', () => { init(); const current = window.location.pathname.split('/').pop() || 'workspace.html'; document.querySelectorAll('.workspace-nav-link').forEach((link) => { if (link.getAttribute('href') === current) link.classList.add('active'); else link.classList.remove('active'); }); });
})();