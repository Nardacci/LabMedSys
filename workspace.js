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
      const fullName = metadata.full_name || session.user.email || 'Administrador';
      const initial = fullName.trim().charAt(0).toUpperCase() || 'A';

      document.getElementById('workspace-user-name').textContent = fullName;
      document.getElementById('dropdown-user-name').textContent = fullName;
      document.getElementById('dropdown-user-email').textContent = session.user.email || '';
      document.querySelectorAll('.user-avatar').forEach((avatar) => avatar.textContent = initial);

      // Load the workspace configuration created in Workspace Setup.
      // The RPC keeps the workspace boundary enforced on the database side.
      const supabase = window.LabMedSysAuth?.getSupabaseClient?.();
      if (supabase) {
        const { data: setup, error } = await supabase.rpc('get_current_workspace_setup');
        if (error) throw error;

        const row = Array.isArray(setup) ? setup[0] : setup;
        const workspaceName = row?.workspace_name?.trim();
        const title = document.getElementById('workspace-welcome-title');
        if (title && workspaceName) {
          title.textContent = `Bem-vindo ao ${workspaceName}.`;
        }
      }
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
        button.innerHTML = '<span>↪</span> Saindo...';
        await window.LabMedSysAuth.signOut();
        window.location.replace('index.html');
      } catch (error) {
        console.error('Sign out failed:', error);
        button.disabled = false;
        button.innerHTML = '<span>↪</span> Sair';
      }
    });

    document.querySelectorAll('[data-module]').forEach((card) => {
      card.addEventListener('click', (event) => {
        if (card.tagName === 'A' && card.getAttribute('href')) return;

        const moduleName = card.querySelector('h3')?.textContent || 'Módulo';
        window.alert(moduleName + ' será a próxima etapa de implementação.');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => init());
})();