(() => {
  'use strict';
  const form = document.getElementById('login-form');
  const message = document.getElementById('login-message');
  const submitButton = document.getElementById('login-submit');

  function setMessage(text, type = '') {
    if (!message) return;
    message.textContent = text || '';
    message.className = 'message' + (type ? ' ' + type : '');
  }

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    setMessage('');

    if (!window.LabMedSysAuth?.signIn) {
      setMessage('Authentication service is unavailable. Please refresh and try again.', 'error');
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Signing in...';

    try {
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      await window.LabMedSysAuth.signIn({ email, password });
      window.location.href = 'workspace.html';
    } catch (error) {
      console.error('LabMedSys sign in failed:', error);
      setMessage(error?.message || 'Unable to sign in. Please try again.', 'error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Sign in';
    }
  });
})();