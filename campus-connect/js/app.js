/* ============================================================
   app.js — Campus Connect Client Side
   ============================================================ */

$(document).ready(function () {

  /* ─── LIVE DATA ──────────────────────────────────────── */
  var LiveData = Storage.load();

  window.addEventListener('storage', function(e) {
    if (e.key === 'campusconnect_data') {
      LiveData = Storage.load();
      refreshAll();
    }
  });

  function refreshAll() {
    renderEvents('all');
    $('.tab-btn').removeClass('active').filter('[data-filter="all"]').addClass('active');
    renderPrograms($('#programs-container'));
    renderContacts();
    renderHome();
  }

  /* ─── NAVIGATION ─────────────────────────────────────── */
  var VALID_PAGES = ['home', 'events', 'programs', 'contacts', 'program-detail'];

  function showPage(pageId) {
    if (!VALID_PAGES.includes(pageId)) pageId = 'home';

    // Hide all, show target
    $('.page').removeClass('active');
    $('#page-' + pageId).addClass('active');

    // Animate only dynamically-rendered .fade-in children (not static HTML wrappers)
    // Skip program-detail page since its content is pre-existing HTML, not re-rendered
    if (pageId !== 'program-detail') {
      $('#page-' + pageId).find('.fade-in').each(function(i) {
        var el = this;
        $(el).css('animation', 'none');
        // Force reflow then restore
        void el.offsetHeight;
        $(el).css({ 'animation': '', 'animation-delay': (i * 0.07) + 's' });
      });
    } else {
      // For detail page: simple fade in on the whole section
      $('#page-program-detail').css({ opacity: 0 });
      setTimeout(function() {
        $('#page-program-detail').css({ opacity: 1, transition: 'opacity 0.3s ease' });
      }, 10);
    }

    // Update nav highlight
    var navPage = (pageId === 'program-detail') ? 'programs' : pageId;
    $('.nav-links a, .footer-links a').removeClass('active');
    $('a[data-page="' + navPage + '"]').addClass('active');

    // Update URL (not for detail sub-page)
    if (pageId !== 'program-detail') {
      history.pushState(null, '', '#' + pageId);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    $('#hamburger').removeClass('open');
    $('.nav-links').removeClass('open');
  }

  /* ─── CLICK HANDLERS ─────────────────────────────────── */

  // Standard nav links — skip .view-link
  $(document).on('click', 'a[data-page]', function(e) {
    if ($(this).hasClass('view-link')) return;
    e.preventDefault();
    var page = $(this).data('page');
    if (page) showPage(page);
  });

  // Quick-card divs and buttons with data-page
  $(document).on('click', '.qcard, button[data-page]', function(e) {
    e.preventDefault();
    var page = $(this).data('page');
    if (page) showPage(page);
  });

  // View Program button
  $(document).on('click', '.view-link', function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    var progId = parseInt($(this).data('prog-id'));
    var prog = null;
    for (var i = 0; i < LiveData.programs.length; i++) {
      if (LiveData.programs[i].id === progId) { prog = LiveData.programs[i]; break; }
    }
    if (prog) showProgramDetail(prog);
  });

  // Back to Programs
  $(document).on('click', '#back-to-programs', function(e) {
    e.preventDefault();
    showPage('programs');
  });

  // Browser back/forward
  $(window).on('hashchange', function() {
    showPage(window.location.hash.replace('#', '') || 'home');
  });

  // Mobile hamburger
  $('#hamburger').on('click', function() {
    $(this).toggleClass('open');
    $('.nav-links').toggleClass('open');
  });

  /* ─── ICONS ──────────────────────────────────────────── */
  var calIcon   = '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
  var clockIcon = '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
  var pinIcon   = '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>';
  var mailIcon  = '<svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>';
  var phoneIcon = '<svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.82a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l.36-.36a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>';
  var roomIcon  = '<svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>';

  /* ─── EVENT CARDS ────────────────────────────────────── */
  function buildEventCard(ev, delay) {
    var badgeClass = ev.type === 'activity' ? 'badge-activity' : 'badge-academic';
    var badgeLabel = ev.type === 'activity' ? 'Activity' : 'Academic';
    var featured   = ev.featured ? '<div class="featured-label">Featured Event</div>' : '';
    return '<div class="event-card fade-in" style="animation-delay:' + delay + 's">'
      + '<div class="event-card-top">'
      + featured
      + '<span class="event-badge ' + badgeClass + '">' + badgeLabel + '</span>'
      + '<h3>' + ev.title + '</h3>'
      + '<p>' + ev.desc + '</p>'
      + '</div>'
      + '<div class="event-card-bottom">'
      + '<div class="event-meta">' + calIcon + ' ' + ev.date + '</div>'
      + '<div class="event-meta">' + clockIcon + ' ' + ev.time + '</div>'
      + '<div class="event-meta">' + pinIcon + ' ' + ev.venue + '</div>'
      + '</div></div>';
  }

  /* ─── RENDER EVENTS ──────────────────────────────────── */
  function renderEvents(filter) {
    var $c = $('#events-container').empty();
    var list = filter === 'all'
      ? LiveData.events
      : LiveData.events.filter(function(e) { return e.type === filter; });
    if (!list.length) {
      $c.html('<p style="color:var(--muted);padding:20px 0">No events found.</p>');
      return;
    }
    list.forEach(function(ev, i) { $c.append(buildEventCard(ev, i * 0.08)); });
  }

  $(document).on('click', '.tab-btn', function() {
    $('.tab-btn').removeClass('active');
    $(this).addClass('active');
    renderEvents($(this).data('filter'));
  });

  /* ─── RENDER PROGRAMS ────────────────────────────────── */
  function renderPrograms($container, limit) {
    $container.empty();
    var list = limit ? LiveData.programs.slice(0, limit) : LiveData.programs;
    list.forEach(function(prog, i) {
      var html = '<div class="prog-card fade-in" style="animation-delay:' + (i * 0.08) + 's">'
        + '<div class="prog-logo-wrap">'
        + '<img src="' + prog.logo + '" alt="' + prog.abbr + '" class="prog-logo"'
        + ' onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">'
        + '<div class="prog-abbr-fallback" style="display:none">' + prog.abbr + '</div>'
        + '</div>'
        + '<div class="prog-abbr">' + prog.abbr + '</div>'
        + '<h3>' + prog.name + '</h3>'
        + '<button class="view-link" data-prog-id="' + prog.id + '">View Program &#8594;</button>'
        + '</div>';
      $container.append(html);
    });
  }

  /* ─── PROGRAM DETAIL ─────────────────────────────────── */
  function showProgramDetail(prog) {
    // Populate all fields FIRST, then show the page
    $('#detail-logo')
      .attr('src', prog.logo)
      .attr('alt', prog.abbr)
      .show();
    $('#detail-logo-fallback').text(prog.abbr).hide();

    $('#detail-abbr').text(prog.abbr);
    $('#detail-name').text(prog.name);
    $('#detail-dept').text(prog.department || '');
    $('#detail-duration').text(prog.duration || '');
    $('#detail-units').text(prog.units || '');
    $('#detail-head').text('Head: ' + (prog.head || ''));
    $('#detail-description').text(prog.description || '');

    var $hl = $('#detail-highlights').empty();
    (prog.highlights || []).forEach(function(h) {
      $hl.append('<li>' + h + '</li>');
    });

    var $ca = $('#detail-careers').empty();
    (prog.careers || []).forEach(function(c) {
      $ca.append('<li>' + c + '</li>');
    });

    // Show page AFTER content is ready
    showPage('program-detail');
  }

  /* ─── RENDER CONTACTS ────────────────────────────────── */
  function renderContacts() {
    var $c = $('#contacts-container').empty();
    LiveData.contacts.forEach(function(contact, i) {
      var parts    = contact.name.replace(/^(Ms\.|Mr\.)\s*/, '').trim().split(' ');
      var initials = parts.map(function(p) { return p[0]; }).slice(0, 2).join('');
      $c.append('<div class="contact-card fade-in" style="animation-delay:' + (i * 0.08) + 's">'
        + '<div class="contact-avatar">' + initials + '</div>'
        + '<h3>' + contact.name + '</h3>'
        + '<div class="contact-role">' + contact.role + '</div>'
        + '<div class="contact-dept">' + contact.dept + '</div>'
        + '<div class="contact-info">'
        + '<a href="mailto:' + contact.email + '">' + mailIcon + ' ' + contact.email + '</a>'
        + '<a href="tel:' + contact.phone + '">' + phoneIcon + ' ' + contact.phone + '</a>'
        + '<span>' + roomIcon + ' ' + contact.room + '</span>'
        + '</div></div>');
    });
  }

  /* ─── RENDER HOME ────────────────────────────────────── */
  function renderHome() {
    var $evPrev = $('#home-events-preview').empty();
    LiveData.events.forEach(function(ev, i) {
      $evPrev.append(buildEventCard(ev, i * 0.1));
    });
    renderPrograms($('#home-programs-preview'), 5);
  }

  /* ─── INIT ───────────────────────────────────────────── */
  refreshAll();
  var initHash = window.location.hash.replace('#', '') || 'home';
  showPage(initHash);

});
