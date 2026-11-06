# Verification record

Checked on 6 November 2026. These are software checks, not participant results or evidence of intervention effectiveness.

## Local acceptance

Environment: macOS arm64; Node.js 22.22.0; npm 10.9.4; TypeScript 5.9.3; React 19.3.1; Vite 7.3.7; Vitest 5.1.0; Playwright 1.65.0.

| Check | Actual result |
| --- | --- |
| Domain unit tests (`npm test`) | **PASS — 13 tests** |
| Strict TypeScript check + production bundle (`npm run build`) | **PASS** |
| Browser acceptance (`npm run test:e2e`) | **PASS — 7 tests** |
| Automated axe accessibility scans | **PASS — zero reported violations** in default workspace, evidence-detail workspace, and mobile research brief |
| Mobile overflow (390 × 844) | **PASS** in tested workspace |
| Formatting (`npm run format:check`) | **PASS** |
| Dependency audit (`npm audit --audit-level=high`) | **PASS — 0 known vulnerabilities** at check time |
| Source scan for common secret patterns and local absolute paths | No matches in application, documentation, workflow or package metadata |
| Visual QA | Desktop 1440 × 1000 and mobile 390 × 844 inspected; screenshots retained |

Browser installation from Playwright CDN failed due to network timeouts/TLS resets. Local acceptance therefore used the installed Google Chrome executable through `PLAYWRIGHT_EXECUTABLE_PATH`; this runs Chromium-based browser tests but is not a successful bundled-browser installation. CI installs its own bundled Chromium on Linux and must pass separately. The environment override is optional and does not affect normal CI.

## What was exercised

Unit tests: synthetic data boundaries; documentation rules including reasoned unresolved judgments; JSON roundtrip; hostile/invalid URL rejection; malformed schema/duplicate ID/oversized file rejection; Markdown scope/boundary preservation; context and use-intention roundtrip; older v1 schema defaults; invalid context/decision rejection.

Browser tests: create/edit a claim; add scoped evidence and judgment; reload persisted state; export JSON; delete a claim; cancel replacement; reject malformed import without losing state; view research boundaries; mobile overflow; automated accessibility; change context while retaining evidence and resetting use decision; successfully import a full context/evidence/decision record; native dialog keyboard cycling and Escape cancellation.

## Failures diagnosed and fixed

- Initial dependency install stalled/timed out; recovered with a completed install and retained lockfile.
- Initial test dependencies had known advisories; upgraded Vitest rather than suppressing the audit.
- Unit-test discovery initially included Playwright tests; scoped the unit command to `src`.
- Exact accessible names of selects were unreliable; added explicit control names.
- Several small-text colors failed contrast; darkened the actual styles while keeping the checks intact.
- Keyboard cycling at the confirmation dialog’s last button was unreliable in the tested browser; added explicit first/last focus cycling and restore-on-close.

## Verification limits

Passing these checks does not imply complete WCAG conformance, usability, source credibility, actual truth detection, safety for consequential decisions, or a research benefit. No assistive-technology user study, cross-browser Safari/Firefox suite, stress test, external penetration test, or human-subject evaluation was performed. Browser storage can fail or be cleared, source URLs can mislead, and users can satisfy completeness with poor content. The app has no study telemetry. See the study protocol for work required before empirical claims.

## Reproduce

```sh
npm ci
npm test
npm run build
npx playwright install chromium
npm run test:e2e
npm run format:check
npm audit --audit-level=high
```

If the browser download is unavailable, explicitly point `PLAYWRIGHT_EXECUTABLE_PATH` to an existing Chromium-compatible browser and disclose that substitution. Do not count a failed install or unexecuted test as PASS.

Deployment and CI evidence is recorded below after publication.
