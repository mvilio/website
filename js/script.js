document.addEventListener('DOMContentLoaded', () => {
  // Reveal on Scroll: fades and lifts whole blocks (hero, project
  // articles, footer, etc.) into place as they scroll into view,
  // rather than animating individual words.
  const revealEls = document.querySelectorAll('.reveal-fade');

  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // Hero video: force autoplay/loop/mute so it always just loops with
  // no play button, even in browsers that are picky about autoplay.
  document.querySelectorAll('.hero-video').forEach((video) => {
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        // Autoplay was blocked; retry once the user interacts with the page.
        const retry = () => {
          video.play().catch(() => {});
          document.removeEventListener('click', retry);
          document.removeEventListener('scroll', retry);
        };
        document.addEventListener('click', retry, { once: true });
        document.addEventListener('scroll', retry, { once: true });
      });
    }
  });

  // Click-to-retype: clicking the "Product Designer" or "Vancouver,
  // British Columbia" pill retypes its text like a typewriter.
  const typePills = document.querySelectorAll('.pill-type');

  const typeText = (el, text, speed, onDone) => {
    el.textContent = '';
    el.classList.add('is-typing');
    let i = 0;
    const interval = setInterval(() => {
      el.textContent += text.charAt(i);
      i += 1;
      if (i >= text.length) {
        clearInterval(interval);
        el.classList.remove('is-typing');
        if (onDone) onDone();
      }
    }, speed);
  };

  typePills.forEach((pill) => {
    const textEl = pill.querySelector('.pill-text');
    if (!textEl) return;
    const originalText = textEl.textContent;
    let animating = false;

    const trigger = () => {
      if (animating) return;
      animating = true;
      typeText(textEl, originalText, 45, () => {
        animating = false;
      });
    };

    pill.addEventListener('click', trigger);
    pill.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger();
      }
    });
  });

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
