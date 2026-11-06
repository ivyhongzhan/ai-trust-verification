# Research rationale

**AI Trust & Verification — An Interactive Research Prototype**
Hong Zhan · October 2026 · Implemented, not empirically evaluated

## Research question

How does a claim–evidence workspace, compared with an answer and free-form notes, affect the quality of evidence-grounded judgments and the effort of reviewing AI-generated informational answers?

The target is discerning review, not increased trust. A careful unresolved judgment can be appropriate; a fully documented judgment can still be wrong. “Trust”, observed reliance, judgment accuracy, and interface completion are different constructs. This prototype does not measure psychological trust, automate verification, or claim a calibrated reliance effect.

## Connection to Beyond the Aggregate

Zhan’s *Beyond the Aggregate: Trust and Distrust in Generative AI Across Technical Reddit Communities and Time* is a separate secondary-analysis manuscript (under review at PACM HCI/CSCW according to the author). [Public preprint](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7671698); [research repository](https://github.com/ivyhongzhan/genai-trust-reddit-analysis).

The manuscript was reviewed through its local Introduction, Methods, Discussion, Limitations, and Conclusion on 6 November 2026. It reports 8,519 canonical-label classification records from five prespecified technical Reddit communities, with 8,520 source records including one missing label. Dimensions use a separate archive of 4,964 parser-clean records. Archives have distinct denominators and were not joined. The contribution concerns community/time-stratified description and auditable measurement boundaries, not a product intervention or causal account of trust.

Important limitations include non-probability sampling; unavailable dimension-level annotation reliability; a uniform-field replacement estimand that does not reconstruct the source study’s mixed-field estimand; sparse/partial/unavailable temporal cells; and no valid inference of author occupation, individual attitude, actual AI use, reliance, or verification behavior. No Reddit data, identifiers, manuscript files, or frozen artifacts are copied into this prototype. Existing research files were read only.

The bridge is a new research question: if provenance and contextual boundaries matter for interpreting computational discourse, how might individuals document provenance and limits when examining an AI answer? This is an **analogy and design motivation**, not an empirical finding of the paper. The paper does not establish demand for this tool, select its features, or predict its effects. Formative work must examine whether the proposed workflow fits real practices.

## Paper 1 → gap → prototype → evaluation

**Empirical finding:** pooled classification ordering does not hold uniformly across the sampled communities; community/time stratification retains contextual composition that aggregate values alone do not reveal. This is descriptive corpus evidence, not evidence that one community verifies more carefully or needs a different interface.

**Gap:** the paper cannot observe verification episodes, reasons for reliance, or how task consequences affect use. Moving from this gap to an interactive study requires newly recruited people and independently specified behavior measures, not relabeling existing Reddit records.

**Prototype:** participants can inspect claim-specific sources, record support and doubt separately, and state whether/how they would use the answer. Two implemented contexts change the fictional purpose: planning one’s own library visit versus preparing a public notice for residents. The source pack remains the same, so context is not confused with a change in factual evidence. Switching context preserves evidence but resets the use decision for reconsideration; existing reflections remain editable and visibly retained. It is not a controlled experiment or a context-comparison log.

**Hypothesis:** public communication could prompt greater attention to scope and unresolved evidence because consequences extend to other readers. An alternative is additional burden with no quality benefit. Neither expectation follows causally from Paper 1. These are task-level use contexts, not proxies for subreddit membership or community culture.

**Future study:** compare the structured workflow with free-form notes using common outcome scoring, and counterbalance task contexts separately from interface assignment. The prototype supplies candidate interactions; causal claims require the future randomized study.

| Construct | Unit / evidence required | Current project boundary |
| --- | --- | --- |
| Trust/distrust discourse labels | Released text record and label pipeline | Paper 1 only; no labels imported into this app |
| Personal trust/distrust attitude | Person-level construct with separately justified measurement | Optional qualitative reflections are not validated scales |
| Verification behavior | Observed actions in an actual review episode | Public app does not collect telemetry; study instrumentation remains future work |
| Reliance | Observable adoption/action on AI advice | App records intended use only; a selected option is not observed reliance |
| Appropriate reliance | Reliance judged against a prespecified task/evidence criterion | Not computed; future study must define warranted adoption, rejection, and qualification |

## Literature and design reasoning

1. **Buçinca, Z., Malaya, M. B., & Gajos, K. Z. (2021).** *To Trust or to Think: Cognitive Forcing Functions Can Reduce Overreliance on AI in AI-assisted Decision-making.* PACM HCI 5(CSCW1), Article 188. [Author preprint](https://arxiv.org/abs/2102.09692), [DOI](https://doi.org/10.1145/3449287). Their studied deliberation interventions motivate considering both review quality and effort. Their setting differs from source-based generative-answer review. This interface is not a replication, and its optional documentation is not the same intervention.
2. **Bansal, G., et al. (2021).** *Does the Whole Exceed its Parts? The Effect of AI Explanations on Complementary Team Performance.* CHI ’21. [Author preprint](https://arxiv.org/abs/2006.14779), [DOI](https://doi.org/10.1145/3411764.3445717). Explanations should not be assumed to yield improved complementary performance. This motivates evaluating decisions independently of perceived helpfulness; adding a source ledger is not itself evidence of an improvement.
3. **Amershi, S., et al. (2019).** *Guidelines for Human-AI Interaction.* CHI ’19. [Publisher DOI](https://doi.org/10.1145/3290605.3300233), [Microsoft Research record](https://www.microsoft.com/en-us/research/publication/guidelines-for-human-ai-interaction/). Capability disclosure and correction inform explicit boundaries and editable records. General guidelines do not validate this particular workflow.

4. **Lee, J. D., & See, K. A. (2004).** *Trust in Automation: Designing for Appropriate Reliance.* Human Factors 46(1), 50–80. [Publisher DOI](https://doi.org/10.1518/hfes.46.1.50_30392). This foundational account motivates keeping trust, context and reliance conceptually distinct. It is not evidence that this generative-AI prototype calibrates trust.
5. **Lewicki, R. J., McAllister, D. J., & Bies, R. J. (1998).** *Trust and Distrust: New Relationships and Realities.* Academy of Management Review 23(3), 438–458. [Publisher DOI](https://doi.org/10.5465/amr.1998.926620). The conceptual distinction informs separate supporting and doubting reflections. Transfer from organizational relationships to AI use is a design interpretation, not validation of an AI trust/distrust measure.

These primary records were checked online on 6 November 2026. The SSRN page was unavailable to the browsing tool; the manuscript content was reviewed locally. No current acceptance or public-record change is inferred.

| Evidence status | Proposition | Interface decision | Risk / evaluation need |
| --- | --- | --- | --- |
| Prior empirical work, different setting | Deliberation can introduce effort tradeoffs | Optional claim-by-claim reasoning; compact source cards | Measure effort and abandonment, not just completion |
| Prior empirical work, different setting | Explanations need not improve joint performance | No trust score or “verified” badge | Independently score final judgments |
| Design guidance | Capabilities and correction should be clear | Manual editing, explicit scope statement, portable records | Check whether users understand boundaries |
| Design hypothesis | Linking excerpts and limitations may support discernment | Per-claim supports/challenges/context ledger | Test against free-form notes; negative results remain informative |
| Design hypothesis | Explicit unresolved judgments may discourage forced certainty | Unresolved can be complete with a rationale | Evaluate appropriate uncertainty and avoid rewarding indecision universally |
| Untested expectation | Review quality may improve without unacceptable burden | Three-column desktop / stacked mobile workspace | No benefit claimed before evaluation |

## Interaction decisions and tradeoffs

- **Manual claims:** users choose what to examine; sentence splitting would suggest unsupported coverage and mishandle compound claims. The cost is selection effort and possible omissions. Existing claims do not change when the original answer changes; the interface warns about reconciliation.
- **Evidence is plural and relational:** support, challenge, and context are user-authored relationships; no majority-vote truth inference. A source can be weak, non-independent, or only partially relevant.
- **Scope is part of evidence:** excerpt and source-limitation fields distinguish citation presence from evidential warrant. The tool cannot assess source quality or independence.
- **Documentation progress:** a nonempty claim, non-default judgment, rationale, and at least one scoped source complete a record. Unresolved judgments require reasoning but not invented evidence. This is a deterministic completeness rule, not validation of the rationale. It is intentionally not a percentage of truth, confidence, trust, or answer coverage.
- **User control:** reversible editing, explicit replacement confirmation, file exports, and local persistence. Deleting a claim is confirmed; source removal is immediate and has no undo in v1.
- **Cognitive burden:** context, claim map, and detail are co-visible on desktop; mobile stacks them. Progressive source entry limits initial clutter. These are design decisions, not usability findings.
- **Transparency versus prompting effects:** scaffolding and progress can create demand characteristics or shallow form filling. Completion may be gamed with poor text. The study must score reasoning independently and test interpretation of completion.

## Potential contribution, not established novelty

The current deliverable is a working, inspectable research artifact with an explicit claim–evidence–judgment model and a falsifiable evaluation protocol. It is not yet a validated intervention or a demonstrated novel research contribution. Before publication, broaden related-work review to provenance interfaces, claim verification workbenches, information literacy, and collaborative sensemaking; compare actual workflows and establish the design gap. This is currently an individual review tool, not a collaborative CSCW system.
