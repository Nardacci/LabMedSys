(() => {
  'use strict';

  document.getElementById('go-to-signin')?.addEventListener('click', () => {
    // Same confirmation flow as KORbuild: explicit transition back to Sign in.
    window.location.href = 'index.html';
  });
})();