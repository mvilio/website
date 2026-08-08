document.addEventListener('DOMContentLoaded', () => {
  // Avatar module: click to toggle a larger size. Layout reflows
  // naturally since it's a normal flex item inside the wrapping hero line.
  const avatarBtn = document.getElementById('avatarBtn');

  if (avatarBtn) {
    avatarBtn.addEventListener('click', () => {
      const isExpanded = avatarBtn.classList.toggle('is-expanded');
      avatarBtn.setAttribute('aria-pressed', String(isExpanded));
      avatarBtn.setAttribute('aria-label', isExpanded ? 'Shrink photo' : 'Expand photo');
    });
  }

  const toggleBtn = document.getElementById('navToggle');
  const closeBtn = document.getElementById('navClose');
  const overlay = document.getElementById('navOverlay');
  const overlayLinks = overlay.querySelectorAll('a');

  const openMenu = () => {
    overlay.classList.add('is-open');
    document.body.classList.add('menu-open');
    toggleBtn.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    overlay.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
  };

  toggleBtn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  overlayLinks.forEach((link) => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
      closeMenu();
    }
  });
});
