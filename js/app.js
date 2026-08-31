/* ============================================================================
 * Pure decision logic — kept outside the DOM init so it can be unit-tested.
 * s1Count..s4Count: number of checked items per group.
 * Returns { level }.
 * ========================================================================== */
function checklistRecommendation(s1Count, s2Count, s3Count, s4Count) {
  let base = 4;
  if (s1Count > 0) base = 1;
  else if (s2Count > 0) base = 2;
  else if (s3Count > 0) base = 3;
  return { level: base };
}

/* ============================================================================
 * DOM application
 * ========================================================================== */
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const inputEl = document.getElementById('issueInput');
    const judgeBtn = document.getElementById('judgeBtn');
    const resultPanel = document.getElementById('resultPanel');
    const resultLevel = document.getElementById('resultLevel');
    const resultTitle = document.getElementById('resultTitle');
    const resultReasons = document.getElementById('resultReasons');
    const saveAsCaseBtn = document.getElementById('saveAsCaseBtn');
    const severityCards = document.getElementById('severityCards');
    const symptomsSection = document.getElementById('symptomsSection');
    const docCriteriaSection = document.getElementById('docCriteriaSection');
    const checklistGroups = document.getElementById('checklistGroups');
    const checklistNote = document.getElementById('checklistNote');
    const checklistResult = document.getElementById('checklistResult');
    const checklistResetBtn = document.getElementById('checklistResetBtn');
    const similarCard = document.getElementById('similarCard');
    const similarList = document.getElementById('similarList');

    // Case library elements
    const caseSearch = document.getElementById('caseSearch');
    const caseStats = document.getElementById('caseStats');
    const caseList = document.getElementById('caseList');
    const caseEmpty = document.getElementById('caseEmpty');
    const addCaseBtn = document.getElementById('addCaseBtn');
    const exportCasesBtn = document.getElementById('exportCasesBtn');
    const importCasesBtn = document.getElementById('importCasesBtn');
    const importCasesFile = document.getElementById('importCasesFile');
    const syncBadge = document.getElementById('syncBadge');
    const syncBtn = document.getElementById('syncBtn');
    const caseModal = document.getElementById('caseModal');
    const caseModalTitle = document.getElementById('caseModalTitle');
    const caseForm = document.getElementById('caseForm');
    const caseCancelBtn = document.getElementById('caseCancelBtn');

    let lastJudged = null;

    /* ---------- bilingual helpers (always EN + ZH together) ---------- */
    function bi(obj) {
      if (typeof obj === 'string') return escapeHtml(obj);
      if (!obj) return '';
      return '<span class="bi-en">' + escapeHtml(obj.en) + '</span><span class="bi-zh">' + escapeHtml(obj.zh) + '</span>';
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text == null ? '' : String(text);
      return div.innerHTML;
    }

    /* ---------- Bilingual case helpers (EN + ZH, migrate legacy strings) ---------- */
    function isCJK(text) {
      return /[\u4e00-\u9fff]/.test(String(text || ''));
    }

    function biStr(o) {
      if (typeof o === 'string') return o;
      if (!o) return '';
      return ((o.en || '') + ' ' + (o.zh || '')).trim();
    }

    function autoTitle(text) {
      const t = String(text || '').replace(/\s+/g, ' ').trim();
      return t.slice(0, 60) + (t.length > 60 ? '\u2026' : '');
    }

    function langVal(o, lang) {
      return o && typeof o === 'object' ? (o[lang] || '') : '';
    }

    function migrateCase(c) {
      if (!c || typeof c !== 'object') return c;
      const fix = f => {
        const v = c[f];
        if (v == null) return { en: '', zh: '' };
        if (typeof v === 'string') return isCJK(v) ? { en: '', zh: v } : { en: v, zh: '' };
        if (typeof v === 'object' && !Array.isArray(v)) return { en: v.en || '', zh: v.zh || '' };
        return { en: '', zh: '' };
      };
      return Object.assign({}, c, {
        title: fix('title'),
        description: fix('description'),
        notes: fix('notes')
      });
    }

    function levelInfo(n) {
      return SEVERITY_DATA.levels[n - 1] || SEVERITY_DATA.levels[3];
    }

    /* ---------- Severity cards rendering (reusable) ---------- */
    function renderSeverityCardsInto(cardsEl, symptomsEl, includeSymptoms) {
      cardsEl.innerHTML = '';
      SEVERITY_DATA.levels.forEach(level => {
        const card = document.createElement('div');
        card.className = 'severity-card';
        card.style.borderLeftColor = level.color;
        card.style.backgroundColor = level.bg;

        const header = document.createElement('div');
        header.className = 'severity-card-header';
        header.innerHTML =
          '<span class="severity-badge" style="background-color:' + level.color + ';color:#fff">S' + level.level + '</span>' +
          '<span class="severity-card-title">' + bi({ en: level.shortTitle, zh: level.shortTitleZh }) + '</span>';

        const fullTitle = document.createElement('div');
        fullTitle.className = 'severity-card-fulltitle';
        fullTitle.innerHTML = bi({ en: level.title, zh: level.titleZh });

        const ul = document.createElement('ul');
        ul.className = 'severity-card-list';
        level.criteria.forEach(c => {
          const li = document.createElement('li');
          li.innerHTML = bi(c);
          ul.appendChild(li);
        });

        card.appendChild(header);
        card.appendChild(fullTitle);
        card.appendChild(ul);
        cardsEl.appendChild(card);
      });

      if (includeSymptoms === false) {
        if (symptomsEl) symptomsEl.innerHTML = '';
        return;
      }

      var sym = SEVERITY_DATA.severity1Symptoms;
      if (symptomsEl) symptomsEl.innerHTML =
        '<h3>' + bi({ en: sym.title, zh: sym.titleZh }) + '</h3>' +
        sym.categories.map(function(cat) {
          return '<div class="symptom-category">' +
            '<h4>' + bi({ en: cat.name, zh: cat.nameZh }) + '</h4>' +
            '<ul>' + cat.items.map(function(i) { return '<li>' + bi(i) + '</li>'; }).join('') + '</ul>' +
            '</div>';
        }).join('');
    }

    /* ---------- Standards rendering: severity definitions only ---------- */
    function renderStandards() {
      renderSeverityCardsInto(severityCards, symptomsSection, false);
    }

    /* ---------- Document-integrated criteria rendering ---------- */
    /* Five tC categories only (Obligation sources removed per request) */
    function renderDocCriteria() {
      var D = DOC_INTEGRATION;
      var h = [];

      h.push('<div class="doc-block">' +
        '<div class="doc-table">' +
          '<div class="doc-row doc-row-head"><span>Category <span class="zh-inline">' + escapeHtml('\u7c7b\u522b') + '</span></span><span>Aspects <span class="zh-inline">' + escapeHtml('\u65b9\u9762') + '</span></span></div>' +
          D.categories.map(function(c) {
            return '<div class="doc-row">' +
              '<span>' + bi({ en: c.en, zh: c.zh }) + '</span>' +
              '<span>' + bi(c.aspects) + '</span>' +
            '</div>';
          }).join('') +
        '</div>' +
      '</div>');

      docCriteriaSection.innerHTML = h.join('');
    }

    /* ---------- Matching logic (keywords + synonyms + phrases, EN/ZH) ---------- */
    function normalize(text) {
      return String(text || '').toLowerCase()
        .replace(/[\u20ac$¥£]/g, '')
        .replace(/[\/\-_,.()]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }

    function tokenize(text) {
      return normalize(text).split(' ').filter(t => t.length > 1);
    }

    /* Canonical keyword -> synonym list (both languages), built once from SEMANTIC.synonyms */
    const SYNONYM_LOOKUP = (function () {
      const map = {};
      (SEMANTIC.synonyms || []).forEach(s => {
        const key = normalize(s.term);
        if (key) map[key] = s.alts.map(a => normalize(a)).filter(Boolean);
      });
      return map;
    })();

    function expandKeywords(level) {
      return level.keywords.map(kw => {
        const en = normalize(kw.en);
        const zh = normalize(kw.zh);
        return {
          kw,
          phrases: [en, zh]
            .concat(SYNONYM_LOOKUP[en] || [], SYNONYM_LOOKUP[zh] || [])
            .filter(Boolean)
        };
      });
    }

    function calculateMatch(input, level) {
      const inputNorm = normalize(input);
      const inputTokens = tokenize(input);
      let score = 0;
      const matchedKeywords = [];

      expandKeywords(level).forEach(({ kw, phrases }) => {
        /* Direct hit: keyword EN/ZH or a curated synonym appears verbatim.
           Weighted 100 so one real indicator always beats fuzzy token noise. */
        const direct = phrases.some(p => p && inputNorm.includes(p));
        if (direct) {
          score += 100;
          if (!matchedKeywords.includes(kw)) matchedKeywords.push(kw);
          return;
        }
        /* Fuzzy fallback (tightened): only significant tokens (len >= 4),
           and only >= 2 shared tokens, or 1 distinctive token (len >= 6)
           with optional prefix/stem match (e.g. "braking" -> "brake"). */
        const kwTokens = tokenize(kw.en).filter(t => t.length >= 4);
        const shared = [];
        kwTokens.forEach(kt => {
          if (shared.includes(kt)) return;
          const hit = inputTokens.find(it =>
            it === kt || (it.length >= 5 && kt.length >= 5 && (it.startsWith(kt) || kt.startsWith(it)))
          );
          if (hit) shared.push(kt);
        });
        let gain = 0;
        if (shared.length >= 2) gain = Math.min(shared.length, 5);
        else if (shared.length === 1 && shared[0].length >= 6) gain = 1;
        if (gain > 0) {
          score += gain;
          if (!matchedKeywords.includes(kw)) matchedKeywords.push(kw);
        }
      });

      return { score, matchedKeywords };
    }

    /* Semantic phrase patterns (e.g. "pedal to the floor" -> S1), from SEMANTIC.phrases */
    function matchSemanticPhrases(input) {
      const inputNorm = normalize(input);
      const hits = [];
      (SEMANTIC.phrases || []).forEach(p => {
        const norm = normalize(p.text || p.en);
        if (norm && inputNorm.includes(norm)) hits.push(p);
      });
      return hits;
    }

    function judgeSeverity(input) {
      if (!input.trim()) return null;

      const results = SEVERITY_DATA.levels.map(level => {
        const { score, matchedKeywords } = calculateMatch(input, level);
        return { level, score, matchedKeywords };
      });

      const phraseHits = matchSemanticPhrases(input);
      phraseHits.forEach(p => {
        const r = results.find(x => x.level.level === p.severity);
        if (r) {
          r.score += 100;
          if (!r.matchedPhrases) r.matchedPhrases = [];
          r.matchedPhrases.push(p);
        }
      });

      results.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.level.level - b.level.level;
      });

      let best = results[0];
      if (best.score === 0) {
        best = { level: SEVERITY_DATA.levels[3], score: 0, matchedKeywords: [], matchedPhrases: [] };
      }
      return best;
    }

    function showResult(result, doScroll) {
      if (!result) {
        resultPanel.classList.add('hidden');
        return;
      }
      resultPanel.classList.remove('hidden');
      resultPanel.style.backgroundColor = result.level.bg;
      resultPanel.style.borderColor = result.level.color;

      resultLevel.textContent = 'Severity ' + result.level.level + ' · ' + '\u4e25\u91cd\u5ea6 ' + result.level.level;
      resultLevel.style.color = result.level.color;
      resultTitle.innerHTML = bi({ en: result.level.title, zh: result.level.titleZh });

      resultReasons.innerHTML = '';

      /* judgment engine badge (local semantic engine only) */
      const modeBadge = document.createElement('div');
      modeBadge.className = 'mode-badge local';
      modeBadge.textContent = 'Local semantic engine (keywords + synonyms + phrases) \u00b7 \u672c\u5730\u8bed\u4e49\u5f15\u64ce\uff08\u5173\u952e\u8bcd+\u540c\u4e49\u8bcd+\u77ed\u8bed\u6a21\u5f0f\uff09';
      resultReasons.appendChild(modeBadge);

      /* evidence: matched keywords */
      const matchedKeywords = result.matchedKeywords || [];
      if (matchedKeywords.length > 0) {
        const matchedDiv = document.createElement('div');
        matchedDiv.className = 'matched-keywords';
        const tagHtml = matchedKeywords.map(k =>
          '<span class="keyword-tag"><span class="tag-en">' + escapeHtml(k.en) + '</span><span class="tag-zh">' + escapeHtml(k.zh) + '</span></span>'
        ).join('');
        matchedDiv.innerHTML = '<strong>Matched indicators <span class="zh-inline">' + escapeHtml('\u5339\u914d\u5230\u7684\u5224\u65ad\u6307\u6807') + '</span>\uff1a</strong> ' + tagHtml;
        resultReasons.appendChild(matchedDiv);
      }

      /* evidence: semantic phrases */
      const matchedPhrases = result.matchedPhrases || [];
      if (matchedPhrases.length > 0) {
        const pDiv = document.createElement('div');
        pDiv.className = 'matched-keywords';
        const pTagHtml = matchedPhrases.map(p =>
          '<span class="phrase-tag">' + escapeHtml(p.en) + ' / ' + escapeHtml(p.zh) + '</span>'
        ).join('');
        pDiv.innerHTML = '<strong>Semantic patterns <span class="zh-inline">' + escapeHtml('\u8bed\u4e49\u6a21\u5f0f\u547d\u4e2d') + '</span>\uff1a</strong> ' + pTagHtml;
        resultReasons.appendChild(pDiv);
      }

      if (!matchedKeywords.length && !matchedPhrases.length) {
        const hint = document.createElement('div');
        hint.className = 'no-match-hint';
        hint.innerHTML = 'No strong match found. Defaulted to Severity 4 \u2014 please review against the full criteria or use the checklist below. <span class="zh-inline">' + escapeHtml('\u672a\u627e\u5230\u5f3a\u5339\u914d\uff0c\u9ed8\u8ba4\u5224\u5b9a\u4e3a Severity 4 \u2014\u2014 \u8bf7\u5bf9\u7167\u5b8c\u6574\u6807\u51c6\u6216\u4f7f\u7528\u4e0b\u65b9\u6e05\u5355\u4eba\u5de5\u5224\u5b9a\u3002') + '</span>';
        resultReasons.appendChild(hint);
      }

      /* combine with manual checklist selection — stricter wins */
      const clLevel = currentChecklistRec();
      if (clLevel) {
        const finalLevel = Math.min(result.level.level, clLevel);
        const fl = levelInfo(finalLevel);
        const finalDiv = document.createElement('div');
        finalDiv.className = 'final-line';
        finalDiv.style.backgroundColor = fl.bg;
        finalDiv.style.borderColor = fl.color;
        finalDiv.innerHTML = 'Final recommendation <span class="zh-inline">\u6700\u7ec8\u5efa\u8bae</span>: <strong>Severity ' + finalLevel + ' \u00b7 \u4e25\u91cd\u5ea6 ' + finalLevel + '</strong>' +
          ' <span class="zh-inline">\uff08\u6587\u672c\u5206\u6790 S' + result.level.level + '\uff0c\u6e05\u5355 S' + clLevel + '\uff0c\u53d6\u66f4\u4e25\u91cd\uff09</span>';
        resultReasons.appendChild(finalDiv);
      }

      saveAsCaseBtn.classList.remove('hidden');
      if (doScroll !== false && resultPanel.scrollIntoView) {
        resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }

    /* ---------- Judgment checklist: product-symptom based S1 symptoms only ---------- */
    function renderChecklist() {
      const C = DOC_INTEGRATION.checklist;
      checklistNote.innerHTML = bi(C.groupNote);

      // Only product-symptom based S1 symptoms are shown in the Assess by Symptom tab.
      // Any checked symptom counts as an S1 item (data-group="s1").
      // The semantic engine still references all severity levels / standards internally.
      const sym = SEVERITY_DATA.severity1Symptoms;
      const symHtml = `
        <div class="checklist-group checklist-symptoms" style="border-left-color:#dc2626">
          <div class="checklist-group-title" style="color:#dc2626">
            <span class="bi-en">${escapeHtml(sym.title)}</span>
            <span class="bi-zh">${escapeHtml(sym.titleZh)}</span>
          </div>
          ${sym.categories.map(cat => `
            <div class="checklist-subtitle">${escapeHtml(cat.name)}${cat.nameZh && cat.nameZh !== cat.name ? ' ' + escapeHtml(cat.nameZh) : ''}</div>
            ${cat.items.map((item, i) => `
              <label class="checklist-item">
                <input type="checkbox" data-group="s1" data-idx="sym-${i}" />
                <span class="checklist-item-text">
                  <span class="ci-en">${escapeHtml(item.en)}</span>
                  <span class="ci-zh">${escapeHtml(item.zh)}</span>
                </span>
                <span class="ci-ref">${escapeHtml(cat.name)}</span>
              </label>
            `).join('')}
          `).join('')}
        </div>`;

      const partHead = (tag, en, zh) =>
        '<div class="checklist-part-head">' +
          '<span class="part-tag">' + tag + '</span>' +
          bi({ en: en, zh: zh }) +
        '</div>';

      checklistGroups.innerHTML =
        '<div class="checklist-part part-product">' +
          partHead('Part 1', 'Based on product symptoms', '基于产品表现') +
          symHtml +
        '</div>';
      checklistGroups.querySelectorAll('input[type="checkbox"]').forEach(inp => {
        inp.addEventListener('change', updateChecklistResult);
      });
    }

    function currentChecklistRec() {
      const counts = { s1: 0, s2: 0, s3: 0, s4: 0 };
      ['s1', 's2', 's3', 's4'].forEach(k => {
        counts[k] = checklistGroups.querySelectorAll('input[data-group="' + k + '"]:checked').length;
      });
      const total = counts.s1 + counts.s2 + counts.s3 + counts.s4;
      if (!total) return null;
      return checklistRecommendation(counts.s1, counts.s2, counts.s3, counts.s4).level;
    }

    function updateChecklistResult() {
      const counts = { s1: 0, s2: 0, s3: 0, s4: 0 };
      ['s1', 's2', 's3', 's4'].forEach(k => {
        counts[k] = checklistGroups.querySelectorAll('input[data-group="' + k + '"]:checked').length;
      });

      const anyInteraction = counts.s1 + counts.s2 + counts.s3 + counts.s4 > 0;
      if (!anyInteraction) {
        checklistResult.classList.add('hidden');
        return;
      }

      const rec = checklistRecommendation(counts.s1, counts.s2, counts.s3, counts.s4);
      const level = levelInfo(rec.level);

      checklistResult.classList.remove('hidden');
      checklistResult.style.borderColor = level.color;
      checklistResult.innerHTML = `
        <div class="checklist-result-row">
          <span class="checklist-result-label">Checklist recommendation <span class="zh-inline">${escapeHtml('\u6e05\u5355\u5efa\u8bae')}</span>\uff1a</span>
          <span class="result-level-sm" style="color:${level.color}">Severity ${rec.level} · ${escapeHtml('\u4e25\u91cd\u5ea6')} ${rec.level}</span>
          <span class="result-title-sm">${bi({ en: level.shortTitle, zh: level.shortTitleZh })}</span>
        </div>
        <p class="checklist-msg-sm">If the checklist differs from the keyword suggestion, follow the stricter level. <span class="zh-inline">${escapeHtml('\u82e5\u6e05\u5355\u5efa\u8bae\u4e0e\u5173\u952e\u8bcd\u521d\u5224\u4e0d\u4e00\u81f4\uff0c\u6309\u66f4\u4e25\u91cd\u7b49\u7ea7\u4ece\u4e25\u5904\u7406\u3002')}</span></p>`;

      if (!resultPanel.classList.contains('hidden') && lastJudged) {
        showResult(lastJudged, false);
      }
    }

    function resetChecklist() {
      checklistGroups.querySelectorAll('input[type="checkbox"]').forEach(c => { c.checked = false; });
      updateChecklistResult();
    }

    /* Reset next to "Assess severity": clears the whole assessment flow. */
    function resetAssess() {
      inputEl.value = '';
      lastJudged = null;
      resultPanel.classList.add('hidden');
      resultReasons.innerHTML = '';
      similarCard.classList.add('hidden');
      similarList.innerHTML = '';
      resetChecklist();
      inputEl.focus();
    }

    /* ---------- Similar cases ---------- */
    function findSimilarCases(input, maxN) {
      const tokens = tokenize(input);
      if (!tokens.length || cases.length === 0) return [];
      return cases.map(c => {
        const cTokens = tokenize(biStr(c.title) + ' ' + biStr(c.description));
        const overlap = cTokens.filter(t => tokens.includes(t)).length;
        return { c, score: overlap };
      })
        .filter(x => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, maxN || 3);
    }

    function renderSimilar(input) {
      const sims = findSimilarCases(input);
      if (!sims.length) {
        similarCard.classList.add('hidden');
        similarList.innerHTML = '';
        return;
      }
      similarCard.classList.remove('hidden');
      similarList.innerHTML = sims.map(s => miniCaseCard(s.c, s.score)).join('');
    }

    function miniCaseCard(c, score) {
      const lv = levelInfo(c.severity);
      const cat = categoryInfo(c.category);
      const tEn = langVal(c.title, 'en') || langVal(c.title, 'zh');
      const tZh = langVal(c.title, 'zh');
      const dEn = langVal(c.description, 'en');
      const dZh = langVal(c.description, 'zh');
      return `
        <div class="similar-case">
          <span class="severity-badge sm" style="background-color:${lv.color};color:#fff">S${c.severity}</span>
          <div class="similar-body">
            <div class="similar-title">
              <span class="bi-en">${escapeHtml(tEn)} <span class="similar-score">${score} match${score > 1 ? 'es' : ''} ${escapeHtml('\u5339\u914d')}</span></span>
              <span class="bi-zh">${escapeHtml(tZh)}</span>
            </div>
            <div class="similar-meta">${escapeHtml(cat.en)} / ${escapeHtml(cat.zh)} · ${escapeHtml(c.date || '\u2014')} · ${escapeHtml(c.approvedBy || '')}</div>
            <p class="similar-desc">
              <span class="bi-en">${escapeHtml(dEn.slice(0, 160))}${dEn.length > 160 ? '\u2026' : ''}</span>
              <span class="bi-zh">${escapeHtml(dZh.slice(0, 160))}${dZh.length > 160 ? '\u2026' : ''}</span>
            </p>
          </div>
        </div>`;
    }

    /* ---------- Case library ---------- */
    const STORAGE_KEY = 'severityToolCasesV1';
    let cases = loadCases();

    function loadCases() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const arr = raw ? JSON.parse(raw) : [];
        return Array.isArray(arr) ? arr.map(migrateCase) : [];
      } catch (e) {
        return [];
      }
    }

    function saveCases() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
      } catch (e) {
        alert('Failed to save cases to this browser (localStorage unavailable). ' + escapeHtml('\u65e0\u6cd5\u5728\u672c\u6d4f\u89c8\u5668\u4fdd\u5b58\u6848\u4f8b\uff08\u672c\u5730\u5b58\u50a8\u4e0d\u53ef\u7528\uff09\u3002'));
      }
      /* Push to shared store (GitHub) when configured; fire-and-forget.
         Offline-safe: if no token / network, CaseStore falls back to localStorage only. */
      if (window.CaseStore) {
        CaseStore.persist(cases).then(function (merged) {
          if (Array.isArray(merged)) {
            cases = merged.map(migrateCase);
            renderCaseLibrary();
          }
        }).catch(function () { /* status badge already updated */ });
      }
    }

    function categoryInfo(key) {
      const c = DOC_INTEGRATION.categories.find(x => x.key === key);
      return c ? { en: c.en, zh: c.zh } : { en: 'Other', zh: '\u5176\u4ed6' };
    }

    function renderCaseLibrary() {
      renderCaseStats();
      renderCaseList();
    }

    function renderCaseStats() {
      const counts = [0, 0, 0, 0];
      cases.forEach(c => {
        if (c.severity >= 1 && c.severity <= 4) counts[c.severity - 1]++;
      });
      const max = Math.max(1, ...counts);
      caseStats.innerHTML = `
        <div class="stat-card total">
          <span class="stat-num">${cases.length}</span>
          <span class="stat-label">Total <span class="zh-inline">${escapeHtml('\u603b\u6570')}</span></span>
        </div>
        ${[1, 2, 3, 4].map(i => `
          <div class="stat-card">
            <span class="stat-num" style="color:${levelInfo(i).color}">${counts[i - 1]}</span>
            <span class="stat-label">S${i}</span>
            <span class="stat-bar"><span style="width:${Math.round(counts[i - 1] / max * 100)}%;background-color:${levelInfo(i).color}"></span></span>
          </div>`).join('')}`;
    }

    function renderCaseList() {
      const q = normalize(caseSearch.value);
      const filtered = cases.filter(c => {
        if (!q) return true;
        const cat = categoryInfo(c.category);
        const hay = normalize([
          biStr(c.title), biStr(c.description), biStr(c.notes), c.enteredBy, c.approvedBy,
          cat.en, cat.zh, 's' + c.severity
        ].join(' '));
        return hay.includes(q);
      }).sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));

      if (cases.length === 0) {
        caseEmpty.classList.remove('hidden');
      } else {
        caseEmpty.classList.add('hidden');
      }

      if (!filtered.length) {
        caseList.innerHTML = '<p class="empty-note">No matching cases. <span class="zh-inline">' + escapeHtml('\u6ca1\u6709\u5339\u914d\u7684\u6848\u4f8b\u3002') + '</span></p>';
        return;
      }

      caseList.innerHTML = filtered.map(c => fullCaseCard(c)).join('');
    }

    function fullCaseCard(c) {
      const lv = levelInfo(c.severity);
      const cat = categoryInfo(c.category);
      const statusZh = c.status === 'closed' ? '\u5df2\u5173\u95ed' : '\u5904\u7406\u4e2d';
      const hasNotes = c.notes && (c.notes.en || c.notes.zh);
      return `
        <div class="case-card" data-id="${escapeHtml(c.id)}">
          <div class="case-card-header">
            <span class="severity-badge" style="background-color:${lv.color};color:#fff">S${c.severity}</span>
            <span class="case-title">${bi(c.title)}</span>
            <span class="case-status ${c.status === 'closed' ? 'closed' : 'open'}">${c.status === 'closed' ? 'Closed \u5df2\u5173\u95ed' : 'Open \u5904\u7406\u4e2d'}</span>
          </div>
          <div class="case-meta">
            <span class="tag-chip">${escapeHtml(cat.en)} / ${escapeHtml(cat.zh)}</span>
            <span class="tag-chip">Date ${escapeHtml('\u65e5\u671f')}: ${escapeHtml(c.date || '\u2014')}</span>
            ${c.enteredBy ? '<span class="tag-chip entered">' + escapeHtml('\u586b\u5199\u4eba') + ': ' + escapeHtml(c.enteredBy) + '</span>' : ''}
            ${c.approvedBy ? '<span class="tag-chip approved">\u2713 ' + escapeHtml(c.approvedBy) + '</span>' : ''}
          </div>
          <p class="case-desc">${bi(c.description)}</p>
          ${hasNotes ? '<p class="case-notes"><strong>Notes <span class="zh-inline">' + escapeHtml('\u5907\u6ce8') + '</span>:</strong> ' + bi(c.notes) + '</p>' : ''}
          <div class="case-actions">
            <button class="btn btn-secondary btn-sm" data-act="edit">Edit <span class="zh-inline">${escapeHtml('\u7f16\u8f91')}</span></button>
            <button class="btn btn-danger btn-sm" data-act="delete">Delete <span class="zh-inline">${escapeHtml('\u5220\u9664')}</span></button>
          </div>
        </div>`;
    }

    /* ---------- Case modal ---------- */
    function populateCategorySelect() {
      const sel = document.getElementById('caseCategory');
      sel.innerHTML = DOC_INTEGRATION.categories.map(c =>
        '<option value="' + c.key + '">' + escapeHtml(c.en) + ' ' + escapeHtml(c.zh) + '</option>'
      ).join('') + '<option value="other">Other ' + escapeHtml('\u5176\u4ed6') + '</option>';
    }

    function openCaseModal(c) {
      if (c) c = migrateCase(c);
      caseModalTitle.innerHTML = c
        ? 'Edit case <span class="zh-inline">' + escapeHtml('\u7f16\u8f91\u6848\u4f8b') + '</span>'
        : 'Add case <span class="zh-inline">' + escapeHtml('\u65b0\u589e\u6848\u4f8b') + '</span>';
      document.getElementById('caseId').value = c ? c.id : '';
      document.getElementById('caseDescriptionEn').value = c ? langVal(c.description, 'en') : '';
      document.getElementById('caseDescriptionZh').value = c ? langVal(c.description, 'zh') : '';
      document.getElementById('caseCategory').value = c ? c.category : 'other';
      document.getElementById('caseSeverity').value = c ? String(c.severity) : '4';
      document.getElementById('caseEnteredBy').value = c ? (c.enteredBy || '') : '';
      document.getElementById('caseApprovedBy').value = c ? (c.approvedBy || '') : '';
      document.getElementById('caseDate').value = c ? (c.date || '') : new Date().toISOString().slice(0, 10);
      document.getElementById('caseStatus').value = c ? c.status : 'open';
      document.getElementById('caseNotesEn').value = c ? langVal(c.notes, 'en') : '';
      document.getElementById('caseNotesZh').value = c ? langVal(c.notes, 'zh') : '';
      setTransStatus('');
      caseModal.classList.remove('hidden');
      document.getElementById('caseDescriptionEn').focus();
      setTimeout(autoFillMissingTranslations, 250);
    }

    function closeCaseModal() {
      caseModal.classList.add('hidden');
      caseForm.reset();
    }

    /* ---------- Auto-translate (best effort; offline → fill manually) ---------- */
    function setTransStatus(msg, kind) {
      const el = document.getElementById('caseTransStatus');
      if (!el) return;
      el.textContent = msg || '';
      el.className = 'trans-status' + (kind ? ' ' + kind : '');
    }

    async function translateViaGoogle(src, from) {
      const sl = from === 'zh' ? 'zh-CN' : 'en';
      const tl = from === 'zh' ? 'en' : 'zh-CN';
      const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&dt=t'
        + '&sl=' + sl + '&tl=' + tl + '&q=' + encodeURIComponent(src);
      const res = await fetch(url);
      if (!res.ok) throw new Error('http ' + res.status);
      const data = await res.json();
      const out = Array.isArray(data && data[0])
        ? data[0].map(seg => (seg && seg[0]) || '').join('')
        : '';
      if (!out) throw new Error('no translation');
      return out;
    }

    async function translateViaMyMemory(src, from) {
      const pair = from === 'zh' ? 'zh-CN|en-GB' : 'en-GB|zh-CN';
      const url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(src) + '&langpair=' + pair;
      const res = await fetch(url);
      if (!res.ok) throw new Error('http ' + res.status);
      const data = await res.json();
      const out = data && data.responseData && data.responseData.translatedText;
      if (!out || /MYMEMORY WARNING/i.test(out)) throw new Error('no translation');
      return out;
    }

    async function translateText(text, from) {
      const src = String(text || '').trim().slice(0, 2000);
      if (!src) throw new Error('empty');
      try {
        return await translateViaGoogle(src, from);
      } catch (e) {
        return await translateViaMyMemory(src, from);
      }
    }

    async function autoFillMissingTranslations() {
      const jobs = [
        ['caseDescriptionEn', 'caseDescriptionZh'],
        ['caseDescriptionZh', 'caseDescriptionEn'],
        ['caseNotesEn', 'caseNotesZh'],
        ['caseNotesZh', 'caseNotesEn']
      ];
      let done = 0, failed = 0;
      for (const [fromId, toId] of jobs) {
        const fromEl = document.getElementById(fromId);
        const toEl = document.getElementById(toId);
        if (!fromEl || !toEl) continue;
        const src = fromEl.value.trim();
        if (!src || toEl.value.trim()) continue;
        const from = isCJK(src) ? 'zh' : 'en';
        const targetVal = toEl.value;
        try {
          const out = await translateText(src, from);
          if (out && toEl.value === targetVal) { toEl.value = out; done++; }
        } catch (e) { failed++; }
      }
      if (done > 0) {
        setTransStatus(done + ' field(s) auto-translated ' + escapeHtml('\u5df2\u81ea\u52a8\u7ffb\u8bd1') + (failed ? ', ' + failed + ' failed ' + escapeHtml('\u5931\u8d25') : ''), 'ok');
      } else if (failed > 0) {
        setTransStatus('Translation service unavailable \u2014 please fill the other language manually ' + escapeHtml('\u7ffb\u8bd1\u670d\u52a1\u4e0d\u53ef\u7528\uff0c\u8bf7\u624b\u52a8\u586b\u5199\u53e6\u4e00\u79cd\u8bed\u8a00'), 'err');
      } else {
        setTransStatus('');
      }
    }

    caseForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('caseId').value;
      const dEn = document.getElementById('caseDescriptionEn').value.trim();
      const dZh = document.getElementById('caseDescriptionZh').value.trim();
      if (!dEn && !dZh) return;
      const payload = {
        title: {
          en: autoTitle(dEn || dZh),
          zh: autoTitle(dZh || dEn)
        },
        description: { en: dEn, zh: dZh },
        category: document.getElementById('caseCategory').value,
        severity: parseInt(document.getElementById('caseSeverity').value, 10),
        enteredBy: document.getElementById('caseEnteredBy').value.trim(),
        approvedBy: document.getElementById('caseApprovedBy').value.trim(),
        date: document.getElementById('caseDate').value,
        status: document.getElementById('caseStatus').value,
        notes: {
          en: document.getElementById('caseNotesEn').value.trim(),
          zh: document.getElementById('caseNotesZh').value.trim()
        }
      };

      if (id) {
        const idx = cases.findIndex(c => c.id === id);
        if (idx >= 0) cases[idx] = Object.assign({}, cases[idx], payload);
      } else {
        payload.id = 'case_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
        cases.push(payload);
      }
      saveCases();
      renderCaseLibrary();
      closeCaseModal();
    });

    caseList.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-act]');
      if (!btn) return;
      const card = btn.closest('.case-card');
      const id = card.dataset.id;
      const c = cases.find(x => x.id === id);
      if (!c) return;
      if (btn.dataset.act === 'edit') {
        openCaseModal(c);
      } else if (btn.dataset.act === 'delete') {
        const titleForConfirm = (c.title && (c.title.en || c.title.zh)) || '';
        if (confirm('Delete case "' + titleForConfirm + '"? ' + escapeHtml('\u786e\u8ba4\u5220\u9664\u6848\u4f8b\u300c') + titleForConfirm + escapeHtml('\u300d\uff1f'))) {
          cases = cases.filter(x => x.id !== id);
          saveCases();
          renderCaseLibrary();
        }
      }
    });

    addCaseBtn.addEventListener('click', () => openCaseModal(null));
    document.getElementById('caseTranslateBtn').addEventListener('click', () => {
      setTransStatus('Translating... ' + escapeHtml('\u7ffb\u8bd1\u4e2d...'));
      autoFillMissingTranslations();
    });
    caseCancelBtn.addEventListener('click', closeCaseModal);
    caseModal.addEventListener('click', (e) => {
      if (e.target === caseModal) closeCaseModal();
    });

    /* ---------- Export / Import ---------- */
    exportCasesBtn.addEventListener('click', () => {
      if (!cases.length) {
        alert('No cases to export. ' + escapeHtml('\u6ca1\u6709\u53ef\u5bfc\u51fa\u7684\u6848\u4f8b\u3002'));
        return;
      }
      const blob = new Blob([JSON.stringify(cases, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'severity-cases-' + new Date().toISOString().slice(0, 10) + '.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    importCasesBtn.addEventListener('click', () => importCasesFile.click());

    importCasesFile.addEventListener('change', () => {
      const file = importCasesFile.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const text = (ev && ev.target && ev.target.result != null) ? ev.target.result : reader.result;
          const arr = JSON.parse(text);
          if (!Array.isArray(arr)) throw new Error('not array');
          let added = 0, updated = 0;
          arr.forEach(raw => {
            if (!raw || typeof raw !== 'object') return;
            const item = migrateCase(raw);
            if (!item.description) return;
            if (!(item.description.en || item.description.zh)) return;
            if (!item.title || !(item.title.en || item.title.zh)) {
              item.title = {
                en: autoTitle(item.description.en || item.description.zh),
                zh: autoTitle(item.description.zh || item.description.en)
              };
            }
            if (!item.id) item.id = 'case_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
            const exist = cases.findIndex(c => c.id === item.id);
            if (exist >= 0) {
              cases[exist] = Object.assign({}, cases[exist], item);
              updated++;
            } else {
              cases.push(item);
              added++;
            }
          });
          saveCases();
          renderCaseLibrary();
          alert('Import complete. ' + escapeHtml('\u5bfc\u5165\u5b8c\u6210\uff1a') + added + ' new ' + escapeHtml('\u65b0\u589e') + ', ' + updated + ' updated ' + escapeHtml('\u66f4\u65b0') + '.');
        } catch (err) {
          alert('Invalid file \u2014 expected a JSON array of cases. ' + escapeHtml('\u6587\u4ef6\u683c\u5f0f\u65e0\u6548\u2014\u2014\u5e94\u4e3a\u6848\u4f8b JSON \u6570\u7ec4\u3002'));
        }
      };
      reader.readAsText(file);
      importCasesFile.value = '';
    });

    /* ---------- Events ---------- */
    judgeBtn.addEventListener('click', () => {
      const input = inputEl.value;
      if (!input.trim()) return;
      judgeBtn.disabled = true;
      resultPanel.classList.remove('hidden');
      resultReasons.innerHTML = '<p class="judging-hint">Analyzing... <span class="zh-inline">\u5224\u65ad\u4e2d\u2026</span></p>';

      const local = judgeSeverity(input);
      lastJudged = {
        level: local.level,
        matchedKeywords: local.matchedKeywords || [],
        matchedPhrases: local.matchedPhrases || [],
        mode: 'local'
      };
      showResult(lastJudged);
      renderSimilar(input);
      judgeBtn.disabled = false;
    });

    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        judgeBtn.click();
      }
    });

    saveAsCaseBtn.addEventListener('click', () => {
      if (!lastJudged) return;
      const descText = inputEl.value.trim();
      const descObj = isCJK(descText) ? { en: '', zh: descText } : { en: descText, zh: '' };
      openCaseModal({
        title: { en: '', zh: '' },
        description: descObj,
        category: 'other',
        severity: lastJudged.level.level,
        enteredBy: '',
        approvedBy: '',
        date: new Date().toISOString().slice(0, 10),
        status: 'open',
        notes: { en: '', zh: '' }
      });
    });

    checklistResetBtn.addEventListener('click', resetAssess);

    caseSearch.addEventListener('input', renderCaseList);

    /* ---------- Tabs ---------- */
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
        document.getElementById('tab-' + btn.dataset.tab).classList.remove('hidden');
        if (btn.dataset.tab === 'cases') renderCaseLibrary();
      });
    });

    /* ---------- Shared-store sync badge ---------- */
    function updateSyncBadge(status) {
      if (!syncBadge) return;
      syncBadge.className = 'sync-badge ' + status;
      var dot = syncBadge.querySelector('.sync-dot');
      var txt = syncBadge.querySelector('.sync-text');
      var label = status === 'online' ? 'Online 已同步'
        : status === 'syncing' ? 'Syncing 同步中…'
        : 'Offline 本地';
      if (txt) txt.textContent = label;
    }

    function resyncFromStore() {
      if (!window.CaseStore) return;
      syncBtn.disabled = true;
      CaseStore.forceResync().then(function (remote) {
        if (Array.isArray(remote)) {
          cases = remote.map(migrateCase);
          renderCaseLibrary();
        }
      }).catch(function () { /* badge reflects failure */ })
        .then(function () { syncBtn.disabled = false; });
    }

    if (window.CaseStore) {
      CaseStore.onStatus(updateSyncBadge);
      updateSyncBadge(CaseStore.status);
    }
    if (syncBtn) syncBtn.addEventListener('click', resyncFromStore);

    /* ---------- Init ---------- */
    renderStandards();
    renderDocCriteria();
    renderChecklist();
    populateCategorySelect();
    renderCaseLibrary();
    document.getElementById('lastUpdated').textContent = SEVERITY_DATA.lastUpdated;

    /* Refresh from shared store (GitHub) after first paint; offline-safe */
    if (window.CaseStore) {
      CaseStore.init().then(function (remote) {
        if (Array.isArray(remote)) {
          cases = remote.map(migrateCase);
          renderCaseLibrary();
        }
      }).catch(function () { /* badge already offline */ });
    }
  });
}
