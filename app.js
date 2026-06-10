// Truvra — shared interactions
// ---------------------------------------------------------------------------
// FORM_ENDPOINT: paste your form handler URL here to make the forms live.
// Works with Formspree ("https://formspree.io/f/xxxxxx"), Basin, Web3Forms,
// or any endpoint that accepts a POST with form fields. Leave empty ("") and
// the forms confirm locally without sending (pre-launch mode).
var FORM_ENDPOINT = "";
// ---------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function () {

  // ---- mobile nav ----
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () { links.classList.toggle('open'); });
  }

  // ---- scroll reveal (progressive enhancement; content visible without JS) ----
  document.documentElement.classList.add('js-reveal');
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }

  // ---- forms ----
  document.querySelectorAll('form[data-prelaunch]').forEach(function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var btn = form.querySelector('button[type=submit]');
      var first = (form.querySelector('[name=name]') || {}).value || 'there';
      first = String(first).split(' ')[0].replace(/[<>]/g, '');

      function confirmUI() {
        var wrap = form.parentElement;
        form.style.display = 'none';
        var ok = document.createElement('div');
        ok.setAttribute('role', 'status');
        ok.style.textAlign = 'center';
        ok.style.padding = '14px 4px';
        var head = document.createElement('div');
        head.style.cssText = 'font-family:Fraunces,serif;font-size:24px;color:#0B5F57;margin-bottom:8px';
        head.textContent = 'Thanks, ' + first + ' — you’re on the list.'; // textContent: no HTML injection
        var sub = document.createElement('p');
        sub.style.cssText = 'color:#4E5A6B;font-size:15px';
        sub.innerHTML = 'We’ll be in touch from <strong>hello@truvra.ai</strong>.';
        ok.appendChild(head);
        ok.appendChild(sub);
        wrap.appendChild(ok);
      }

      if (!FORM_ENDPOINT) { confirmUI(); return; }

      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      }).then(function (r) {
        if (r.ok) { confirmUI(); }
        else { throw new Error('bad status'); }
      }).catch(function () {
        if (btn) { btn.disabled = false; btn.textContent = 'Try again'; }
        alert('Something went wrong sending the form. Please email hello@truvra.ai and we’ll follow up.');
      });
    });
  });

  // ---- cookie consent (privacy-first: nothing non-essential until accepted) ----
  var banner = document.querySelector('.cookie');
  if (banner) {
    var stored = null;
    try { stored = localStorage.getItem('truvra_consent'); } catch (e) {}
    if (!stored) { banner.classList.add('show'); }
    function setConsent(v) {
      try { localStorage.setItem('truvra_consent', v); } catch (e) {}
      banner.classList.remove('show');
      window.truvraConsent = v;
      // if (v === 'granted') { /* load analytics here */ }
    }
    var acc = banner.querySelector('[data-accept]');
    var dec = banner.querySelector('[data-decline]');
    if (acc) acc.addEventListener('click', function () { setConsent('granted'); });
    if (dec) dec.addEventListener('click', function () { setConsent('denied'); });
  }
});
