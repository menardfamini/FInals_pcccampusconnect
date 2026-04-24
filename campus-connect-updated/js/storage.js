/* ============================================================
   storage.js — Shared localStorage bridge
   Admin writes here → Client reads from here
   ============================================================ */

const CC_STORAGE_KEY  = 'campusconnect_data';
const CC_LOGOS_KEY    = 'campusconnect_logos';

const Storage = {

  /* Save full data object to localStorage */
  save: function(data) {
    try {
      localStorage.setItem(CC_STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new StorageEvent('storage', {
        key: CC_STORAGE_KEY,
        newValue: JSON.stringify(data)
      }));
      return true;
    } catch(e) {
      console.error('Storage save error:', e);
      return false;
    }
  },

  /* Load saved program logos and patch CampusData in memory */
  applyLogos: function() {
    try {
      const raw = localStorage.getItem(CC_LOGOS_KEY);
      if (!raw) return;
      const logos = JSON.parse(raw);
      Object.keys(logos).forEach(function(abbr) {
        const prog = CampusData.programs.find(function(p) { return p.abbr === abbr; });
        if (prog) prog.logo = logos[abbr];
      });
    } catch(e) {
      console.error('Logo apply error:', e);
    }
  },

  /* Load data from localStorage, fallback to CampusData defaults */
  load: function() {
    /* First apply any saved logos to CampusData */
    this.applyLogos();
    try {
      const raw = localStorage.getItem(CC_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          events:   parsed.events   || CampusData.events,
          programs: CampusData.programs,
          contacts: parsed.contacts || CampusData.contacts
        };
      }
    } catch(e) {
      console.error('Storage load error:', e);
    }
    return {
      events:   CampusData.events,
      programs: CampusData.programs,
      contacts: CampusData.contacts
    };
  },

  /* Clear all stored data */
  clear: function() {
    localStorage.removeItem(CC_STORAGE_KEY);
    localStorage.removeItem(CC_LOGOS_KEY);
  }

};
