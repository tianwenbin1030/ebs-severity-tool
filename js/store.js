/*
 * store.js — shared case-library storage layer.
 *
 * Backed by a GitHub repository (cases.json) when APP_CONFIG.github is
 * configured with a token. Falls back to localStorage when:
 *   - no token / config is present (offline mode), or
 *   - the network or GitHub API is unreachable.
 *
 * Concurrency: last-write-wins with a single 409-conflict retry that merges
 * remote-only cases back in (by id) before re-pushing. Good enough for a
 * small team editing infrequently.
 *
 * Exposes: window.CaseStore with .init(), .persist(cases), .cached(),
 * .status, .onStatus(cb), .lastSyncAt.
 */
(function () {
  'use strict';

  var LS_KEY = 'severityToolCasesV1';      // shared with app.js
  var LS_META = 'severityToolCasesMetaV1'; // { sha, lastSyncAt }

  function cfg() {
    return (window.APP_CONFIG && window.APP_CONFIG.github) || null;
  }
  function enabled() {
    var c = cfg();
    return !!(c && c.owner && c.repo && c.token);
  }

  function apiBase() {
    var c = cfg();
    return 'https://api.github.com/repos/' + c.owner + '/' + c.repo +
      '/contents/' + encodeURIComponent(c.casesPath || 'cases.json');
  }
  function authHeaders() {
    return {
      'Authorization': 'Bearer ' + cfg().token,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    };
  }

  /* ---- localStorage helpers (shared cache) ---- */
  function lsGet() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }
  function lsSet(arr) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(arr)); } catch (e) { /* quota */ }
  }
  function lsMeta() {
    try { return JSON.parse(localStorage.getItem(LS_META) || '{}'); } catch (e) { return {}; }
  }
  function lsMetaSet(m) {
    try { localStorage.setItem(LS_META, JSON.stringify(m)); } catch (e) { /* ignore */ }
  }

  /* ---- base64 <-> UTF-8 ---- */
  function decodeContent(b64) {
    try {
      var bin = atob(String(b64 || '').replace(/\n/g, ''));
      var bytes = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      return new TextDecoder('utf-8').decode(bytes);
    } catch (e) { return ''; }
  }
  function encodeContent(str) {
    var bytes = new TextEncoder().encode(str);
    var bin = '';
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }

  /* ---- remote fetch / push ---- */
  async function fetchRemote() {
    var branch = (cfg().branch) || 'main';
    var res = await fetch(apiBase() + '?ref=' + encodeURIComponent(branch), { headers: authHeaders() });
    if (res.status === 404) return { cases: [], sha: null }; // no file yet
    if (!res.ok) throw new Error('github http ' + res.status);
    var data = await res.json();
    var sha = data.sha;
    var cases = [];
    if (data.content) {
      var text = decodeContent(data.content);
      var parsed = null;
      try { parsed = JSON.parse(text); } catch (e) { parsed = null; }
      if (parsed && Array.isArray(parsed.cases)) cases = parsed.cases;
      else if (Array.isArray(parsed)) cases = parsed; // legacy bare array
    }
    return { cases: cases, sha: sha };
  }

  async function pushRemote(cases, sha) {
    var body = {
      message: 'update case library ' + new Date().toISOString(),
      content: encodeContent(JSON.stringify({ version: 1, cases: cases }, null, 2)),
      branch: (cfg().branch) || 'main'
    };
    if (sha) body.sha = sha;
    var res = await fetch(apiBase(), {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(body)
    });
    if (res.status === 409 && sha) {
      var fresh = await fetchRemote();
      return { conflict: true, sha: fresh.sha, remoteCases: fresh.cases };
    }
    if (!res.ok) {
      var t = '';
      try { t = await res.text(); } catch (e) {}
      throw new Error('github push ' + res.status + ' ' + String(t).slice(0, 200));
    }
    var data = await res.json();
    return { conflict: false, sha: (data.content && data.content.sha) || null };
  }

  /* merge remote-only cases back so a concurrent add isn't lost */
  function mergeById(localCases, remoteCases) {
    var map = {};
    (remoteCases || []).forEach(function (c) { if (c && c.id) map[c.id] = c; });
    (localCases || []).forEach(function (c) { if (c && c.id) map[c.id] = c; });
    var out = [];
    for (var k in map) { if (Object.prototype.hasOwnProperty.call(map, k)) out.push(map[k]); }
    return out;
  }

  /* ---- public store ---- */
  var Store = {
    status: enabled() ? 'offline' : 'offline',
    lastSyncAt: null,
    _listeners: [],
    onStatus: function (cb) { this._listeners.push(cb); },
    _setStatus: function (s) {
      this.status = s;
      var ls = this._listeners;
      for (var i = 0; i < ls.length; i++) { try { ls[i](s); } catch (e) { /* ignore */ } }
    }
  };

  Store.cached = function () { return lsGet(); };

  Store.init = async function () {
    if (!enabled()) { this._setStatus('offline'); return lsGet(); }
    this._setStatus('syncing');
    try {
      var r = await fetchRemote();
      var merged = mergeById(lsGet(), r.cases);
      lsSet(merged);
      lsMetaSet({ sha: r.sha, lastSyncAt: Date.now() });
      this.lastSyncAt = Date.now();
      this._setStatus('online');
      return merged;
    } catch (e) {
      this._setStatus('offline');
      return lsGet();
    }
  };

  Store.persist = async function (cases) {
    lsSet(cases); // instant local cache
    if (!enabled()) { this._setStatus('offline'); return; }
    this._setStatus('syncing');
    var sha = lsMeta().sha || null;
    try {
      var result = await pushRemote(cases, sha);
      if (result && result.conflict) {
        var merged = mergeById(cases, result.remoteCases || []);
        lsSet(merged);
        result = await pushRemote(merged, result.sha);
        if (result && !result.conflict && result.sha) lsMetaSet({ sha: result.sha, lastSyncAt: Date.now() });
        this.lastSyncAt = Date.now();
        this._setStatus('online');
        return merged;
      }
      if (result && result.sha) lsMetaSet({ sha: result.sha, lastSyncAt: Date.now() });
      this.lastSyncAt = Date.now();
      this._setStatus('online');
    } catch (e) {
      this._setStatus('offline'); // keep local; will resync on next init
    }
  };

  Store.forceResync = async function () { return Store.init(); };

  window.CaseStore = Store;
})();
