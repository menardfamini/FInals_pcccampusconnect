/* ============================================================
   auth-nav.js — Inject Login / Profile button into navbar
   Drop this file in /js/ and include it in any page that
   has <div id="auth-nav-slot"></div> in the <nav>.
   ============================================================ */

(function () {
  'use strict';

  var slot = document.getElementById('auth-nav-slot');
  if (!slot) return;

  /* Shared styles injected once */
  var style = document.createElement('style');
  style.textContent = [
    '.auth-nav-btn {',
    '  display: inline-flex; align-items: center; gap: 6px;',
    '  padding: 7px 16px; border-radius: 50px;',
    '  font-size: .82rem; font-weight: 600; letter-spacing: .03em;',
    '  text-decoration: none; cursor: pointer; border: none;',
    '  font-family: "DM Sans", sans-serif;',
    '  transition: opacity .2s, transform .2s;',
    '}',
    '.auth-nav-btn:hover { opacity: .85; transform: translateY(-1px); }',
    '.auth-nav-login {',
    '  background: var(--accent); color: #fff;',
    '}',
    '.auth-nav-profile {',
    '  background: rgba(79,142,247,.14);',
    '  border: 1px solid rgba(79,142,247,.35) !important;',
    '  color: var(--accent);',
    '}',
    '.auth-nav-avatar {',
    '  width: 26px; height: 26px; border-radius: 50%;',
    '  background: rgba(79,142,247,.25);',
    '  display: inline-flex; align-items: center; justify-content: center;',
    '  font-size: .72rem; font-weight: 700; color: var(--accent);',
    '}'
  ].join('\n');
  document.head.appendChild(style);

  function initials(name) {
    if (!name) return '?';
    return name.split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
  }

  function render() {
    var raw = localStorage.getItem('cc_user');
    var user = null;
    try { user = raw ? JSON.parse(raw) : null; } catch (e) {}

    slot.innerHTML = '';

    if (user && user.name) {
      /* Profile button */
      var profileBtn = document.createElement('a');
      profileBtn.href = 'profile.html';
      profileBtn.className = 'auth-nav-btn auth-nav-profile';
      profileBtn.innerHTML =
        '<span class="auth-nav-avatar">' + initials(user.name) + '</span>' +
        user.name.split(' ')[0]; /* First name only */
      slot.appendChild(profileBtn);
    } else {
      /* Login button */
      var loginBtn = document.createElement('a');
      loginBtn.href = 'login.html';
      loginBtn.className = 'auth-nav-btn auth-nav-login';
      loginBtn.textContent = 'Log In';
      slot.appendChild(loginBtn);
    }
  }

  render();

  /* Re-render if another tab logs in/out */
  window.addEventListener('storage', function (e) {
    if (e.key === 'cc_user') render();
  });
})();
