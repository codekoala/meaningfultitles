// ==UserScript==
// @name           Meaningful Page Titles
// @namespace      DERPPP
// @description    Changes some page titles to be more meaningful on certain web pages
// @include        http://*
// ==/UserScript==

MeaningfulTitles = {
  PATTERN_WITH_DID: '($(last2)$) DID: $(did)$ - $(page_title)$ | ',
  PATTERN_NO_DID: '($(last2)$) $(page_title)$ | ',

  DID_RE: new RegExp(/did=(\d+)/),
  AID_RE: new RegExp(/app_id=(\d+)/),
  PAGE_RE: new RegExp(/exec=([\w_]+)/),
  ACT_RE: new RegExp(/act=([\w_]+)/),

  PAGES: {
    // Performance
    'device_summary': 'Summary',
    'availability': 'Performance',
    'device_inventory': 'Profile',
    'device_map': 'Topology',
    'device_logging': 'Logs',
    'device_events': 'Events',
    'device_ticket_history_view': 'Tickets',
    'configuration': {
      'dynamic_app_status_report': 'AID: $(aid)$ Report'
    },

    // Properties
    'device_details': 'Properties',
    'device_thresholds': 'Thresholds',
    'device_collections': 'Collections',
    'device_policies': 'Monitors',
    'device_maint_management': 'Schedule',
    'device_logs': 'Logs',
    'device_tools': 'Toolbox',
    'device_interfaces_admin': 'Interfaces',
    'device_relationships': 'Relationships',
    'device_ticket_history_admin': 'Tickets',
    'device_log_redirect': 'Redirects',
    'device_notes': 'Notes',

    // Registry
    'registry': {
      'registry_device_management': 'Registry',
      'registry_device_component': 'Component Registry'
    },

    // System
    'admin': {
      'admin_dynamic_app': 'Dynamic Apps',
      'admin_credentials': 'Credentials',
      'admin_auto_discovery_ipv6': 'Discovery',
      'admin_powerpack': 'Power-Packs',
      'admin_processes': 'Processes',
      'admin_system_updates': 'Patches',
      'admin_system_messages': 'System Log'
    },

    // DAs
    'admin_dynamic_app_editor': 'AID: $(aid)$ Properties',
    'admin_dynamic_app_objects': 'AID: $(aid)$ Collection Objects',
    'admin_dynamic_app_snippets': 'AID: $(aid)$ Snippets',
    'admin_dynamic_app_thresh': 'AID: $(aid)$ Thresholds',
    'admin_dynamic_app_alerts': 'AID: $(aid)$ Alerts'
  },

  did: null,
  aid: null,
  page_title: null,

  getDID: function () {
    /**
     * Retrieves a device's ID from the URL, if possible
     **/

    match = this.DID_RE.exec(document.URL);
    if (match) {
      this.did = match[1];
    }

    return this.did;
  },

  getAID: function () {
    /**
     * Retrieves a DA's ID from the URL, if possible
     **/

    match = this.AID_RE.exec(document.URL);
    if (match) {
      this.aid = match[1];
    }

    return this.aid;
  },

  getPageTitle: function () {
    /**
     * Returns a more useful name for a page based on its "exec" parameter
     **/

     val = '?';
     match = this.PAGE_RE.exec(document.URL);

     if (match) {
       val = this.PAGES[match[1]];
       if (typeof(val) !== 'string') {
         act_match = this.ACT_RE.exec(document.URL);
         if (act_match) {
           val = val[act_match[1]];
         }
       }

       this.page_title = typeof(val) !== 'string' ? match[1].toTitleCase() : val;
     }

     return this.page_title;
  },

  getLastTwo: function () {
    /**
     * Attempts to get the last two octets of an IP address, falling back to
     * the domain name if we're not using an IP address
     **/

    octets = document.domain.split('.');
    return octets.length == 4 ? octets[2]+'.'+octets[3] : document.domain;
  },

  apply: function () {
    // See if the script should apply to this page
    if (document.URL.indexOf('index.em7') == -1) return;

    this.getDID();
    this.getPageTitle();

    prefix = this.did ? this.PATTERN_WITH_DID : this.PATTERN_NO_DID;
    prefix = prefix.replace('$(did)$', this.did)
    prefix = prefix.replace('$(page_title)$', this.page_title);
    prefix = prefix.replace('$(last2)$', this.getLastTwo());
    prefix = prefix.replace('$(aid)$', this.getAID());

    document.title = prefix + document.title;
  }
}

String.prototype.toTitleCase = function () {
  var a = this.replace(/_/g, ' ').split(' ');
  var b = [];

  for (var i = 0; a[i] !== undefined; i++) {
    b[b.length] = a[i].substr(0, 1).toUpperCase() + a[i].substr(1);
  }
  return b.join(' ');
}

MeaningfulTitles.apply()
