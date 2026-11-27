/* ============================================================
   WE MAP IT — Interações da landing page
   Vanilla JS, sem dependências.
   ============================================================ */

/* ============================================================
   MENU NO CELULAR — abre e fecha a navegação principal
   ============================================================ */
(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('menu-principal');
  if (!header || !toggle || !nav) return;

  function setOpen(open) {
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }

  toggle.addEventListener('click', function () {
    setOpen(!header.classList.contains('is-open'));
  });

  // fecha ao escolher um item, ao apertar Esc ou ao clicar fora
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && header.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', function (e) {
    if (header.classList.contains('is-open') && !header.contains(e.target)) setOpen(false);
  });
})();

/* ============================================================
   MOTION — cursor circular (LERP) + revelação de palavras
   Inspirado em fewandfar.co.uk.
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!reduceMotion) document.documentElement.classList.add('motion');

  /* ---- CALIBRAGEM (ajuste aqui a intensidade) ---- */
  var LERP = 0.15;          // suavidade do cursor, 0–1: menor = mais lento
  var STAGGER = 0.05;       // atraso (em s) entre palavras na revelação
  var SCRIPT_DELAY = 0.47;  // script começa quando a 1ª linha assenta (14 frames)

  /* ---- EFEITO 1: cursor circular que segue o mouse com atraso ---- */
  var cursor = document.querySelector('.cursor');
  if (cursor && canHover && !reduceMotion) {
    document.body.classList.add('has-cursor');

    var mx = window.innerWidth / 2, my = window.innerHeight / 2, cx = mx, cy = my, primed = false;

    window.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      if (!primed) { cx = mx; cy = my; primed = true; } // evita "voar" do centro
    });

    (function loop() {
      cx += (mx - cx) * LERP;
      cy += (my - cy) * LERP;
      cursor.style.transform = 'translate(' + cx + 'px, ' + cy + 'px)';
      requestAnimationFrame(loop);
    })();

    document.querySelectorAll('a, button, summary, [data-cursor]').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursor.classList.add('is-hover'); });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('is-hover'); });
    });
  }

  /* ---- EFEITO 2: revelação de palavras ao entrar na viewport ----
     Inter Tight: cada palavra sobe de dentro de uma máscara.
     Script: não entra na máscara (cortaria os laços); é "escrito"
     da esquerda pra direita, depois que a primeira linha assenta. */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length && !reduceMotion && 'IntersectionObserver' in window) {

    revealEls.forEach(function (el) {
      var wi = 0; // índice global de palavra (controla o transition-delay)

      function build(node) {
        var frag = document.createDocumentFragment();

        Array.prototype.forEach.call(node.childNodes, function (child) {
          if (child.nodeType === 3) {
            child.textContent.split(/(\s+)/).forEach(function (part) {
              if (part === '') return;
              if (/^\s+$/.test(part)) {
                frag.appendChild(document.createTextNode(' '));
                return;
              }
              var word = document.createElement('span');
              word.className = 'word';
              var inner = document.createElement('span');
              inner.className = 'word__inner';
              inner.style.transitionDelay = (wi++ * STAGGER) + 's';
              inner.textContent = part;
              word.appendChild(inner);
              frag.appendChild(word);
            });
          } else if (child.nodeType === 1 && child.classList.contains('script')) {
            var script = child.cloneNode(true);
            script.classList.add('is-write');
            script.style.transitionDelay = (SCRIPT_DELAY + wi * STAGGER * 0.5) + 's';
            wi++;
            frag.appendChild(script);
          } else if (child.nodeType === 1) {
            var clone = child.cloneNode(false);
            clone.appendChild(build(child));
            frag.appendChild(clone);
          }
        });

        return frag;
      }

      var built = build(el);
      el.innerHTML = '';
      el.appendChild(built);
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.2 });

    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---- EFEITO 3: numerais em Playfair aparecem com desfoque e leve subida ---- */
  var appearEls = document.querySelectorAll('[data-appear]');
  if (appearEls.length && !reduceMotion && 'IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var group = en.target.closest('.method-grid, .process') || document.body;
        var index = Array.prototype.indexOf.call(group.querySelectorAll('[data-appear]'), en.target);
        en.target.style.transitionDelay = (Math.max(index, 0) * 0.1) + 's';
        en.target.classList.add('is-in');
        io2.unobserve(en.target);
      });
    }, { threshold: 0.3 });
    appearEls.forEach(function (el) { io2.observe(el); });
  } else {
    appearEls.forEach(function (el) { el.classList.add('is-in'); });
  }
})();

/* ============================================================
   BARRA DE PROGRESSO — fio verde no header acompanha a leitura
   ============================================================ */
(function () {
  'use strict';

  var bar = document.querySelector('.scroll-progress');
  if (!bar) return;

  var ticking = false;
  function update() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    bar.style.transform = 'scaleX(' + p + ')';
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

/* ============================================================
   CARD DE CONVITE — diagnóstico de perfil gratuito
   Aparece ao rolar 40% da página, uma vez por sessão. Não aparece
   se a pessoa já clicou em algum botão primário.
   ============================================================ */
(function () {
  'use strict';

  var card = document.getElementById('wmi-invite');
  if (!card) return;

  var KEY = 'wmi_invite';
  var TRIGGER = 0.4;   // fração da página rolada que abre o card
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var shown = false;

  function remember() {
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
  }

  function scrolledFraction() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? window.scrollY / max : 0;
  }

  function show() {
    card.hidden = false;
    requestAnimationFrame(function () { card.classList.add('is-in'); });
  }

  function dismiss() {
    remember();
    window.removeEventListener('scroll', onScroll);
    if (card.hidden) return;
    card.classList.remove('is-in');
    var done = function () { card.hidden = true; };
    if (reduce) { done(); }
    else { card.addEventListener('transitionend', done, { once: true }); setTimeout(done, 600); }
  }

  function onScroll() {
    if (shown) return;
    if (scrolledFraction() >= TRIGGER) {
      shown = true;
      show();
      window.removeEventListener('scroll', onScroll);
    }
  }

  // clicou num botão primário da página: o card não aparece mais nesta sessão
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.btn-primario');
    if (btn && !card.contains(btn)) dismiss();
  });

  card.querySelector('.invite-x').addEventListener('click', dismiss);
  card.querySelector('.invite-no').addEventListener('click', dismiss);
  // "Quero o diagnóstico" abre o Typeform (href) e encerra o card
  card.querySelector('.invite-yes').addEventListener('click', dismiss);

  var dismissed = false;
  try { dismissed = sessionStorage.getItem(KEY) === '1'; } catch (e) {}
  if (!dismissed) window.addEventListener('scroll', onScroll, { passive: true });
})();
