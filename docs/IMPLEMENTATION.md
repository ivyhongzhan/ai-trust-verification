# Implementation guide for the project owner

## Explain the system in one minute

This is a deterministic browser application, not an AI classifier. A review also records an intended-use context and separate trust/distrust reflections and use intention. These are not psychological scales or observed reliance. A review contains a question, an original answer, optional reference material, and manually selected claims. Each claim has a human judgment, rationale, timestamp, and multiple evidence records. Evidence records store a title, optional web URL, excerpt, relationship, and scope note. React renders this state; TypeScript checks the data shapes during development. The browser saves a versioned JSON object in localStorage, and exports JSON for restoration or Markdown for reading.

## Code map

- `src/model.ts`: domain types, constructors, synthetic scenario, URL validation, import schema validation, documentation-completeness rule, Markdown serializer.
- `src/main.tsx`: React application, selection/filtering, editing, storage feedback, replacement confirmation, import/export and research brief.
- `src/style.css`: responsive layout and focus styles.
- `src/model.test.ts`: domain invariants and hostile/malformed input handling.
- `tests/workspace.spec.ts`: browser workflows, persistence, export, import failure, mobile layout and automated accessibility checks.
- `.github/workflows/ci.yml`: clean install, unit tests, typecheck/build, browser tests, dependency audit, and Pages deployment.

State is updated immutably. The selected claim is an ID rather than a duplicate object. Updating a claim refreshes its timestamp. Progress is derived from state, not separately stored. Editing an answer does not overwrite manually curated claims. No automatic extraction, ranking, retrieval, truth scoring, or LLM inference runs.

## Persistence and interchange

Storage key: `aitv-review-v1`. The schema version is 1. Import validates types, enum values, URL schemes, unique IDs, timestamp format, size (2 MB), up to 200 claims and 100 sources per claim; unknown fields are discarded. Older version-1 files without context/use-intention fields receive explicit defaults. These are import limits, not an unlimited-scale editor guarantee. Invalid saved data falls back to the synthetic demo; an invalid import leaves the current workspace intact. Storage failures show a warning to export. JSON exports preserve state; Markdown is for reading, not reimport. Browser storage is origin-specific and can be cleared by the browser; export is the portable backup.

Completeness: nonblank claim + non-default judgment + nonblank rationale + at least one evidence record with nonblank title/excerpt/scope and an empty or safe HTTP(S) URL. “Unresolved” with a rationale is complete without evidence. More sources or completed records never imply correctness. Import validation checks structure, not the truth of content. Exported Markdown contains user-authored text; treat it as untrusted content in downstream rendering and review it before sharing.

## Security and privacy model

No server, login, database, API keys, analytics, or remote logging. User entries remain in browser storage unless exported. Opening a user-entered external source navigates to that website; it may track visits. Source URLs permit only HTTP(S), with `noreferrer` on new tabs. React escapes user text; no `dangerouslySetInnerHTML`, evaluation, source fetching, or user-authored executable markup. Do not enter private information on shared devices. No third-party runtime fonts/scripts are loaded by the built app. Static hosting providers receive normal page requests; local-first is not anonymity or encryption. localStorage is readable by scripts on the same origin and is not suitable for secrets.

## Known limitations and next changes

No account sync, collaboration, revision history, undo for source removal, real source archival, or automatic fact checking. A URL is not fetched and can be inaccessible or misleading. Blank or shallow text can satisfy completeness. The UI does not enforce that all answer claims are covered. Mobile stacks columns and may require more scrolling. Accessibility automation is limited; assistive-technology and disabled-user evaluation remain necessary. Performance has not been profiled for very large workspaces. Future study instrumentation and comparator are not yet built. Avoid expanding to live LLM integration until it serves a tested research need.

Before changing the schema, add explicit migration handling and tests. Before collecting study data, implement consented instrumentation separately from the public app and complete the ethics workflow. Do not modify the original Reddit study to fit this prototype.

## Context interaction

Personal planning and public communication use the same answer and sources. Changing context retains claim evidence and qualitative reflections but resets the intended-use choice and its reason. This invites reconsideration; it neither changes factual judgments automatically nor records a controlled before/after comparison. JSON and Markdown preserve the current context and decision. The future study must counterbalance context independently of interface.
