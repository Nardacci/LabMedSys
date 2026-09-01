(() => {
  'use strict';
  const email = sessionStorage.getItem('labmedsys_pending_confirmation_email') || '';
  const emailElement = document.getElementById('confirmation-email');
  const resendButton = document.getElementById('resend-confirmation');
  const message = document.getElementById('resend-message');

  if (emailElement) emailElement.textContent = email || 'your email address';

  function showMessage(text, type = '') {
    if (!message) return;
    message.textContent = text;
    message.className = 'message' + (type ? ' ' + type : '');
  }

  resendButton?.addEventListener('click', async () => {
    if (!email) return showMessage('We could not identify your email. Please return to sign up.', 'error');
    resendButton.disabled = true;
    const originalText = resendButton.textContent;
    resendButton.textContent = 'Sending...';
    try {
      await window.LabMedSysAuth.resendSignupConfirmation(email);
      showMessage('Confirmation email sent. Please check your inbox.', 'success');
    } catch (error) {
      console.error('LabMedSys confirmation resend failed:', error);
      showMessage(error?.message || 'Unable to resend the confirmation email. Please try again.', 'error');
    } finally {
      resendButton.disabled = false;
      resendButton.textContent = originalText;
    }
  });
})();