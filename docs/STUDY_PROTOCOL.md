# Proposed empirical study protocol

**Status: proposal only.** No recruitment, ethics approval, pilot, interviews, participant data, or results exist for this prototype. This document is not a preregistration. Obtain institutional ethics determination and finalize materials, compensation, consent, exclusion rules, and power analysis before recruitment.

## Questions and testable expectations

RQ1: Does structured claim–evidence review improve evidence-grounded final judgments relative to answer-plus-notes? RQ2: What time/effort costs and review strategies accompany the workflow? RQ3 (exploratory): How do task context (personal planning versus public communication) and relevant prior knowledge shape review practices? No contextual effect is inferred from Paper 1.

Directional hypothesis H1: the structured condition yields higher independently coded judgment quality. H2 is nondirectional: completion time and perceived effort differ. Improvements are uncertain; a quality–effort tradeoff or null result is plausible. Perceived trust is not the primary outcome and should not be inferred from UI completion.

## Phase A: formative evaluation

Recruit 6–8 adults who use generative AI at least monthly, purposively varied in experience and relevant subject knowledge. Conduct 45–60 minute consented sessions: short pre-task interview, two synthetic review tasks, think-aloud, and retrospective walkthrough. Ask what counts as evidence, how they resolve contradictory sources, whether completion implies correctness, and where the ledger adds burden. Avoid leading questions about trust improvement. Collect screen/audio only with specific consent; do not solicit private AI histories.

Use reflexive thematic analysis for strategies, misunderstandings, and unmet needs, with a documented researcher-position statement and analytic memos. Do not claim saturation from this convenience sample or use inter-rater reliability as a reflexive thematic analysis validity test. Record design revisions and freeze the evaluated UI before Phase B. Formative participants are excluded from Phase B.

## Phase B: randomized comparison

**Design:** two-arm between-participant study. Baseline: fixed question, AI-styled answer, identical source pack, and editable free-form notes. Structured: same materials and time budget, plus the evaluated claim–evidence workspace. Both conditions receive the same capability/uncertainty disclosure, typography, viewport constraints, source visibility, practice time, and final-response form. The baseline and study instrumentation are **not implemented in the public v1**; build and verify them before running the study. No live AI calls or open-web search in the primary experiment.

**Context manipulation:** interface is between participants; intended-use context is within participants, two personal-planning and two public-communication tasks. Assign each underlying task to each context equally across participants in both arms, using a balanced allocation schedule independent of task order. Never show the same answer twice to the same participant. Personal context: plan your own action from the information. Public context: prepare an informational notice others may use. Keep source packs, answer, time budget and scoring key identical across context variants. This manipulation changes use consequences, not truth or a claimed Reddit-community trait. Ask a neutral purpose-recall question after the task as a manipulation check; analyze failure in sensitivity analyses rather than excluding post-randomization cases. Context and interface×context effects are exploratory unless the final prospective power design explicitly supports confirmatory interaction testing.

**Sampling:** English-reading adults 18+, monthly GenAI use, desktop/laptop. Recruit via a consented participant platform or institutional pool, not Reddit identities. Stratify random assignment by self-reported GenAI frequency (monthly/weekly/daily collapsed to prespecified strata) with concealed computer allocation. Measure topic familiarity before tasks. Convenience sampling limits population inference. Record accessibility needs; offer equivalent accessible participation where possible; report exclusions transparently.

**Sample size:** an initial planning target is 120 analyzable participants, 60 per arm, **not a justified powered sample**. After Phase A and an independent small materials pilot (approximately 12–16, excluded from confirmatory analysis), simulate power for the specified ordinal mixed model with conservative participant/item variation, smallest effect of interest, and attrition. Freeze sample size and stopping rule in a public preregistration before confirmatory data collection. If resources cannot support it, label Phase B exploratory and report intervals rather than confirmatory claims. Do not estimate a target effect from the most favorable pilot contrast.

**Tasks:** four matched informational tasks plus one practice task, approximately 35–45 minutes total. Each task contains a short question, an AI-styled answer of 120–180 words, exactly three prespecified target claims, and 3–4 short locally hosted source documents. Include supported, contradicted, and genuinely unresolved or mixed claims; balance source length, reading complexity, claim difficulty, answer plausibility, and source reliability. Use at least two topics (e.g. fictional library policy and fictional campus transport). Assign task order using balanced Latin squares within each arm; each item appears in both arms. No real health, legal, or financial decisions.

**Procedure:** consent → background and familiarity questionnaire → arm assignment → 5-minute tutorial/practice → four review tasks (up to 6 minutes each) → identical final decision form after each task → post-task workload and usability questions → debrief. Record actual task duration; timeouts retain available final responses and receive a timeout indicator. Compensation does not depend on accuracy. No deceptive real-world policy claims: tell participants materials are simulated; pilot whether this lowers engagement. Freeze all materials and scoring keys with version/hash provenance.

**Final response, identical in both arms:** for each target claim choose supported / contradicted / mixed / unresolved, provide a brief rationale and source IDs, and indicate whether they would include the claim in a final informational answer (yes / qualified / no). Ask confidence in the judgment on a 0–100 scale. This common form reduces the mechanical advantage of scoring the structured interface's required fields. Analyze omissions of additional claims only exploratorily; the primary outcome uses prespecified targets to avoid rewarding a selected easy subset.

## Measures and coding

**Primary outcome:** per-target ordinal evidence-grounded judgment quality, 0–3, assessed from the common final response:

- 0: unsupported or incorrect judgment with no relevant evidential warrant.
- 1: defensible conclusion without adequate source reasoning, or partially relevant reasoning with a material error.
- 2: defensible conclusion with relevant source linkage but incomplete handling of scope or contradiction.
- 3: defensible conclusion with relevant evidence and appropriate handling of scope, contradiction, or unresolved uncertainty.

