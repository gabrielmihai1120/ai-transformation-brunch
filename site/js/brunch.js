/* AI Transformation Brunch: page behaviour (no dependencies). Loaded on both pages. */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     PLACEHOLDER: send the RSVP somewhere.
     Replace the body of this function with the real call (form service,
     CRM, own endpoint). It must return a Promise that resolves on success
     and rejects on failure. Until then it only waits a moment and succeeds.
     ------------------------------------------------------------------ */
  function submitRsvp(data) {
    // e.g. return fetch('/api/rsvp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    //   .then(function (r) { if (!r.ok) throw new Error('RSVP failed'); });
    console.info('[brunch] RSVP placeholder, not sent anywhere:', data);
    return new Promise(function (resolve) { setTimeout(resolve, 400); });
  }

  var CONFIRMATION_URL = 'confirmed.html';
  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var MESSAGES = {
    email: 'Please enter a valid email address.',
    consent: 'Please agree to the T&C and Privacy Policy to reserve your place.',
    failed: 'Something went wrong. Please try again, or email us at contact@neurony.ro.'
  };

  /* Bottom "Accept invitation" button: scroll to the reserve box, then focus the email field. */
  document.querySelectorAll('[data-scroll-to]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var box = document.getElementById(link.getAttribute('data-scroll-to'));
      if (!box) return;
      e.preventDefault();
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      box.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      var field = box.querySelector('input[type=email]');
      if (field) setTimeout(function () { field.focus({ preventScroll: true }); }, reduce ? 0 : 450);
    });
  });

  /* Reserve form */
  var form = document.getElementById('rsvp-form');
  if (!form) return;
  var email = form.querySelector('#rsvp-email');
  var consent = form.querySelector('#rsvp-consent');
  var button = form.querySelector('button[type=submit]');
  var error = form.querySelector('#rsvp-error');

  function showError(msg, field) {
    error.textContent = msg; error.hidden = false;
    if (field) { field.setAttribute('aria-invalid', 'true'); field.focus(); }
  }
  function clearError() {
    error.hidden = true; error.textContent = '';
    email.removeAttribute('aria-invalid'); consent.removeAttribute('aria-invalid');
  }
  email.addEventListener('input', clearError);
  consent.addEventListener('change', clearError);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearError();
    email.value = email.value.trim();
    // checkValidity() alone accepts "name@company"; also require a dotted domain.
    if (!email.checkValidity() || !EMAIL_PATTERN.test(email.value)) return showError(MESSAGES.email, email);
    if (!consent.checked) return showError(MESSAGES.consent, consent);

    button.setAttribute('aria-busy', 'true');
    submitRsvp({ email: email.value, consent: true, event: 'ai-transformation-brunch-2026-11-17' })
      .then(showAccepted)
      .catch(function () { button.removeAttribute('aria-busy'); showError(MESSAGES.failed); });
  });

  /* Success: switch this page to its "accepted" state in place (same content as confirmed.html),
     keeping the reserve box where it was on screen so nothing jumps. */
  function showAccepted() {
    var copyTpl = document.getElementById('rsvp-done-copy');
    var boxTpl = document.getElementById('rsvp-done-box');
    var heroCopy = document.querySelector('.br-copy');
    var box = document.getElementById('br-reserve');
    if (!copyTpl || !boxTpl || !heroCopy || !box) { window.location.href = CONFIRMATION_URL; return; }

    var topBefore = box.getBoundingClientRect().top;
    var done = boxTpl.content.firstElementChild.cloneNode(true);
    heroCopy.replaceChildren(copyTpl.content.cloneNode(true));
    form.replaceWith(done);
    var bottomCta = document.querySelector('.br-bottom-cta');
    if (bottomCta) bottomCta.remove();

    // The new headline text is shorter, which pulls the box up; scroll by the same amount to hold it still.
    var shift = box.getBoundingClientRect().top - topBefore;
    if (shift) window.scrollBy({ top: shift, behavior: 'instant' });

    // Move focus off the removed button onto the message, so keyboard and screen-reader users land on it.
    done.setAttribute('tabindex', '-1');
    done.focus({ preventScroll: true });

    // A reload, or a shared link, now shows the confirmation too.
    document.title = 'Invitation accepted · ' + document.title;
    try { history.replaceState(null, '', CONFIRMATION_URL); } catch (err) { /* file:// and the like */ }
  }
})();
