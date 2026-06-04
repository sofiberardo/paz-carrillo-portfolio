/* ============================================================
   PAZ CARRILLO — PORTFOLIO  |  script.js
   ============================================================ */

'use strict';

/* ── Wait for deferred scripts ── */
window.addEventListener('load', init);

function init() {

  /* Check libs */
  const hasGSAP      = typeof gsap !== 'undefined';
  const hasST        = hasGSAP && typeof ScrollTrigger !== 'undefined';
  const hasLenis     = typeof Lenis !== 'undefined';
  const hasSplitType = typeof SplitType !== 'undefined';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (hasGSAP && hasST) gsap.registerPlugin(ScrollTrigger);

  /* ============================================================
     LENIS
  ============================================================ */
  let lenis;
  if (hasLenis && !reducedMotion) {
    lenis = new Lenis({
      duration: 1.15,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    if (hasST) lenis.on('scroll', ScrollTrigger.update);
    if (hasGSAP) {
      gsap.ticker.add(time => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ============================================================
     LOADER
  ============================================================ */
  const loaderEl   = document.getElementById('loader');
  const loaderWord = document.querySelector('.loader-word');
  const loaderBar  = document.querySelector('.loader-bar');
  const heroTitle  = document.querySelector('.hero-title');

  if (!hasGSAP || !loaderEl) {
    loaderEl && loaderEl.remove();
    document.body.style.overflow = '';
    buildScrollAnimations();
    return;
  }

  document.body.style.overflow = 'hidden';

  const tl = gsap.timeline({
    defaults: { ease: 'power4.out' },
    onComplete() {
      loaderEl.style.pointerEvents = 'none';
      loaderEl.style.display = 'none';
      document.body.style.overflow = '';
      buildScrollAnimations();
    }
  });

  /* 1 — bar fills */
  tl.to(loaderBar, { width: '100%', duration: 0.85, ease: 'power2.inOut' })

  /* 2 — word enters */
    .to(loaderWord, { y: '0%', duration: 0.75 }, '-=0.25')

  /* 3 — word exits */
    .to(loaderWord, { y: '-110%', duration: 0.6, ease: 'power4.in', delay: 0.25 })

  /* 4 — loader slides up */
    .to(loaderEl, { yPercent: -100, duration: 0.85, ease: 'power4.inOut' }, '-=0.35')

  /* 5 — hero rule */
    .fromTo('.hero-rule',
      { scaleX: 0 },
      { scaleX: 1, duration: 1, ease: 'power3.inOut' }, '-=0.4')

  /* 6 — hero meta + xx + scroll hint */
    .fromTo(['.hero-meta', '.hero-xx', '.hero-scroll'],
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, '-=0.6')

  /* 7 — hero image */
    .fromTo('.hero-img',
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, duration: 0.8 }, '-=0.5');

  /* 8 — hero title char by char */
  if (hasSplitType && heroTitle && !reducedMotion) {
    const st = new SplitType(heroTitle, { types: 'chars' });
    tl.fromTo(st.chars,
      { yPercent: 110 },
      { yPercent: 0, duration: 0.8, stagger: 0.04, ease: 'power4.out' },
      '-=0.85'
    );
  } else if (heroTitle) {
    tl.fromTo(heroTitle, { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.5');
  }

  /* ============================================================
     CUSTOM CURSOR
  ============================================================ */
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  const isTouch  = !window.matchMedia('(hover: hover)').matches;

  if (cursor && follower && !isTouch && hasGSAP) {
    let mx = 0, my = 0, fx = 0, fy = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      gsap.to(cursor, { x: mx, y: my, duration: 0.1, ease: 'none' });
    });

    gsap.ticker.add(() => {
      fx += (mx - fx) * 0.1;
      fy += (my - fy) * 0.1;
      gsap.set(follower, { x: fx, y: fy });
    });

    const hoverTargets = 'a, button, .indice-item, .project-intro-img, .project-title';
    document.querySelectorAll(hoverTargets).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor--hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor--hover'));
    });

    if (hasST) {
      document.querySelectorAll('.s-divider').forEach(el => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 50%', end: 'bottom 50%',
          onEnter:     () => document.body.classList.add('cursor--dark'),
          onLeave:     () => document.body.classList.remove('cursor--dark'),
          onEnterBack: () => document.body.classList.add('cursor--dark'),
          onLeaveBack: () => document.body.classList.remove('cursor--dark'),
        });
      });
    }
  }

  /* ============================================================
     PROGRESS BAR
  ============================================================ */
  const progressBar = document.getElementById('progress-bar');
  if (progressBar && lenis) {
    lenis.on('scroll', ({ progress }) => {
      progressBar.style.width = `${progress * 100}%`;
    });
  }

  /* ============================================================
     NAV HIDE / SHOW
  ============================================================ */
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  if (nav && hasGSAP) {
    const onScroll = () => {
      const s = window.scrollY;
      if (s > 100 && s > lastScroll) {
        gsap.to(nav, { y: '-100%', duration: 0.35, ease: 'power2.inOut' });
      } else {
        gsap.to(nav, { y: '0%', duration: 0.35, ease: 'power2.out' });
      }
      lastScroll = s;
    };

    if (lenis) {
      lenis.on('scroll', ({ scroll }) => {
        const s = scroll;
        if (s > 100 && s > lastScroll) {
          gsap.to(nav, { y: '-100%', duration: 0.35, ease: 'power2.inOut' });
        } else {
          gsap.to(nav, { y: '0%', duration: 0.35, ease: 'power2.out' });
        }
        lastScroll = s;
      });
    } else {
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  }

  /* ============================================================
     MOBILE MENU
  ============================================================ */
  const hamburger   = document.querySelector('.hamburger');
  const mobileMenu  = document.getElementById('mobile-menu');
  let menuOpen = false;

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', toggleMenu);
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  }

  function toggleMenu() {
    menuOpen ? closeMenu() : openMenu();
  }
  function openMenu() {
    menuOpen = true;
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('is-open');
    mobileMenu.removeAttribute('aria-hidden');
    lenis && lenis.stop();
    if (hasGSAP) {
      const spans = hamburger.querySelectorAll('span');
      gsap.to(spans[0], { rotate: 45,  y: 6,  duration: 0.28 });
      gsap.to(spans[1], { rotate: -45, y: -6, duration: 0.28 });
    }
  }
  function closeMenu() {
    menuOpen = false;
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    lenis && lenis.start();
    if (hasGSAP) {
      const spans = hamburger.querySelectorAll('span');
      gsap.to(spans, { rotate: 0, y: 0, duration: 0.28 });
    }
  }

  /* ── Smooth anchor scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { offset: -64, duration: 1.4 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ============================================================
     PROJECT TITLE — subtle letter-spacing hover
  ============================================================ */
  if (hasGSAP) {
    document.querySelectorAll('.project-title').forEach(el => {
      el.addEventListener('mouseenter', () =>
        gsap.to(el, { letterSpacing: '-0.01em', duration: 0.35, ease: 'power2.out' })
      );
      el.addEventListener('mouseleave', () =>
        gsap.to(el, { letterSpacing: '-0.04em', duration: 0.35, ease: 'power2.out' })
      );
    });
  }

  /* ============================================================
     PROJECT IMAGE — perspective tilt on hover
  ============================================================ */
  if (hasGSAP && !isTouch) {
    document.querySelectorAll('.project-intro-img:not(.project-intro-img--double)').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = ((e.clientX - r.left)  / r.width  - 0.5) * 8;
        const y = ((e.clientY - r.top)   / r.height - 0.5) * 8;
        gsap.to(el, {
          rotateY: x, rotateX: -y,
          transformPerspective: 900,
          duration: 0.5, ease: 'power2.out',
        });
      });
      el.addEventListener('mouseleave', () =>
        gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.7, ease: 'power2.out' })
      );
    });
  }

  /* ============================================================
     INDICE — magnetic number on row hover
  ============================================================ */
  if (hasGSAP && !isTouch) {
    document.querySelectorAll('.indice-item').forEach(item => {
      const num = item.querySelector('.indice-num');
      item.addEventListener('mousemove', e => {
        const r = item.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * 18;
        gsap.to(num, { x, duration: 0.3, ease: 'power2.out' });
      });
      item.addEventListener('mouseleave', () =>
        gsap.to(num, { x: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
      );
    });
  }

} /* end init() */

/* ============================================================
   SCROLL ANIMATIONS  (called after loader completes)
============================================================ */
function buildScrollAnimations() {
  const hasGSAP      = typeof gsap !== 'undefined';
  const hasST        = hasGSAP && typeof ScrollTrigger !== 'undefined';
  const hasSplitType = typeof SplitType !== 'undefined';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!hasGSAP || !hasST || reducedMotion) return;

  /* ── Heading char reveals ── */
  if (hasSplitType) {
    document.querySelectorAll('.js-split-chars').forEach(el => {
      const st = new SplitType(el, { types: 'chars' });
      gsap.fromTo(st.chars,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.65,
          stagger: 0.022,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 86%',
            once: true,
          },
        }
      );
    });
  }

  /* ── Generic fade-up ── */
  const fadeSelectors = [
    '.section-label', '.section-counter',
    '.sobre-name', '.sobre-acerca', '.sobre-contact-block',
    '.bio-grid',
    '.project-year', '.project-num', '.project-desc', '.project-meta', '.project-insta',
    '.illus-meta', '.illus-group .illus-meta',
    '.footer-meta', '.footer-xx',
    '.divider-content p',
  ];
  fadeSelectors.forEach(sel => {
    gsap.utils.toArray(sel).forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0,
          duration: 0.65, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 89%', once: true },
        }
      );
    });
  });

  /* ── Image clip reveal ── */
  document.querySelectorAll('.js-img-reveal').forEach(wrap => {
    const img = wrap.querySelector('img');
    gsap.fromTo(wrap,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.05,
        ease: 'power4.out',
        scrollTrigger: { trigger: wrap, start: 'top 82%', once: true },
      }
    );
    if (img) {
      gsap.fromTo(img,
        { scale: 1.18 },
        {
          scale: 1,
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: { trigger: wrap, start: 'top 82%', once: true },
        }
      );
    }
  });

  /* ── Gallery images: stagger opacity+scale ── */
  document.querySelectorAll('.gallery').forEach(gallery => {
    const imgs = gallery.querySelectorAll('img');
    gsap.fromTo(imgs,
      { opacity: 0, scale: 1.05 },
      {
        opacity: 1, scale: 1,
        duration: 0.75,
        stagger: 0.07,
        ease: 'power3.out',
        scrollTrigger: { trigger: gallery, start: 'top 84%', once: true },
      }
    );
  });

  /* ── Section divider bg number: parallax ── */
  document.querySelectorAll('.js-parallax-num').forEach(el => {
    gsap.fromTo(el,
      { xPercent: 6 },
      {
        xPercent: -6,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('.s-divider'),
          start: 'top bottom',
          end:   'bottom top',
          scrub: 1.6,
        },
      }
    );
  });

  /* ── Divider text: slide in from left ── */
  gsap.utils.toArray('.divider-content').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, x: -36 },
      {
        opacity: 1, x: 0,
        duration: 0.9, ease: 'power4.out',
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      }
    );
  });

  /* ── Hero title parallax ── */
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    gsap.to(heroTitle, {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end:   'bottom top',
        scrub: 1,
      },
    });
  }

  /* ── Hero image parallax ── */
  const heroImg = document.querySelector('.hero-img');
  if (heroImg) {
    gsap.to(heroImg, {
      yPercent: -14,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end:   'bottom top',
        scrub: 1,
      },
    });
  }

  /* ── Portrait parallax ── */
  const portrait = document.querySelector('.sobre-photo img');
  if (portrait) {
    gsap.fromTo(portrait,
      { yPercent: -6 },
      {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: {
          trigger: '.sobre-photo',
          start: 'top bottom',
          end:   'bottom top',
          scrub: 1,
        },
      }
    );
  }

  /* ── Bio image parallax ── */
  const bioImg = document.querySelector('.sobre-bio-img img');
  if (bioImg) {
    gsap.fromTo(bioImg,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: '.sobre-bio',
          start: 'top bottom',
          end:   'bottom top',
          scrub: 1,
        },
      }
    );
  }

  /* ── Full-bleed gallery parallax ── */
  document.querySelectorAll('.g-full img, .g-feature img').forEach(img => {
    gsap.fromTo(img,
      { yPercent: -7 },
      {
        yPercent: 7,
        ease: 'none',
        scrollTrigger: {
          trigger: img.parentElement,
          start: 'top bottom',
          end:   'bottom top',
          scrub: 1.2,
        },
      }
    );
  });

  /* ── Índice items: stagger slide in ── */
  gsap.fromTo('.indice-item',
    { opacity: 0, x: -20 },
    {
      opacity: 1, x: 0,
      duration: 0.55,
      stagger: 0.09,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.indice-list', start: 'top 82%', once: true },
    }
  );

  /* ── Footer rule scale in ── */
  gsap.fromTo('.footer-rule',
    { scaleX: 0 },
    {
      scaleX: 1,
      duration: 1.2,
      ease: 'power3.inOut',
      scrollTrigger: { trigger: '#footer', start: 'top 88%', once: true },
    }
  );

  /* ── Hero rule (also triggered by scroll for users who skipped loader) ── */
  gsap.fromTo('.hero-rule',
    { scaleX: 0 },
    {
      scaleX: 1,
      duration: 1,
      ease: 'power3.inOut',
      scrollTrigger: { trigger: '#hero', start: 'top 100%', once: true },
    }
  );

  /* ── Meta tags pop in ── */
  document.querySelectorAll('.meta-tags span').forEach((span, i) => {
    gsap.fromTo(span,
      { opacity: 0, scale: 0.88 },
      {
        opacity: 1, scale: 1,
        duration: 0.4,
        delay: i * 0.04,
        ease: 'back.out(1.6)',
        scrollTrigger: { trigger: span, start: 'top 91%', once: true },
      }
    );
  });

  /* ── Bio labels: slide from left ── */
  document.querySelectorAll('.bio-label').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, x: -14 },
      {
        opacity: 1, x: 0,
        duration: 0.45, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      }
    );
  });

  /* ── Footer "Gracias" chars ── */
  const gracias = document.querySelector('.footer-gracias');
  if (gracias && hasSplitType) {
    const sg = new SplitType(gracias, { types: 'chars' });
    gsap.fromTo(sg.chars,
      { yPercent: 110, opacity: 0 },
      {
        yPercent: 0, opacity: 1,
        duration: 0.8, stagger: 0.03, ease: 'power4.out',
        scrollTrigger: { trigger: gracias, start: 'top 86%', once: true },
      }
    );
  }

} /* end buildScrollAnimations() */
