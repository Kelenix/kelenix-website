// Animations GSAP + ScrollTrigger. Tout vit dans un matchMedia : avec "réduire les animations",
// rien ne s'anime et la page s'affiche dans son état final (terminal rempli, graphe complet).
(() => {
  const root = document.documentElement;
  if (!window.gsap || !window.ScrollTrigger) { root.classList.remove('anim'); return; }
  gsap.registerPlugin(ScrollTrigger);

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Découpe un texte en lettres, une seule fois. Le texte reste lisible par les lecteurs d'écran.
  function chars(el) {
    if (!el.dataset.split) {
      el.dataset.split = '1';
      if (!el.closest('[aria-hidden="true"], [role="img"]')) el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
      const walk = node => [...node.childNodes].forEach(n => {
        if (n.nodeType === 1) return walk(n);
        if (n.nodeType !== 3 || !n.textContent.trim()) return;
        const frag = document.createDocumentFragment();
        // un mot = un bloc insécable, pour qu'aucun retour à la ligne ne tombe au milieu d'un mot
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) return frag.append(' ');
          const w = document.createElement('span'); w.className = 'w'; w.setAttribute('aria-hidden', 'true');
          [...part].forEach(ch => { const c = document.createElement('span'); c.className = 'c'; c.textContent = ch; w.append(c); });
          frag.append(w);
        });
        n.replaceWith(frag);
      });
      walk(el);
    }
    return $$('.c', el);
  }

  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    root.classList.add('anim');
    const ease = 'power3.out';

    /* ---- Progression + navigation qui se range en descendant ---- */
    gsap.to('#progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .3 } });
    const nav = $('#nav');
    ScrollTrigger.create({
      start: 140, end: 'max',
      onUpdate: self => nav.classList.toggle('is-hidden', self.direction === 1 && !nav.contains(document.activeElement)),
      onLeaveBack: () => nav.classList.remove('is-hidden')
    });

    /* ---- Hero : entrée ---- */
    const title = $('#heroTitle');
    gsap.timeline({ defaults: { ease } })
      .set(title, { opacity: 1 })
      .fromTo('.hero .kicker', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .5 }, 0)
      .fromTo(chars(title), { yPercent: 110, rotation: 10, opacity: 0 }, { yPercent: 0, rotation: 0, opacity: 1, duration: .8, stagger: .035, ease: 'back.out(1.7)' }, .05)
      .fromTo('.hero__lead', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .6 }, .55)
      .fromTo('.hero__cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .6 }, .68)
      .fromTo('.hero__more', { opacity: 0 }, { opacity: 1, duration: .6 }, .9)
      .fromTo('.lab', { opacity: 0, y: 50, rotation: 2 }, { opacity: 1, y: 0, rotation: 0, duration: .9 }, .3);

    /* ---- Hero : le terminal tape les commandes et le graphe suit. Tourne seulement à l'écran. ---- */
    const cmd = name => $(`#term [data-step="${name}"]`);
    const out = name => cmd(name).nextElementSibling;
    const lines = $$('#term p'), typed = $$('#term .t-cmd').flatMap(p => chars(p));
    const head = (cx, cy, tx, ty) => [{ attr: { cx, cy }, duration: .5, ease: 'power2.inOut' }, { attr: { x: tx, y: ty }, duration: .5, ease: 'power2.inOut' }];
    const lab = gsap.timeline({ repeat: -1, repeatDelay: 3.2, delay: 1.1, scrollTrigger: { trigger: '.lab', start: 'top 95%', end: 'bottom top', toggleActions: 'play pause resume pause' } });
    lab.set(lines, { visibility: 'hidden' }).set(typed, { opacity: 0 })
      .set(['#gBranch', '#gMerge', '#gMainB'], { strokeDashoffset: 1 }).set(['#gC3', '#gC5'], { scale: 0 }).set('#gTag', { opacity: 0 })
      .set('#gHead', { attr: { cx: 60, cy: 110 } }).set('#gHeadTag', { attr: { x: 6, y: 114 } });
    const type = (name, then) => {
      lab.set(cmd(name), { visibility: 'visible' }, '+=.45').to(chars(cmd(name)), { opacity: 1, duration: .01, stagger: .034, ease: 'none' });
      then();
    };
    const print = el => lab.set(el, { visibility: 'visible' }, '+=.2').fromTo(el, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: .25 });
    type('branch', () => {
      print(out('branch'));
      lab.to('#gBranch', { strokeDashoffset: 0, duration: .7, ease: 'power2.inOut' }, '<').to('#gTag', { opacity: 1, duration: .3 }, '>-.2')
        .to('#gHead', head(170, 168, 192, 172)[0], '<-.3').to('#gHeadTag', head(170, 168, 192, 172)[1], '<');
    });
    type('commit', () => {
      print(out('commit'));
      lab.to('#gC3', { scale: 1, duration: .5, ease: 'back.out(3)' }, '<').to('#gHead', head(170, 182, 192, 186)[0], '<').to('#gHeadTag', head(170, 182, 192, 186)[1], '<');
    });
    type('back', () => lab.to('#gHead', head(60, 110, 6, 114)[0], '+=.15').to('#gHeadTag', head(60, 110, 6, 114)[1], '<'));
    type('merge', () => {
      lab.to('#gMerge', { strokeDashoffset: 0, duration: .8, ease: 'power2.inOut' }, '+=.2').to('#gMainB', { strokeDashoffset: 0, duration: .8, ease: 'power2.inOut' }, '<')
        .to('#gC5', { scale: 1, duration: .55, ease: 'back.out(3)' }, '>-.1').to('#gHead', head(60, 250, 6, 254)[0], '<').to('#gHeadTag', head(60, 250, 6, 254)[1], '<');
      print(out('merge'));
    });

    /* ---- Hero : légère parallaxe à la sortie ---- */
    gsap.to('.lab', { yPercent: -8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .5 } });
    gsap.to('.hero__copy', { yPercent: 6, opacity: .3, ease: 'none', scrollTrigger: { trigger: '.hero', start: '55% top', end: 'bottom top', scrub: true } });

    /* ---- Apparitions simples ---- */
    const reveals = $$('[data-reveal]');
    gsap.set(reveals, { opacity: 0, y: 36 });
    ScrollTrigger.batch(reveals, { start: 'top 88%', once: true, onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: .8, ease, stagger: .1, overwrite: true }) });

    /* ---- Problème : les messages d'erreur tombent en place, liés au défilement ---- */
    $$('.err').forEach((card, i) => {
      const tilt = Number(card.dataset.tilt);
      gsap.fromTo(card, { y: 140 + i * 50, rotation: tilt * 4, opacity: 0 }, { y: 0, rotation: tilt, opacity: 1, ease: 'none', scrollTrigger: { trigger: '.pain__grid', start: 'top 95%', end: 'top 45%', scrub: .7 } });
    });

    /* ---- Programme : le tronc se remplit, la branche se dessine, chaque commit apparaît à son tour ---- */
    gsap.fromTo('#treeFill', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '#tree', start: 'top 62%', end: 'bottom 70%', scrub: .4 } });
    const mods = $$('.mod');
    gsap.fromTo('#treeBranch', { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: mods[1], start: 'top 60%', endTrigger: mods[4], end: 'top 62%', scrub: .4 } });
    mods.forEach(mod => {
      gsap.timeline({ scrollTrigger: { trigger: mod, start: 'top 80%', toggleActions: 'play none none reverse' } })
        .from($('.mod__dot', mod), { scale: 0, duration: .5, ease: 'back.out(3)' })
        .from($('.mod__card', mod), { opacity: 0, x: 70, duration: .6, ease }, .05)
        .from($$('.mod__card li', mod), { opacity: 0, x: 16, duration: .35, ease, stagger: .06 }, .3);
    });

    /* ---- Avis : deux rangées qui glissent en sens inverse avec le défilement ---- */
    const rows = $('.reviews__rows');
    rows.classList.add('is-sliding');
    $$('.reviews__row').forEach(row => {
      const dir = Number(row.dataset.dir), span = () => Math.max(60, row.scrollWidth - innerWidth);
      gsap.fromTo(row, { x: () => dir < 0 ? 0 : -span() }, { x: () => dir < 0 ? -span() : 0, ease: 'none', scrollTrigger: { trigger: rows, start: 'top bottom', end: 'bottom top', scrub: .6, invalidateOnRefresh: true } });
    });

    /* ---- Prix : l'ancien prix se raye, le nouveau descend de 39 à 19 ---- */
    const price = { v: 39 }, newPrice = $('#newPrice');
    gsap.timeline({ scrollTrigger: { trigger: '#ticket', start: 'top 72%', once: true } })
      .from('#ticket', { y: 80, rotation: 4, opacity: 0, duration: .8, ease: 'back.out(1.5)' })
      .from('#oldPrice i', { scaleX: 0, duration: .45, ease: 'power3.inOut' }, .55)
      .fromTo(price, { v: 39 }, { v: 19, duration: 1, ease: 'power2.out', onUpdate: () => { newPrice.textContent = Math.round(price.v); } }, .75)
      .fromTo('.ticket__new', { scale: 1 }, { scale: 1.12, duration: .16, yoyo: true, repeat: 1, ease: 'power2.out' }, 1.75)
      .from('.ticket .btn', { opacity: 0, y: 20, duration: .5, ease }, 1.5);
    gsap.from('.incl li', { opacity: 0, x: -40, duration: .6, ease, stagger: .1, scrollTrigger: { trigger: '.incl', start: 'top 82%', once: true } });

    /* ---- Final : le message de commit se tape, le titre monte ---- */
    gsap.timeline({ scrollTrigger: { trigger: '.final', start: 'top 70%', once: true } })
      .from('.final__cmd', { opacity: 0, y: 30, duration: .5, ease })
      .fromTo(chars($('#finalMsg')), { opacity: 0 }, { opacity: 1, duration: .01, stagger: .045, ease: 'none' }, .3)
      .from('.final h2', { opacity: 0, y: 50, duration: .8, ease }, .6)
      .from('#finalBuy', { opacity: 0, scale: .7, duration: .6, ease: 'back.out(2)' }, 1);

    if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => { root.classList.remove('anim'); nav.classList.remove('is-hidden'); rows.classList.remove('is-sliding'); $('#newPrice').textContent = '19'; };
  });

  /* ---- Boutons magnétiques : seulement avec une souris ---- */
  mm.add('(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)', () => {
    const offs = $$('[data-magnet]').map(btn => {
      const x = gsap.quickTo(btn, 'x', { duration: .5, ease: 'power3.out' }), y = gsap.quickTo(btn, 'y', { duration: .5, ease: 'power3.out' });
      const move = e => { const r = btn.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * .25); y((e.clientY - r.top - r.height / 2) * .4); };
      const leave = () => { x(0); y(0); };
      btn.addEventListener('pointermove', move); btn.addEventListener('pointerleave', leave);
      return () => { btn.removeEventListener('pointermove', move); btn.removeEventListener('pointerleave', leave); };
    });
    return () => offs.forEach(off => off());
  });
})();
