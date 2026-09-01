(() => {
  'use strict';

  function init() {
    const form = document.getElementById('signup-form');
    const message = document.getElementById('signup-message');
    const submitButton = document.getElementById('signup-submit');

    if (!form || !message || !submitButton) {
      console.error('LabMedSys signup: required form elements were not found.');
      return;
    }

    function showMessage(text, type = 'error') {
      message.textContent = text;
      message.className = 'message' + (type === 'success' ? ' success' : '');
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      event.stopPropagation();
      showMessage('');

      const fullName = document.getElementById('full-name').value.trim();
      const companyName = document.getElementById('company-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      const acceptedTerms = document.getElementById('accept-terms').checked;

      if (!fullName || !companyName || !email || !password || !confirmPassword) {
        showMessage('Please complete all required fields.');
        return;
      }
      if (password.length < 8) {
        showMessage('Password must contain at least 8 characters.');
        return;
      }
      if (password !== confirmPassword) {
        showMessage('Passwords do not match.');
        return;
      }
      if (!acceptedTerms) {
        showMessage('You must accept the Terms of Service and Privacy Policy.');
        return;
      }
      if (!window.LabMedSysAuth || typeof window.LabMedSysAuth.signUp !== 'function') {
        showMessage('Authentication service is not available. Please refresh and try again.');
        console.error('LabMedSysAuth is unavailable:', window.LabMedSysAuth);
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = 'Creating account...';
      showMessage('Creating your account...', 'success');

      try {
        const result = await window.LabMedSysAuth.signUp({
          email,
          password,
          fullName,
          companyName
        });

        if (result.user && !result.session) {
          sessionStorage.setItem('labmedsys_pending_confirmation_email', email);
          sessionStorage.setItem('labmedsys_pending_full_name', fullName);
          sessionStorage.setItem('labmedsys_pending_company', companyName);
          window.location.href = 'check-email.html';
        } else if (result.session) {
          // This branch only occurs when email confirmation is disabled in Supabase.
          // Keep the flow explicit so we can diagnose configuration differences.
          console.warn('LabMedSys signup returned an immediate session. Email confirmation may be disabled.');
          sessionStorage.setItem('labmedsys_pending_full_name', fullName);
          sessionStorage.setItem('labmedsys_pending_company', companyName);
          window.location.href = 'signup-complete.html';
        } else {
          throw new Error('Account creation did not return a user.');
        }
      } catch (error) {
        console.error('LabMedSys signup failed:', error);
        showMessage(error?.message || 'Unable to create your account. Please try again.');
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Create workspace →';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();