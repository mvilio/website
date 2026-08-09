document.addEventListener('DOMContentLoaded', () => {
  // Custom cursor: a small dot replaces the system pointer, and grows into
  // a filled circle with an arrow whenever it's over a link that navigates
  // somewhere (nav, logo, project media/titles, footer icons, back-to-work
  // links). Only runs on devices with a real mouse — touch devices keep
  // their native tap behaviour untouched.
  const supportsCustomCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (supportsCustomCursor) {
    document.documentElement.classList.add('has-custom-cursor');

    const cursorEl = document.createElement('div');
    cursorEl.className = 'custom-cursor';
    cursorEl.innerHTML = `
      <span class="custom-cursor-dot"></span>
      <svg class="custom-cursor-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M4 12L12 4M12 4H5.5M12 4V10.5" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    document.body.appendChild(cursorEl);

    let hasMoved = false;

    document.addEventListener('mousemove', (e) => {
      cursorEl.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      if (!hasMoved) {
        hasMoved = true;
        cursorEl.style.opacity = '1';
      }
    });

    document.addEventListener('mouseleave', () => {
      cursorEl.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      if (hasMoved) cursorEl.style.opacity = '1';
    });

    const isCursorTarget = (el) => el.closest(
      'a[href="jazzdor.html"], a[href="police-museum.html"], a[href="https://davidson-co.com/"]'
    );

    document.addEventListener('mouseover', (e) => {
      if (isCursorTarget(e.target)) {
        cursorEl.classList.add('is-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (isCursorTarget(e.target)) {
        cursorEl.classList.remove('is-hover');
      }
    });
  }

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

  // Hero video: force autoplay/loop/mute so it always just loops with no
  // click needed, even in browsers that are picky about autoplay.
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

  // Case-study preview videos: start playing immediately with sound on.
  // Browsers that block unmusted autoplay force a muted fallback so it
  // still plays right away. Once the video finishes its first play-through
  // it loops on its own, muted from then on — the person can turn sound
  // back on any time using the native mute button in the controls.
  document.querySelectorAll('.case-video').forEach((video) => {
    video.loop = false;
    video.playsInline = true;

    const startMuted = () => {
      video.muted = true;
      video.play().catch(() => {});
    };

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(startMuted);
    }

    video.addEventListener('ended', () => {
      video.muted = true;
      video.currentTime = 0;
      video.play().catch(() => {});
    });
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

  // Hero video: clicking (or Enter/Space on) the video opens it larger in
  // a lightbox — YouTube-video sized, blurred backdrop, easy to click off.
  const heroVideoWrap = document.getElementById('heroVideoWrap');
  const videoModal = document.getElementById('videoModal');
  const videoModalVideo = document.getElementById('videoModalVideo');
  const videoModalClose = document.getElementById('videoModalClose');

  if (heroVideoWrap && videoModal && videoModalVideo) {
    const openVideoModal = () => {
      videoModal.classList.add('is-open');
      videoModal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('video-modal-open');
      videoModalVideo.play().catch(() => {});
    };

    const closeVideoModal = () => {
      videoModal.classList.remove('is-open');
      videoModal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('video-modal-open');
    };

    heroVideoWrap.addEventListener('click', openVideoModal);
    heroVideoWrap.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openVideoModal();
      }
    });

    videoModalClose.addEventListener('click', closeVideoModal);

    videoModal.querySelectorAll('[data-modal-close]').forEach((el) => {
      el.addEventListener('click', closeVideoModal);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && videoModal.classList.contains('is-open')) {
        closeVideoModal();
      }
    });
  }

  // Copy email address button (About page): copies the email to the
  // clipboard and briefly swaps the label to confirm it worked.
  const copyEmailBtn = document.getElementById('copyEmailBtn');

  if (copyEmailBtn) {
    const copyEmailText = copyEmailBtn.querySelector('.copy-email-text');
    const originalLabel = copyEmailText ? copyEmailText.textContent : '';
    const email = copyEmailBtn.dataset.email || '';
    let resetTimeout;

    copyEmailBtn.addEventListener('click', () => {
      const showFeedback = () => {
        if (!copyEmailText) return;
        clearTimeout(resetTimeout);
        copyEmailText.textContent = 'Copied!';
        resetTimeout = setTimeout(() => {
          copyEmailText.textContent = originalLabel;
        }, 1800);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(showFeedback).catch(() => {});
      } else {
        const temp = document.createElement('textarea');
        temp.value = email;
        temp.style.position = 'fixed';
        temp.style.opacity = '0';
        document.body.appendChild(temp);
        temp.select();
        try {
          document.execCommand('copy');
          showFeedback();
        } catch (err) {
          // Clipboard copy not supported; fail silently.
        }
        document.body.removeChild(temp);
      }
    });
  }

  // Hover Name (About page): hovering the "Hi, I'm Markus." heading reveals
  // a photo that sits behind the text and trails the cursor as it moves.
  // On touch devices (no real hover), a tap toggles the photo in place instead.
  const hoverName = document.getElementById('hoverName');
  const hoverCard = document.getElementById('hoverNameCard');

  if (hoverName && hoverCard) {
    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const positionCard = (clientX, clientY) => {
      const rect = hoverName.getBoundingClientRect();
      hoverCard.style.left = `${clientX - rect.left}px`;
      hoverCard.style.top = `${clientY - rect.top}px`;
    };

    if (supportsHover) {
      hoverName.addEventListener('mouseenter', (e) => {
        positionCard(e.clientX, e.clientY);
        hoverName.classList.add('is-active');
      });

      hoverName.addEventListener('mousemove', (e) => {
        positionCard(e.clientX, e.clientY);
      });

      hoverName.addEventListener('mouseleave', () => {
        hoverName.classList.remove('is-active');
      });

      hoverName.addEventListener('focus', () => {
        const rect = hoverName.getBoundingClientRect();
        hoverCard.style.left = `${rect.width / 2}px`;
        hoverCard.style.top = `${rect.height / 2}px`;
        hoverName.classList.add('is-active');
      });

      hoverName.addEventListener('blur', () => {
        hoverName.classList.remove('is-active');
      });
    } else {
      // Tap mode: tapping the heading toggles the photo centered in place;
      // tapping elsewhere closes it.
      hoverName.addEventListener('click', (e) => {
        e.stopPropagation();
        const rect = hoverName.getBoundingClientRect();
        hoverCard.style.left = `${rect.width / 2}px`;
        hoverCard.style.top = `${rect.height / 2}px`;
        hoverName.classList.toggle('is-active');
      });

      document.addEventListener('click', () => {
        hoverName.classList.remove('is-active');
      });
    }
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
