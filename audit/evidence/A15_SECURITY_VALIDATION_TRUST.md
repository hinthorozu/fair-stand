# A15 — Security / validation / trust-boundary audit

Baseline: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Mode: audit-first / fix-later. No runtime/product fix in this evidence commit.

## Inputs/trust boundaries inspected

- stand X/Y and module dimension inputs,
- project names,
- image uploads,
- ZIP project import,
- IndexedDB persisted project/module state,
- public model/texture paths,
- current direct npm dependencies.

## Findings

### F-038 — P2 — dependency/security scanning is not enforced by CI

Canonical CI runs change-contract verification, `npm ci`, unit/integration tests and production build. It does not run `npm audit` or another dependency-advisory/SCA step, and there is no repository-managed secret/static security scan in the inspected workflow.

Current direct dependency spot-check does not reveal a known unpatched issue in the pinned direct versions: Vite 8.0.16 is the patched line for the June 2026 `server.fs.deny` issue, and JSZip 3.10.1 is newer than its historical 3.8.0 path-traversal fix. This finding is about the missing repeatable gate, not a claim that the current lockfile is vulnerable.

## Cross-linked gaps

- F-036: imported project/module state lacks structural domain validation.
- F-037: ZIP/image resource limits and upload content policy are absent.
- F-032/F-023: storage/multi-store ownership/atomicity risks.
- F-025: debug surface is loaded in normal product UI.

## Positive controls

- project naming uses DOM APIs/textContent/value rather than interpolating the project name into executable HTML.
- project-name input is length-bounded.
- stand setup validation constrains intended numeric setup values.
- current public runtime model paths are local application assets rather than arbitrary remote URLs.
- no committed secret/credential was identified in the source/config files inspected during A00-A15. Domain/default admin email in installer are configuration defaults, not credentials.

## Checklist results

- A15.01 user-controlled input inventory: `AUDITED_OK`.
- A15.02 numeric validation: `GAP` at imported-state trust boundary — F-036; normal stand setup has explicit validation.
- A15.03 file upload type/content/size policy: `GAP` — F-037.
- A15.04 archive namespace/path escape: `AUDITED_OK` at JSZip version baseline; no filesystem extraction is performed by application code.
- A15.05 unsafe HTML sinks for user strings: `AUDITED_OK` for inspected project/asset naming flows; static template `innerHTML` exists but is not populated from those user strings.
- A15.06 external URL/assets: `AUDITED_OK` for runtime assets inspected; local packaged paths only.
- A15.07 cross-project boundaries: `GAP` for persistence/atomicity findings F-020/F-023/F-032; no direct cross-project asset read was found.
- A15.08 debug exposure: `GAP` — F-025.
- A15.09 dependency advisory audit: `GAP` — F-038.
- A15.10 embedded secrets/private endpoints: `AUDITED_OK` for inspected repository source; no secret-scanning gate exists, covered by F-038.

Section audit status: **GAP**.
