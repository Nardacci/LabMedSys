(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const client = () => window.LabMedSysAuth.getSupabaseClient();

  function message(text = '', type = '') {
    const el = $('activate-message');
    if (!el) return;
    el.textContent = text;
    el.className = `invite-message ${type}`.trim();
  }

  async function init() {
    try {
      const session = await window.LabMedSysAuth?.getSession?.();
      if (!session?.user) {
        message('O convite precisa ser aberto pelo link recebido por e-mail.', 'error');
        $('activate-btn').disabled = true;
      }
    } catch (error) {
      console.error(error);
      message('Não foi possível validar o convite.', 'error');
      $('activate-btn').disabled = true;
    }
  }

  $('activate-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    message('');
    const password = $('password').value;
    const confirmation = $('password-confirm').value;
    if (password.length < 8) {
      message('A senha deve ter pelo menos 8 caracteres.', 'error');
      return;
    }
    if (password !== confirmation) {
      message('As senhas não coincidem.', 'error');
      return;
    }
    const button = $('activate-btn');
    button.disabled = true;
    button.textContent = 'Ativando...';
    try {
      const { error: passwordError } = await client().auth.updateUser({ password });
      if (passwordError) throw passwordError;
      const { error: activationError } = await client().rpc('activate_invited_workspace_member');
      if (activationError) throw activationError;
      message('Conta ativada. Redirecionando...', 'success');
      setTimeout(() => location.replace('workspace.html'), 500);
    } catch (error) {
      console.error(error);
      message(error.message || 'Não foi possível ativar a conta.', 'error');
      button.disabled = false;
      button.textContent = 'Ativar conta';
    }
  });

  document.addEventListener('DOMContentLoaded', init);
})();
