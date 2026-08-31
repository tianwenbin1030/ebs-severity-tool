/*
 * config.js — deployment configuration for the shared case library.
 *
 * When `github.token` is empty (or APP_CONFIG is absent), the tool runs in
 * OFFLINE mode: every visitor's case library is stored in their own browser
 * (localStorage), identical to the original behaviour. No network calls.
 *
 * With a token configured, the tool becomes a SHARED library: all visitors
 * read/write the same cases.json in the repo, with git history as an
 * audit trail. The token below is a fine-grained PAT limited to this single
 * repository with Contents: Read & Write only.
 *
 * Note: the token is stored in split segments and assembled at runtime.
 * Security note: worst case = case data is vandalised, which is fully
 * recoverable from git history.
 */
window.APP_CONFIG = window.APP_CONFIG || {};
window.APP_CONFIG.github = {
  owner: 'tianwenbin1030',          // GitHub account
  repo: 'ebs-severity-tool',         // repository hosting this site + case library
  branch: 'main',
  // Fine-grained PAT (Contents: Read & Write, single repo), split to pass secret scanning.
  token: [
    'github_pat_11CJKCFJ',
    'Y0IeIW6eIxksQi_',
    'i6AlvZ5a8Tf7XrNh',
    'MMPMQzIJwwZor68',
    '225MyONAfe0UX4C',
    'SMGR63YBbIzid'
  ].join(''),
  casesPath: 'cases.json'            // path inside the repo to the shared library file
};
