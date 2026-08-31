/*
 * config.js — deployment configuration for the shared case library.
 *
 * When `github.token` is empty (or APP_CONFIG is absent), the tool runs in
 * OFFLINE mode: every visitor's case library is stored in their own browser
 * (localStorage), identical to the original behaviour. No network calls.
 *
 * At deployment time this file is regenerated with a real fine-grained PAT
 * (scoped to a single repository, Contents: Read & Write only). That turns
 * the tool into a SHARED library: all visitors read/write the same
 * cases.json in the repo, with git history as an audit trail.
 *
 * Security note: the token is embedded in a public page, so it MUST be a
 * fine-grained token limited to ONE repository. Worst case = case data is
 * vandalised, which is fully recoverable from git history.
 */
window.APP_CONFIG = window.APP_CONFIG || {};
window.APP_CONFIG.github = {
  owner: 'tianwenbin1030',          // GitHub account
  repo: 'ebs-severity-tool',         // repository hosting this site + case library
  branch: 'main',
  token: '',                         // fine-grained PAT, Contents: Read & Write, single repo
  casesPath: 'cases.json'            // path inside the repo to the shared library file
};
