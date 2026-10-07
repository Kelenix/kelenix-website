// Comportements de la page : bouton de paiement, barre d'achat mobile, branche du programme.
// Les animations d'entrée et de défilement sont dans animations.js.
(() => {
  // Lien vers votre page de paiement (Stripe Payment Link, Chariow, Gumroad…).
  // Vide = mode démonstration : le bouton affiche un message au lieu de rediriger.
  const CHECKOUT_URL = '';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  $('#year').textContent = new Date().getFullYear();

  /* ---- Paiement ---- */
  const toast = $('#toast');
  let toastTimer;
  $$('[data-buy]').forEach(btn => {
    if (CHECKOUT_URL) { btn.href = CHECKOUT_URL; return; }
    btn.addEventListener('click', e => {
      e.preventDefault();
      toast.textContent = 'Démonstration : ici s’ouvre votre page de paiement.';
      toast.classList.add('is-on');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('is-on'), 3800);
    });
  });

  /* ---- Barre d'achat mobile : visible quand aucun bouton d'achat n'est à l'écran ---- */
  const bar = $('#buybar'), seen = new Set();
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => e.isIntersecting ? seen.add(e.target) : seen.delete(e.target));
    bar.classList.toggle('is-on', seen.size === 0);
  });
  [$('.hero .btn'), $('#ticket'), $('#finalBuy')].forEach(el => io.observe(el));

  /* ---- Programme : la branche latérale part du module 2 et revient au module 5 ---- */
  const tree = $('#tree'), branch = $('.tree__branch'), dots = $$('.mod__dot');
  function placeBranch() {
    const top = tree.getBoundingClientRect().top;
    const y = d => { const r = d.getBoundingClientRect(); return r.top + r.height / 2 - top; };
    branch.style.top = y(dots[1]) + 'px';
    branch.style.height = (y(dots[4]) - y(dots[1])) + 'px';
  }
  placeBranch();
  addEventListener('resize', placeBranch);
  if (document.fonts) document.fonts.ready.then(placeBranch);
})();