Create task-specific anchor examples and permissible judgments, including acceptable alternative interpretations; two domain-informed reviewers agree the key **before** data collection. “Unresolved” is correct only when the source pack warrants it. Two coders independently score de-identified final responses without arm labels or UI exports. Calibrate using pilot responses; then lock rubric. Report weighted Cohen’s kappa with uncertainty for ordinal scores before adjudication, plus disagreement patterns; adjudicate blind. Coding reliability is not evidence of construct validity. Probe partial unblinding from structured writing styles.

**Secondary:** false acceptance rate (unsupported/contradicted target claims endorsed without qualification / all such target claims); appropriate retention of supported claims; task completion time; source-document opens and revisits (interaction proxies, not proof of reading); task completion/abandonment; one prespecified 1–7 perceived mental-effort item after each task. Report this single item as perceived effort, not a validated NASA-TLX score. Exploratory confidence–accuracy alignment uses Brier scores for a clearly specified binary correctness transformation, with sensitivity to the rubric threshold. Do not conflate confidence with trust. UI record completion is a manipulation/process measure only.

## Analysis plan

Preregister treatment coding, outcome hierarchy, rubric, exclusions, missingness, sample size, model formulas, randomization, and multiplicity decisions. Primary intention-to-treat comparison uses a cumulative-link mixed model for ordinal quality with arm as the focal fixed effect; include prespecified context, task order and pre-task familiarity, participant random intercepts, and task/claim intercepts. With only four tasks, inspect stability; use task fixed effects in a prespecified sensitivity model. Evaluate proportional-odds and convergence assumptions; if untenable, use a prespecified simpler ordinal model with participant-cluster bootstrap intervals rather than selecting a significant model. Report effect size/odds ratio and 95% intervals plus predicted score distributions.

Secondary false acceptance uses a logistic mixed model with participant and item effects; time uses an appropriate log-time model with timeout/censoring sensitivity. Report raw distributions and accuracy–effort tradeoffs. Apply Holm adjustment within the prespecified secondary confirmatory family; treat all moderator/strategy analyses as exploratory. Do not claim no effect from nonsignificance. Publish protocol deviations and all prespecified outcomes.

Exclude only prespecified ineligible, duplicate, or technically unusable records, without inspecting treatment outcome; never exclude low accuracy or inconvenient strategies. Report randomized counts, exclusions, missing final responses, and dropout by arm. Primary observed-response analysis plus conservative missing-outcome bounds and a prespecified missingness sensitivity; do not silently score every dropout as incorrect or discard it. Report arm balance descriptively. No subgroup population claims from a small convenience sample.

## Confounds, threats, and controls

| Threat | Mitigation and remaining limitation |
| --- | --- |
| Source accessibility / web variability | Frozen local source packs; later ecological study needed for open-web review |
| More time or words in structured arm | Equal time budget; record actual time and burden; cannot isolate every scaffold component |
| Interface novelty and tutorial effects | Matched practice and presentation; novelty remains possible |
| Demand and form-filling effects | Common response form; blinded task-specific coding; boundary-comprehension probes |
| Prior knowledge / AI literacy | Premeasure and stratified randomization; exploratory moderation only |
| Task/claim selection | Prespecified targets for primary comparison; task allocation balanced across arms |
| Artificial materials | Transparent simulation prevents misinformation but limits ecological validity |
| Researcher allegiance / coder cues | Freeze protocol, blind coders, retain negative cases and disagreement |
| Small item/sample set | Conservative uncertainty, task sensitivity, limited generalization |
| Single condition bundle | Cannot attribute effects individually to ledger, prompts, or progress; ablation is future work |

## Ethics and data management

Seek institution-specific approval/determination; no approval currently exists. Obtain informed consent and a clear withdrawal deadline; avoid collecting names, personal prompts, or unrelated browsing. Keep contact/payment data separate. Record only consented interaction events, task responses, and optional audio; platform IDs are pseudonymous and still potentially personal. Store encrypted with restricted access and an approved retention schedule (proposal: identifiable logistics deleted after payment/withdrawal period; de-identified analytic data retained according to institutional policy). Do not publish raw audio/screens or potentially identifying quotes without separate consent and risk review. Share synthetic materials, scoring keys, code, and disclosure-safe aggregates; publish participant-level data only if consent and disclosure review support it. The public prototype has no remote telemetry and must not be repurposed for covert study logging.

## Concrete seed task and scoring anchors

The public demo supplies a seed task, not a validated experimental stimulus. Question: what does the fictional Northbridge Sunday library pilot offer? AI-styled claims: (1) access for every resident, (2) a twelve-week duration, (3) attendance increased by 40%. The source pack states adult cardholders at the Central branch only, a twelve-week duration, and that attendance will be evaluated later with no results published. Expected evidence judgments: contradicted / supported / unresolved respectively. No published result does not establish zero attendance change.

For claim 1, score 3 can identify the narrower eligibility and explain why it does not warrant “every resident”; score 1 can reach “contradicted” with no specific source reasoning. For claim 3, score 3 distinguishes absent results from evidence of no effect. Both personal and public contexts use the same factual rubric. Adoption/qualification is interpreted in context and assessed separately; public communication is not automatically “more correct” when more cautious. Independent experts must review anchors and ambiguity before use. Build the remaining matched tasks, source documents and comparator before a pilot; do not run a confirmatory study from this single seed task.

## Execution checklist

Ethics determination → source packs and task-specific rubric → baseline/instrumentation implementation and accessibility QA → formative work → documented UI revisions → independent materials pilot → power simulation → frozen preregistration → recruitment/randomization → blinded coding → preregistered analysis → disclosure-safe reporting. Every stage remains future work.
