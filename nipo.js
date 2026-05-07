(function () {
  'use strict';

  var cfg = window.nipoConfig || {};

  /* ── PATH DETECTION ─────────────────────────────────────────── */
  var inJogos = window.location.pathname.replace(/\\/g, '/').includes('/jogos/');
  var BASE = (inJogos ? '../' : '') + 'imag/mascote/';

  var IMG_NORMAL  = BASE + 'mipo_mascote.png';
  var IMG_CORRECT = BASE + 'mipo_feliz_acerto.png';
  var IMG_WRONG   = BASE + 'mipo_triste_erro.png';

  /* ── CSS ────────────────────────────────────────────────────── */
  var CSS = [
    /* Overlay wrapper */
    '#nipo-overlay{position:fixed;inset:0;z-index:9999;pointer-events:none;',
    'display:flex;align-items:flex-end;justify-content:flex-end;padding:28px;}',
    '#nipo-overlay.active{pointer-events:all;}',

    /* Backdrop */
    '.nipo-bd{position:fixed;inset:0;background:rgba(0,0,0,0);',
    'transition:background .3s ease;pointer-events:none;}',
    '#nipo-overlay.active .nipo-bd{background:rgba(0,0,0,.4);',
    'backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);pointer-events:all;}',

    /* Popup container */
    '.nipo-pop{position:relative;display:flex;flex-direction:column;align-items:center;',
    'transform:translateY(240px);opacity:0;z-index:10000;pointer-events:all;',
    'transition:transform .55s cubic-bezier(.34,1.56,.64,1),opacity .4s ease;}',
    '#nipo-overlay.active .nipo-pop{transform:translateY(0);opacity:1;}',

    /* Speech bubble */
    '.nipo-bbl{background:#fff;border-radius:20px;padding:14px 20px;max-width:270px;',
    'text-align:center;font-family:"Nunito","Segoe UI",sans-serif;font-size:1rem;',
    'font-weight:700;line-height:1.45;box-shadow:0 12px 40px rgba(0,0,0,.22);',
    'margin-bottom:16px;position:relative;opacity:0;transform:scale(.55);',
    'transition:opacity .45s cubic-bezier(.34,1.56,.64,1) .18s,',
    'transform .45s cubic-bezier(.34,1.56,.64,1) .18s;}',
    '#nipo-overlay.active .nipo-bbl{opacity:1;transform:scale(1);}',

    /* Bubble tail */
    '.nipo-bbl::after{content:"";position:absolute;bottom:-14px;left:50%;',
    'transform:translateX(-50%);border:9px solid transparent;',
    'border-top-color:#fff;border-bottom:none;}',

    /* Bubble types */
    '.nipo-bbl.ok{border:3px solid #27ae60;color:#155a30;}',
    '.nipo-bbl.ok::after{border-top-color:#27ae60;}',
    '.nipo-bbl.ng{border:3px solid #e67e22;color:#6b3300;}',
    '.nipo-bbl.ng::after{border-top-color:#e67e22;}',

    /* Mascot image */
    '.nipo-img{width:175px;height:175px;object-fit:contain;',
    'filter:drop-shadow(0 12px 28px rgba(0,0,0,.3));',
    'opacity:0;transform:scale(.65) rotate(-12deg);',
    'transition:opacity .5s cubic-bezier(.34,1.56,.64,1) .08s,',
    'transform .5s cubic-bezier(.34,1.56,.64,1) .08s;}',
    '#nipo-overlay.active .nipo-img{opacity:1;transform:scale(1) rotate(0deg);}',

    /* ── Welcome widget ── */
    '#nipo-welcome{position:fixed;bottom:24px;right:24px;z-index:9990;',
    'display:flex;flex-direction:column;align-items:center;cursor:pointer;',
    'transform:translateY(260px);opacity:0;',
    'transition:transform .65s cubic-bezier(.34,1.4,.64,1),opacity .5s ease;}',
    '#nipo-welcome.show{transform:translateY(0);opacity:1;}',
    '#nipo-welcome.gone{transform:translateY(260px);opacity:0;pointer-events:none;}',

    '.nipo-wbbl{background:#fff;border-radius:18px;padding:13px 36px 13px 18px;',
    'max-width:240px;text-align:center;',
    'font-family:"Nunito","Segoe UI",sans-serif;font-size:.92rem;font-weight:700;',
    'line-height:1.45;color:#1A3A4A;border:2.5px solid #4A9EC4;',
    'box-shadow:0 8px 30px rgba(74,158,196,.28);margin-bottom:12px;position:relative;}',
    '.nipo-wbbl::after{content:"";position:absolute;bottom:-14px;left:50%;',
    'transform:translateX(-50%);border:8px solid transparent;',
    'border-top-color:#4A9EC4;border-bottom:none;}',

    '.nipo-wcls{position:absolute;top:8px;right:11px;font-size:.72rem;',
    'line-height:1;cursor:pointer;opacity:.45;font-weight:900;',
    'font-family:"Nunito","Segoe UI",sans-serif;}',
    '.nipo-wcls:hover{opacity:.9;}',

    '.nipo-wimg{width:135px;height:135px;object-fit:contain;',
    'filter:drop-shadow(0 6px 18px rgba(0,0,0,.22));',
    'animation:nipoFloat 3s ease-in-out infinite;}',

    '@keyframes nipoFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-9px);}}'
  ].join('');

  /* ── INJECT CSS ─────────────────────────────────────────────── */
  var s = document.createElement('style');
  s.textContent = CSS;
  document.head.appendChild(s);

  /* ── INJECT OVERLAY HTML ────────────────────────────────────── */
  var overlay = document.createElement('div');
  overlay.id = 'nipo-overlay';
  overlay.innerHTML =
    '<div class="nipo-bd"></div>' +
    '<div class="nipo-pop">' +
      '<div class="nipo-bbl" id="nipo-bbl"></div>' +
      '<img class="nipo-img" id="nipo-img" src="" alt="Nipo" />' +
    '</div>';
  document.body.appendChild(overlay);

  var dismissTimer = null;

  function showOverlay(imgSrc, msg, type) {
    clearTimeout(dismissTimer);
    document.getElementById('nipo-bbl').textContent = msg;
    document.getElementById('nipo-bbl').className = 'nipo-bbl ' + type;
    document.getElementById('nipo-img').src = imgSrc;
    overlay.classList.add('active');
    dismissTimer = setTimeout(hideOverlay, 2900);
  }

  function hideOverlay() {
    overlay.classList.remove('active');
  }

  overlay.addEventListener('click', hideOverlay);

  /* ── PUBLIC API ─────────────────────────────────────────────── */
  window.nipoCorrect = function () {
    showOverlay(IMG_CORRECT, 'Parabéns, você acertou! Continue assim! 🌟', 'ok');
  };

  window.nipoErro = function () {
    showOverlay(IMG_WRONG, 'Infelizmente você errou, mas tente novamente — eu acredito em você! 💪', 'ng');
  };

  /* ── AUTO-WRAP GAME AUDIO FUNCTIONS ─────────────────────────── */
  function doWrap() {
    var wrapOk = cfg.wrapCorrect !== false;
    var wrapNg = cfg.wrapWrong  !== false;

    function wrap(name, cb) {
      if (typeof window[name] === 'function') {
        var orig = window[name];
        window[name] = function () { cb(); return orig.apply(this, arguments); };
      }
    }

    if (wrapOk) {
      wrap('playCorrect', window.nipoCorrect);
      wrap('playOk',      window.nipoCorrect);
      wrap('sndCorrect',  window.nipoCorrect);
    }
    if (wrapNg) {
      wrap('playWrong',   window.nipoErro);
      wrap('playNg',      window.nipoErro);
      wrap('sndWrong',    window.nipoErro);
    }

    /* playSound('correct' | 'wrong') pattern */
    if (typeof window.playSound === 'function') {
      var origPS = window.playSound;
      window.playSound = function (type) {
        if (wrapOk && type === 'correct') window.nipoCorrect();
        if (wrapNg && type === 'wrong')   window.nipoErro();
        return origPS.apply(this, arguments);
      };
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', doWrap);
  } else {
    doWrap();
  }

  /* ── WELCOME WIDGET ─────────────────────────────────────────── */
  window.nipoWelcome = function (msg) {
    var w = document.createElement('div');
    w.id = 'nipo-welcome';
    w.innerHTML =
      '<div class="nipo-wbbl">' +
        '<span class="nipo-wcls" id="nipo-wcls">✕</span>' +
        msg +
      '</div>' +
      '<img class="nipo-wimg" src="' + IMG_NORMAL + '" alt="Nipo" />';
    document.body.appendChild(w);

    setTimeout(function () { w.classList.add('show'); }, 1500);
    setTimeout(function () { w.classList.add('gone'); }, 9000);

    w.addEventListener('click', function () { w.classList.add('gone'); });
  };

})();
