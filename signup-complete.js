(() => {
  const fullName = sessionStorage.getItem('labmedsys_pending_full_name') || '';
  const company = sessionStorage.getItem('labmedsys_pending_company') || 'LabMedSys';
  const firstName = fullName ? fullName.split(' ')[0] : '';

  if (firstName) document.getElementById('welcome-title').textContent = 'Welcome, ' + firstName + '.';
  document.getElementById('workspace-name').textContent = company;
  document.getElementById('workspace-avatar').textContent = (company[0] || 'L').toUpperCase();

  document.getElementById('go-to-signin')?.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
})();