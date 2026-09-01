(() => {
  'use strict';
  const form = document.getElementById('signup-form');
  const message = document.getElementById('signup-message');
  const submitButton = document.getElementById('signup-submit');

  function showMessage(text, type = 'error') {
    message.textContent = text;
    message.className = 'message ' + type;
  }

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    showMessage('', '');

    const fullName = document.getElementById('full-name').value.trim();
    const companyName = document.getElementById('company-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const acceptedTerms = document.getElementById('accept-terms').checked;

    if (!fullName || !companyName || !email || !password || !confirmPassword) return showMessage('Please complete all required fields.');
    if (password.length < 8) return showMessage('Password must contain at least 8 characters.');
    if (password !== confirmPassword) return showMessage('Passwords do not match.');
    if (!acceptedTerms) return showMessage('You must accept the Terms of Service and Privacy Policy.');
    if (!window.LabMedSysAuth?.signUp) return showMessage('Authentication service is not available. Please refresh and try again.');

    submitButton.disabled = true;
    submitButton.textContent = 'Creating account...';
    showMessage('Creating your account...', 'success');

    try {
      const result = await window.LabMedSysAuth.signUp({ email, password, fullName, companyName });

      sessionStorage.setItem('labmedsys_pending_confirmation_email', email);
      sessionStorage.setItem('labmedsys_pending_full_name', fullName);
      sessionStorage.setItem('labmedsys_pending_company', companyName);

      if (result.user && !result.session) {
        window.location.href = 'check-email.html';
      } else if (result.session) {
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
})();