/* Harbor Fieldkit — project 0218
   Static interface logic. No animation, no transitions, no network calls. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var on = function (el, ev, fn) { if (el) el.addEventListener(ev, fn); };

  /* newsletter form — local validation only */
  var form = $('[data-form]');
  on(form, 'submit', function (e) {
    e.preventDefault();
    var msg = $('[data-msg]', form);
    var required = $$('input[data-req]', form);
    for (var i = 0; i < required.length; i++) {
      if (!required[i].value.trim()) { required[i].focus(); msg.textContent = 'Please fill in every field.'; return; }
    }
    var mail = $('input[type=email]', form);
    if (mail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail.value)) {
      mail.focus(); msg.textContent = 'That email address looks incomplete.'; return;
    }
    msg.textContent = 'Thanks — this demo stores nothing.';
    form.reset();
  });

  /* to-do list */
  var todos = $('[data-todos]'), todoForm = $('[data-todo-form]');
  function countTodos() {
    if (!todos) return;
    var boxes = $$('input[type=checkbox]', todos);
    var done = boxes.filter(function (b) { return b.checked; }).length;
    var out = $('[data-done]');
    if (out) out.textContent = done;
  }
  on(todos, 'change', countTodos);
  on(todoForm, 'submit', function (e) {
    e.preventDefault();
    var input = $('[data-todo-in]');
    if (!input.value.trim()) return;
    var li = document.createElement('li');
    var label = document.createElement('label');
    var box = document.createElement('input');
    var span = document.createElement('span');
    box.type = 'checkbox'; box.setAttribute('data-todo', '');
    span.textContent = input.value.trim();
    label.appendChild(box); label.appendChild(span); li.appendChild(label);
    todos.appendChild(li); input.value = ''; countTodos();
  });
  countTodos();

  /* like + copy */
  var like = $('[data-like]');
  on(like, 'click', function () {
    var on2 = like.getAttribute('aria-pressed') !== 'true';
    like.setAttribute('aria-pressed', on2 ? 'true' : 'false');
    like.classList.toggle('is-liked', on2);
    var n = $('[data-likes]');
    if (n) n.textContent = String(Number(n.textContent) + (on2 ? 1 : -1));
    var icon = $('[data-like-icon]');
    if (icon) icon.textContent = on2 ? '♥' : '♡';
  });
  var copy = $('[data-copy]');
  on(copy, 'click', function () {
    var src = $(copy.getAttribute('data-copy-src'));
    var out = $('[data-copy-out]');
    var text = src ? src.textContent.trim() : location.href;
    function done(ok) { if (out) out.textContent = ok ? 'Copied.' : 'Select the link above to copy it.'; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
    } else { done(false); }
  });

  /* tag chips */
  var chips = $$('[data-chip]'), chipOut = $('[data-chip-out]');
  chips.forEach(function (b) {
    b.addEventListener('click', function () {
      chips.forEach(function (x) { x.classList.remove('is-active'); });
      b.classList.add('is-active');
      if (chipOut) chipOut.textContent = 'Filtering by “' + b.textContent + '”.';
    });
  });

  /* faq search */
  var faqIn = $('[data-faq-in]');
  on(faqIn, 'input', function () {
    var q = faqIn.value.toLowerCase();
    $$('[data-accs] details').forEach(function (d) { d.hidden = d.textContent.toLowerCase().indexOf(q) === -1; });
  });

  /* palette + hsl controls */
  $$('[data-swap]').forEach(function (b) {
    b.addEventListener('click', function () {
      document.documentElement.style.setProperty('--accent', b.getAttribute('data-swap'));
      var o = $('[data-hsl-out]');
      if (o) o.textContent = 'Accent set to ' + b.getAttribute('data-swap');
    });
  });
  var hue = $('[data-hue]'), sat = $('[data-sat]');
  function paint() {
    if (!hue || !sat) return;
    var h = Number(hue.value), s = Number(sat.value);
    document.documentElement.style.setProperty('--accent', 'hsl(' + h + ' ' + s + '% 46%)');
    var ho = $('[data-hue-out]'), so = $('[data-sat-out]'), o = $('[data-hsl-out]');
    if (ho) ho.textContent = h;
    if (so) so.textContent = s;
    if (o) o.textContent = 'hsl(' + h + ' ' + s + '% 46%)';
  }
  on(hue, 'input', paint); on(sat, 'input', paint);

  /* pricing toggle */
  var bill = $('[data-billing]');
  on(bill, 'click', function () {
    var annual = bill.getAttribute('aria-pressed') !== 'true';
    bill.setAttribute('aria-pressed', annual ? 'true' : 'false');
    $$('[data-monthly]').forEach(function (n) {
      var m = Number(n.getAttribute('data-monthly'));
      n.textContent = annual ? String(m * 10) : String(m);
    });
    bill.textContent = annual ? 'Annual pricing' : 'Monthly pricing';
  });
  $$('[data-plan]').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('[data-plan]').forEach(function (x) { x.textContent = x === b ? 'Selected' : 'Choose'; });
    });
  });

  /* calculator — arithmetic without eval */
  var calc = $('.calc');
  if (calc) {
    var acc = '', op = '', fresh = false;
    var out = $('[data-out]', calc), expr = $('[data-expr]', calc);
    function show() {
      out.textContent = acc || '0';
      expr.textContent = op ? acc + ' ' + op : '';
    }
    function apply(a, b, o) {
      if (o === '+') return a + b;
      if (o === '−') return a - b;
      if (o === '×') return a * b;
      if (o === '÷') return b === 0 ? 0 : a / b;
      return b;
    }
    $$('[data-key]', calc).forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-key');
        if (k === 'C') { acc = ''; op = ''; fresh = false; }
        else if (k === '=') {
          if (op) { acc = String(Math.round(apply(Number(acc), Number(acc), op) * 100) / 100); op = ''; }
          fresh = true;
        } else if ('÷×−+'.indexOf(k) > -1) { op = k; fresh = true; }
        else {
          if (fresh || acc === '0') { acc = ''; fresh = false; }
          if (k === '.' && acc.indexOf('.') > -1) { show(); return; }
          acc += k;
        }
        show();
      });
    });
    show();
  }

  /* quiz */
  var qdata = $('#quiz-data'), qbox = $('.quiz-card');
  if (qdata && qbox) {
    var qs = [];
    try { qs = JSON.parse(qdata.textContent); } catch (err) { qs = []; }
    var qi = 0;
    var stepEl = $('[data-qstep]', qbox), qEl = $('[data-question]', qbox);
    var optsEl = $('[data-opts]', qbox), msgEl = $('[data-qmsg]', qbox), scoreEl = $('[data-qscore]', qbox);
    function renderQuestion() {
      var q = qs[qi];
      if (!q) return;
      stepEl.textContent = 'Q' + (qi + 1) + ' / ' + qs.length;
      qEl.textContent = q[0];
      optsEl.innerHTML = '';
      q[1].forEach(function (label, j) {
        var btn = document.createElement('button');
        btn.type = 'button'; btn.className = 'opt'; btn.textContent = label;
        btn.addEventListener('click', function () { answer(btn); });
        optsEl.appendChild(btn);
      });
      if (scoreEl) scoreEl.textContent = qi + ' answered';
    }
    function answer(btn) {
      btn.classList.add('is-picked');
      qi++;
      if (qi >= qs.length) {
        qEl.textContent = 'That is the end of the check-in.';
        optsEl.innerHTML = '';
        if (msgEl) msgEl.textContent = 'Thanks — nothing was submitted.';
        if (stepEl) stepEl.textContent = 'Complete';
      } else {
        if (msgEl) msgEl.textContent = 'Noted. Next one.';
        renderQuestion();
      }
    }
    renderQuestion();
  }

  /* grid state */
  var tiles = $('[data-tiles]');
  if (tiles) {
    var cells = $$('.gcell', tiles), score = 0, moves = 0;
    var scoreEl = $('[data-score]'), movesEl = $('[data-moves]');
    function paintGrid() { if (scoreEl) scoreEl.textContent = score; if (movesEl) movesEl.textContent = moves; }
    cells.forEach(function (c) {
      c.addEventListener('click', function () {
        var onNow = !c.classList.contains('is-on');
        c.classList.toggle('is-on', onNow);
        moves++; score += onNow ? 1 : -1;
        paintGrid();
      });
    });
    on($('[data-restart]'), 'click', function () {
      cells.forEach(function (c) { c.classList.remove('is-on'); });
      score = 0; moves = 0; paintGrid();
    });
  }

  /* typing test */
  var typeIn = $('[data-typein]'), target = $('[data-target]');
  if (typeIn && target) {
    var startedAt = 0;
    var wpmEl = $('[data-wpm]'), accEl = $('[data-acc]'), tmsg = $('[data-tmsg]');
    function updateTyping() {
      if (!startedAt && typeIn.value.length) startedAt = Date.now();
      var typed = typeIn.value, correct = 0;
      for (var i = 0; i < typed.length; i++) if (typed[i] === target.textContent[i]) correct++;
      var accuracy = typed.length ? Math.round(correct / typed.length * 100) : 100;
      var minutes = Math.max((Date.now() - startedAt) / 60000, 0.02);
      if (accEl) accEl.textContent = accuracy;
      if (wpmEl) wpmEl.textContent = Math.round(correct / 5 / minutes);
      if (tmsg) tmsg.textContent = accuracy < 90 && typed.length > 8 ? 'Slow down a little.' : '';
    }
    typeIn.addEventListener('input', updateTyping);
    on($('[data-treset]'), 'click', function () {
      typeIn.value = ''; startedAt = 0; updateTyping(); typeIn.focus();
    });
  }

  /* servings */
  var serv = $('[data-servings]');
  on(serv, 'input', function () { var o = $('[data-serv-out]'); if (o) o.textContent = serv.value; });

  /* chat */
  var chatForm = $('[data-chat-form]');
  on(chatForm, 'submit', function (e) {
    e.preventDefault();
    var input = $('[data-chat-in]'), log = $('[data-log]');
    if (!input.value.trim()) return;
    var box = document.createElement('div');
    box.className = 'msg me';
    var p = document.createElement('p');
    p.textContent = input.value.trim();
    var span = document.createElement('span');
    span.className = 'mono small';
    span.textContent = 'you';
    box.appendChild(p); box.appendChild(span); log.appendChild(box);
    input.value = ''; log.scrollTop = log.scrollHeight;
  });

  /* carousel — instant swaps */
  var car = $('[data-carousel]');
  if (car) {
    var slides = $$('[data-slide]', car), dots = $$('[data-dot]', car), si = 0;
    function go(n) {
      si = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle('is-active', i === si); });
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === si); });
    }
    on($('[data-prev]', car), 'click', function () { go(si - 1); });
    on($('[data-next]', car), 'click', function () { go(si + 1); });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i); }); });
    go(0);
  }

  /* session timer */
  var timerVal = $('[data-timer]');
  if (timerVal) {
    var total = Number(timerVal.getAttribute('data-timer')), left = total, handle = null;
    function paintTimer() {
      timerVal.textContent = String(Math.floor(left / 60)).padStart(2, '0') + ':' + String(left % 60).padStart(2, '0');
    }
    paintTimer();
    on($('[data-start]'), 'click', function () {
      if (handle) return;
      handle = setInterval(function () {
        left = Math.max(0, left - 1); paintTimer();
        if (!left) { clearInterval(handle); handle = null; }
      }, 1000);
    });
    on($('[data-pause]'), 'click', function () { clearInterval(handle); handle = null; });
    on($('[data-reset]'), 'click', function () { clearInterval(handle); handle = null; left = total; paintTimer(); });
  }

  /* live countdown */
  var root = $('[data-countdown-root]');
  if (root) {
    var end = new Date(root.getAttribute('data-until')).getTime();
    function tickCountdown() {
      var n = Math.max(0, end - Date.now());
      var vals = { d: Math.floor(n / 864e5), h: Math.floor(n / 36e5) % 24, m: Math.floor(n / 6e4) % 60, s: Math.floor(n / 1e3) % 60 };
      Object.keys(vals).forEach(function (k) {
        var el = $('[data-cd="' + k + '"]', root);
        if (el) el.textContent = String(vals[k]).padStart(2, '0');
      });
    }
    tickCountdown(); setInterval(tickCountdown, 1000);
  }

  /* clock display */
  var clock = $('[data-clock]');
  if (clock && /^\d{2}:\d{2}$/.test(clock.textContent)) {
    var paintClock = function () {
      var now = new Date();
      clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      var d = $('[data-date]');
      if (d) d.textContent = now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
    };
    paintClock(); setInterval(paintClock, 20000);
  }

  /* toc highlight */
  var tocLinks = $$('[data-toc]');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        tocLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-15% 0px -70% 0px' });
    tocLinks.forEach(function (a) {
      var t = $(a.getAttribute('href')) || (a.getAttribute('href') === '#top' ? $('.sec-hero') : null);
      if (t) io.observe(t);
    });
  }
  $$('[data-toc]').forEach(function (a) {
    a.addEventListener('click', function () {
      $$('[data-toc]').forEach(function (x) { x.classList.remove('is-active'); });
      a.classList.add('is-active');
    });
  });
})();
