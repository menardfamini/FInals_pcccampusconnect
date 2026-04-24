/* ============================================================
   admin.js — Campus Connect Admin Panel
   All edits saved to localStorage → client side reads live
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ─── STATE ─────────────────────────────────────────── */
  let adminData = Storage.load();
  let editingType   = null; // 'event' | 'contact'
  let editingIndex  = -1;   // -1 = new record

  /* ─── SAVE + BROADCAST ───────────────────────────────── */
  function saveAndBroadcast() {
    Storage.save({ events: adminData.events, contacts: adminData.contacts });
    updateStats();
    renderDashboardEvents();
    showToast('Changes saved and published to website!');
  }

  /* ─── NAVIGATION ─────────────────────────────────────── */
  const sections  = document.querySelectorAll('.section');
  const navItems  = document.querySelectorAll('.nav-item');
  const topbarTitle = document.getElementById('topbar-title');

  function showSection(name) {
    sections.forEach(s => s.classList.remove('active'));
    navItems.forEach(n => n.classList.remove('active'));
    const $sec = document.getElementById('section-' + name);
    const $nav = document.querySelector('.nav-item[data-section="' + name + '"]');
    if ($sec) $sec.classList.add('active');
    if ($nav) $nav.classList.add('active');
    topbarTitle.textContent = name.charAt(0).toUpperCase() + name.slice(1);
    // Refresh table if needed
    if (name === 'events')   renderEventsTable();
    if (name === 'contacts') renderContactsTable();
  }

  navItems.forEach(function (n) {
    n.addEventListener('click', function (e) {
      e.preventDefault();
      showSection(this.dataset.section);
    });
  });

  document.querySelectorAll('[data-goto]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      showSection(this.dataset.goto);
    });
  });

  // Mobile sidebar toggle
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  sidebarToggle.addEventListener('click', function () {
    sidebar.classList.toggle('open');
  });
  document.addEventListener('click', function (e) {
    if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });

  /* ─── STATS ──────────────────────────────────────────── */
  function updateStats() {
    document.getElementById('stat-events').textContent   = adminData.events.length;
    document.getElementById('stat-contacts').textContent = adminData.contacts.length;
    document.getElementById('stat-programs').textContent = CampusData.programs.length;
  }

  /* ─── DASHBOARD EVENTS LIST ──────────────────────────── */
  function renderDashboardEvents() {
    const $list = document.getElementById('dashboard-events-list');
    $list.innerHTML = '';
    if (!adminData.events.length) {
      $list.innerHTML = '<p style="color:var(--muted);font-size:.85rem">No events yet.</p>';
      return;
    }
    adminData.events.forEach(function (ev) {
      const row = document.createElement('div');
      row.className = 'recent-event-row';
      row.innerHTML = `
        <div class="rev-dot" style="background:${ev.type === 'activity' ? 'var(--yellow)' : 'var(--accent)'}"></div>
        <div>
          <div class="rev-title">${ev.title}</div>
          <div class="rev-meta">${ev.date} &nbsp;·&nbsp; ${ev.venue}</div>
        </div>`;
      $list.appendChild(row);
    });
  }

  /* ─── EVENTS TABLE ───────────────────────────────────── */
  function renderEventsTable() {
    const $tbody = document.getElementById('events-tbody');
    $tbody.innerHTML = '';
    if (!adminData.events.length) {
      $tbody.innerHTML = '<tr><td colspan="6" style="color:var(--muted);text-align:center;padding:30px">No events. Click "Add Event" to create one.</td></tr>';
      return;
    }
    adminData.events.forEach(function (ev, i) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${ev.title}</strong></td>
        <td>${ev.date}</td>
        <td>${ev.time}</td>
        <td>${ev.venue}</td>
        <td><span class="type-badge type-${ev.type}">${ev.type}</span></td>
        <td>
          <div class="action-btns">
            <button class="btn-edit"   data-type="event" data-idx="${i}">Edit</button>
            <button class="btn-delete" data-type="event" data-idx="${i}">Delete</button>
          </div>
        </td>`;
      $tbody.appendChild(tr);
    });
  }

  /* ─── CONTACTS TABLE ─────────────────────────────────── */
  function renderContactsTable() {
    const $tbody = document.getElementById('contacts-tbody');
    $tbody.innerHTML = '';
    if (!adminData.contacts.length) {
      $tbody.innerHTML = '<tr><td colspan="6" style="color:var(--muted);text-align:center;padding:30px">No contacts. Click "Add Contact" to create one.</td></tr>';
      return;
    }
    adminData.contacts.forEach(function (c, i) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${c.name}</strong></td>
        <td>${c.dept}</td>
        <td><a href="mailto:${c.email}" style="color:var(--accent);text-decoration:none">${c.email}</a></td>
        <td>${c.phone}</td>
        <td>${c.room}</td>
        <td>
          <div class="action-btns">
            <button class="btn-edit"   data-type="contact" data-idx="${i}">Edit</button>
            <button class="btn-delete" data-type="contact" data-idx="${i}">Delete</button>
          </div>
        </td>`;
      $tbody.appendChild(tr);
    });
  }

  /* ─── TABLE ACTION DELEGATION ────────────────────────── */
  document.getElementById('events-tbody').addEventListener('click', handleTableClick);
  document.getElementById('contacts-tbody').addEventListener('click', handleTableClick);

  function handleTableClick(e) {
    const btn = e.target.closest('.btn-edit, .btn-delete');
    if (!btn) return;
    const type = btn.dataset.type;
    const idx  = parseInt(btn.dataset.idx);
    if (btn.classList.contains('btn-edit')) {
      openModal(type, idx);
    } else if (btn.classList.contains('btn-delete')) {
      if (confirm('Are you sure you want to delete this ' + type + '?')) {
        if (type === 'event')   adminData.events.splice(idx, 1);
        if (type === 'contact') adminData.contacts.splice(idx, 1);
        saveAndBroadcast();
        if (type === 'event')   renderEventsTable();
        if (type === 'contact') renderContactsTable();
        showToast((type === 'event' ? 'Event' : 'Contact') + ' deleted.');
      }
    }
  }

  /* ─── ADD BUTTONS ────────────────────────────────────── */
  document.getElementById('btn-add-event').addEventListener('click', function () {
    openModal('event', -1);
  });
  document.getElementById('btn-add-contact').addEventListener('click', function () {
    openModal('contact', -1);
  });

  /* ─── MODAL ──────────────────────────────────────────── */
  const modalOverlay = document.getElementById('modal-overlay');
  const modalTitle   = document.getElementById('modal-title');
  const modalForm    = document.getElementById('modal-form');
  const modalClose   = document.getElementById('modal-close');
  const modalCancel  = document.getElementById('modal-cancel');
  const modalSave    = document.getElementById('modal-save');

  function openModal(type, idx) {
    editingType  = type;
    editingIndex = idx;
    const isNew  = idx === -1;

    if (type === 'event') {
      const ev = isNew ? { title:'', desc:'', date:'', time:'', venue:'', type:'activity', featured:false } : adminData.events[idx];
      modalTitle.textContent = isNew ? 'Add New Event' : 'Edit Event';
      modalForm.innerHTML = `
        <div class="form-group">
          <label>Title *</label>
          <input type="text" id="f-title" value="${escHtml(ev.title)}" placeholder="Event title" required/>
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea id="f-desc" placeholder="Describe the event...">${escHtml(ev.desc)}</textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Date *</label>
            <input type="text" id="f-date" value="${escHtml(ev.date)}" placeholder="e.g. Monday, February 9, 2026" required/>
          </div>
          <div class="form-group">
            <label>Time *</label>
            <input type="text" id="f-time" value="${escHtml(ev.time)}" placeholder="e.g. 8am – 6pm" required/>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Venue *</label>
            <input type="text" id="f-venue" value="${escHtml(ev.venue)}" placeholder="e.g. Crowned Jewel" required/>
          </div>
          <div class="form-group">
            <label>Type</label>
            <select id="f-type">
              <option value="activity" ${ev.type==='activity'?'selected':''}>Activity</option>
              <option value="academic" ${ev.type==='academic'?'selected':''}>Academic</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label style="flex-direction:row;align-items:center;gap:8px;cursor:pointer">
            <input type="checkbox" id="f-featured" ${ev.featured?'checked':''} style="width:auto;cursor:pointer"/>
            Mark as Featured Event
          </label>
        </div>`;
    }

    if (type === 'contact') {
      const c = isNew ? { name:'', dept:'', role:'Program Head', email:'', phone:'', room:'' } : adminData.contacts[idx];
      modalTitle.textContent = isNew ? 'Add New Contact' : 'Edit Contact';
      modalForm.innerHTML = `
        <div class="form-row">
          <div class="form-group">
            <label>Full Name *</label>
            <input type="text" id="f-name" value="${escHtml(c.name)}" placeholder="e.g. Ms. Jane Doe" required/>
          </div>
          <div class="form-group">
            <label>Role</label>
            <input type="text" id="f-role" value="${escHtml(c.role)}" placeholder="e.g. Program Head"/>
          </div>
        </div>
        <div class="form-group">
          <label>Department *</label>
          <input type="text" id="f-dept" value="${escHtml(c.dept)}" placeholder="e.g. BSIT – Information Technology" required/>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Email *</label>
            <input type="email" id="f-email" value="${escHtml(c.email)}" placeholder="email@example.com" required/>
          </div>
          <div class="form-group">
            <label>Phone</label>
            <input type="text" id="f-phone" value="${escHtml(c.phone)}" placeholder="09xxxxxxxxx"/>
          </div>
        </div>
        <div class="form-group">
          <label>Room</label>
          <input type="text" id="f-room" value="${escHtml(c.room)}" placeholder="e.g. Room 401"/>
        </div>`;
    }

    modalOverlay.classList.add('open');
    // Focus first input
    setTimeout(function () {
      const first = modalForm.querySelector('input, select, textarea');
      if (first) first.focus();
    }, 50);
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    modalForm.innerHTML = '';
    editingType = null; editingIndex = -1;
  }

  modalClose.addEventListener('click', closeModal);
  modalCancel.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) closeModal();
  });

  /* ─── SAVE MODAL ─────────────────────────────────────── */
  modalSave.addEventListener('click', function () {
    if (editingType === 'event') {
      const title = document.getElementById('f-title').value.trim();
      const date  = document.getElementById('f-date').value.trim();
      const time  = document.getElementById('f-time').value.trim();
      const venue = document.getElementById('f-venue').value.trim();
      if (!title || !date || !time || !venue) { showToast('Please fill in all required fields.', true); return; }
      const ev = {
        id:       editingIndex === -1 ? Date.now() : adminData.events[editingIndex].id,
        title:    title,
        desc:     document.getElementById('f-desc').value.trim(),
        date:     date,
        time:     time,
        venue:    venue,
        type:     document.getElementById('f-type').value,
        featured: document.getElementById('f-featured').checked
      };
      if (editingIndex === -1) adminData.events.push(ev);
      else adminData.events[editingIndex] = ev;
      saveAndBroadcast();
      renderEventsTable();
    }

    if (editingType === 'contact') {
      const name  = document.getElementById('f-name').value.trim();
      const dept  = document.getElementById('f-dept').value.trim();
      const email = document.getElementById('f-email').value.trim();
      if (!name || !dept || !email) { showToast('Please fill in all required fields.', true); return; }
      const c = {
        id:    editingIndex === -1 ? Date.now() : adminData.contacts[editingIndex].id,
        name:  name,
        dept:  dept,
        role:  document.getElementById('f-role').value.trim() || 'Program Head',
        email: email,
        phone: document.getElementById('f-phone').value.trim(),
        room:  document.getElementById('f-room').value.trim()
      };
      if (editingIndex === -1) adminData.contacts.push(c);
      else adminData.contacts[editingIndex] = c;
      saveAndBroadcast();
      renderContactsTable();
    }

    closeModal();
  });

  // Save on Enter key in form
  modalForm.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      modalSave.click();
    }
  });

  /* ─── TOAST ──────────────────────────────────────────── */
  let toastTimer = null;
  function showToast(msg, isError) {
    const $t = document.getElementById('toast');
    $t.textContent = msg;
    $t.className = 'toast show' + (isError ? ' error' : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { $t.className = 'toast'; }, 3000);
  }

  /* ─── HELPER ─────────────────────────────────────────── */
  function escHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g,'&amp;')
      .replace(/"/g,'&quot;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;');
  }

  /* ─── INIT ───────────────────────────────────────────── */
  updateStats();
  renderDashboardEvents();
  showSection('dashboard');

  /* ─── USER STATS (from PHP/DB) ───────────────────────── */
  function timeAgo(dateStr) {
    if (!dateStr) return 'Never';
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
    if (diff < 60)    return 'Just now';
    if (diff < 3600)  return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    return Math.floor(diff / 86400) + 'd ago';
  }

  function statusBadge(lastSeen) {
    if (!lastSeen) return '<span class="status-badge status-offline">Offline</span>';
    const diff = (Date.now() - new Date(lastSeen).getTime()) / 1000;
    if (diff < 900)  return '<span class="status-badge status-online">● Online</span>';
    if (diff < 3600) return '<span class="status-badge status-recent">◑ Recent</span>';
    return '<span class="status-badge status-offline">Offline</span>';
  }

  function formatDate(d) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function loadUserStats() {
    fetch('../php/admin_users.php')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (!data.ok) return;

        // Update stat cards
        document.getElementById('stat-total-users').textContent = data.total_users;
        document.getElementById('stat-active-users').textContent = data.active_users;

        // Update Users section badges
        var ub = document.getElementById('users-count-badge');
        var ab = document.getElementById('active-count-badge');
        if (ub) ub.textContent = data.total_users + ' Students';
        if (ab) ab.textContent = data.active_users + ' Active Now';

        // Render recent users table (dashboard)
        var tbody = document.getElementById('recent-users-tbody');
        if (tbody) {
          if (!data.recent_users.length) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:24px">No students registered yet.</td></tr>';
          } else {
            tbody.innerHTML = data.recent_users.map(function(u, i) {
              return '<tr>' +
                '<td style="color:var(--muted)">' + (i + 1) + '</td>' +
                '<td style="font-weight:500">' + escHtml(u.name) + '</td>' +
                '<td style="color:var(--muted);font-size:.85rem">' + escHtml(u.email) + '</td>' +
                '<td>' + escHtml(u.strand || '—') + '</td>' +
                '<td style="font-size:.85rem">' + formatDate(u.created_at) + '</td>' +
                '<td style="font-size:.85rem;color:var(--muted)">' + timeAgo(u.last_seen) + '</td>' +
                '<td>' + statusBadge(u.last_seen) + '</td>' +
              '</tr>';
            }).join('');
          }
        }

        // Render all users table (Users section)
        var allTbody = document.getElementById('all-users-tbody');
        if (allTbody) {
          if (!data.recent_users.length) {
            allTbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:24px">No students registered yet.</td></tr>';
          } else {
            allTbody.innerHTML = data.recent_users.map(function(u, i) {
              return '<tr>' +
                '<td style="color:var(--muted)">' + (i + 1) + '</td>' +
                '<td style="font-weight:500">' + escHtml(u.name) + '</td>' +
                '<td style="color:var(--muted);font-size:.85rem">' + escHtml(u.email) + '</td>' +
                '<td>' + escHtml(u.strand || '—') + '</td>' +
                '<td style="font-size:.85rem">' + formatDate(u.created_at) + '</td>' +
                '<td style="font-size:.85rem;color:var(--muted)">' + timeAgo(u.last_seen) + '</td>' +
                '<td>' + statusBadge(u.last_seen) + '</td>' +
              '</tr>';
            }).join('');
          }
        }

        // Render activity log
        var logEl = document.getElementById('activity-log-list');
        if (logEl) {
          if (!data.activity_log.length) {
            logEl.innerHTML = '<p style="color:var(--muted);font-size:.875rem">No activity recorded yet.</p>';
          } else {
            var icons = { login: '🟢', logout: '🔴', signup: '🆕' };
            var lblClass = { login: 'lbl-login', logout: 'lbl-logout', signup: 'lbl-signup' };
            var actClass = { login: 'act-login', logout: 'act-logout', signup: 'act-signup' };
            logEl.innerHTML = '<ul class="activity-list">' +
              data.activity_log.map(function(a) {
                return '<li class="activity-item">' +
                  '<div class="activity-icon ' + (actClass[a.action] || '') + '">' + (icons[a.action] || '●') + '</div>' +
                  '<div class="activity-meta">' +
                    '<div class="activity-name">' + escHtml(a.name) + ' <span style="color:var(--muted);font-weight:400;font-size:.82rem">(' + escHtml(a.email) + ')</span></div>' +
                    '<div class="activity-time">' + timeAgo(a.logged_at) + ' &nbsp;·&nbsp; ' + formatDate(a.logged_at) + '</div>' +
                  '</div>' +
                  '<span class="activity-action-label ' + (lblClass[a.action] || '') + '">' + a.action + '</span>' +
                '</li>';
              }).join('') +
            '</ul>';
          }
        }
      })
      .catch(function() {
        // PHP/XAMPP may not be running — show graceful fallback
        var els = ['recent-users-tbody', 'all-users-tbody'];
        els.forEach(function(id) {
          var el = document.getElementById(id);
          if (el) el.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:24px">Could not load data. Make sure XAMPP is running.</td></tr>';
        });
        var log = document.getElementById('activity-log-list');
        if (log) log.innerHTML = '<p style="color:var(--muted);font-size:.875rem">Could not load activity log.</p>';
      });
  }

  // Load on boot, then auto-refresh every 30 seconds
  loadUserStats();
  setInterval(loadUserStats, 30000);

});
