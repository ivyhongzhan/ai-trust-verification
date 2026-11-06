import React, { useEffect, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Download,
  FileText,
  FlaskConical,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import {
  type Review,
  type Claim,
  type Evidence,
  demo,
  emptyReview,
  newClaim,
  uid,
  complete,
  judgments,
  parseReview,
  markdown,
  safeUrl,
  contexts,
  type Context,
} from "./model";
import "./style.css";
const KEY = "aitv-review-v1";
function ReplacementDialog({
  kind,
  cancel,
  replace,
}: {
  kind: "demo" | "clear";
  cancel: () => void;
  replace: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement;
    dialog?.showModal();
    return () => {
      dialog?.close();
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby="dialogTitle"
      onCancel={cancel}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const buttons =
          ref.current?.querySelectorAll<HTMLButtonElement>("button");
        if (!buttons?.length) return;
        const first = buttons[0],
          last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }}
    >
      <h2 id="dialogTitle">
        {kind === "demo"
          ? "Replace with synthetic demo?"
          : "Clear this workspace?"}
      </h2>
      <p>
        This replaces your current local record. Export it first if you want to
        keep it.
      </p>
      <button autoFocus onClick={cancel}>
        Cancel
      </button>
      <button className="primary" onClick={replace}>
        Replace workspace
      </button>
    </dialog>
  );
}
function App() {
  const [notice, setNotice] = useState("");
  const [review, setReview] = useState<Review>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? parseReview(raw) : demo();
    } catch {
      return demo();
    }
  });
  const [selected, setSelected] = useState(review.claims[0]?.id || "");
  const [tab, setTab] = useState<"workspace" | "research">("workspace");
  const [filter, setFilter] = useState("All claims");
  const [confirm, setConfirm] = useState<"demo" | "clear" | null>(null);
  const [saved, setSaved] = useState("");
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(review));
      setSaved("Saved on this browser");
    } catch {
      setSaved("Storage unavailable — export to keep your work");
    }
  }, [review]);
  const active = review.claims.find((c) => c.id === selected);
  const done = review.claims.filter(complete).length;
  function patch(c: Claim) {
    setReview((r) => ({
      ...r,
      claims: r.claims.map((x) =>
        x.id === c.id ? { ...c, updatedAt: new Date().toISOString() } : x,
      ),
    }));
  }
  function evidence(e: Evidence) {
    if (active)
      patch({
        ...active,
        evidence: active.evidence.map((x) => (x.id === e.id ? e : x)),
      });
  }
  function download(format: "json" | "md") {
    const blob = new Blob(
      [format === "json" ? JSON.stringify(review, null, 2) : markdown(review)],
      { type: format === "json" ? "application/json" : "text/markdown" },
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `verification-record.${format}`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    setNotice(
      "Exported your review. Check it for private information before sharing.",
    );
  }
  async function importFile(file?: File) {
    if (!file) return;
    try {
      if (file.size > 2_000_000) throw Error("File exceeds the 2 MB limit.");
      const next = parseReview(await file.text());
      if (
        !window.confirm(
          "Replace the current workspace with this imported review? Export first to keep your current work.",
        )
      )
        return;
      setReview(next);
      setSelected(next.claims[0]?.id || "");
      setNotice("Review imported. All judgments remain user-authored.");
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Import failed.");
    }
  }
  return (
    <>
      <header>
        <a className="brand" href="#">
          <span className="brandIcon">
            <ShieldCheck size={23} />
          </span>
          AI Trust & Verification
          <span className="prototype">RESEARCH PROTOTYPE</span>
        </a>
        <a
          className="byline"
          href="https://github.com/ivyhongzhan"
          target="_blank"
          rel="noreferrer"
        >
          Hong Zhan <ArrowUpRight size={14} />
        </a>
      </header>
      <main>
        <div className="hero">
          <div>
            <div className="eyebrow">
              HUMAN–AI INTERACTION / RESEARCH THROUGH DESIGN
            </div>
            <h1>
              Make the evidence visible.
              <br />
              <span>Keep the judgment yours.</span>
            </h1>
            <p>
              A workspace for examining AI-generated answers, one claim at a
              time.
              <br />
              Trace sources, weigh uncertainty, and document your reasoning.
            </p>
          </div>
          <aside className="heroAside">
            <FlaskConical size={23} />
            <strong>A question, not a promise.</strong>
            <p>
              Can structured evidence review support more discerning AI use
              without excessive effort?
            </p>
            <span>Implemented prototype · Not user evaluated</span>
          </aside>
        </div>
        <section className="lineage" aria-label="Research trajectory">
          <article>
            <span>01 / RESEARCH FOUNDATION</span>
            <strong>Beyond the Aggregate: Trust and Distrust in Generative AI Across Technical Reddit Communities and Time</strong>
            <p>
              8,519 classified records across five technical communities.
              Discourse labels do not measure personal trust.
            </p>
            <a
              href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7671698"
              target="_blank"
              rel="noreferrer"
            >
              Read Paper ↗
            </a>{" "}
            <a
              href="https://github.com/ivyhongzhan/genai-trust-reddit-analysis"
              target="_blank"
              rel="noreferrer"
            >
              Code ↗
            </a>
          </article>
          <article>
            <span>02 / RESEARCH GAP</span>
            <strong>From expression to practice</strong>
            <p>
              How people examine evidence and decide whether to use an AI answer
              was not measured in{" "}
              <em>Beyond the Aggregate: Trust and Distrust in Generative AI Across Technical Reddit Communities and Time</em>.
            </p>
          </article>
          <article>
            <span>03 / THIS PROTOTYPE</span>
            <strong>Make review inspectable</strong>
            <p>
              Separate source evidence, human judgment, and intended use.
              Compare two proposed use contexts.
            </p>
          </article>
          <article>
            <span>04 / FUTURE STUDY</span>
            <strong>Test quality and effort</strong>
            <p>
              Compare a structured workflow with free-form notes. Context
              effects are hypotheses, not Reddit findings.
            </p>
          </article>
        </section>
        <nav aria-label="Main navigation">
          <button
            className={tab === "workspace" ? "navActive" : ""}
            onClick={() => setTab("workspace")}
          >
            Verification workspace
          </button>
          <button
            className={tab === "research" ? "navActive" : ""}
            onClick={() => setTab("research")}
          >
            Research & boundaries
          </button>
          <span>Local-first · No API key · No AI requests</span>
        </nav>
        {notice && (
          <div role="status" className="notice">
            {notice}
            <button
              aria-label="Dismiss notification"
              onClick={() => setNotice("")}
            >
              ×
            </button>
          </div>
        )}
        {tab === "research" ? (
          <section className="research">
            <div className="eyebrow">RESEARCH BRIEF</div>
            <h2>From discourse to observable review practices</h2>
            <p>
              <strong>Prior research:</strong>{" "}
              <a href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7671698">
                Beyond the Aggregate: Trust and Distrust in Generative AI Across
                Technical Reddit Communities and Time
              </a>{" "}
              ·{" "}
              <a href="https://github.com/ivyhongzhan/genai-trust-reddit-analysis">
                Paper code
              </a>
              . Under review at PACM HCI (CSCW), according to the author.
            </p>
            <p>
              Hong Zhan’s <em>Beyond the Aggregate</em> describes trust
              discourse in 8,519 valid classification records from five
              technical Reddit communities. It does not measure individual
              trust, reliance, or verification behavior. This prototype proposes
              a separate empirical direction.
            </p>
            <h3>Core research question</h3>
            <p>
              How does a claim–evidence workspace, compared with an answer and
              free-form notes, affect the quality of evidence-grounded judgments
              and the effort of reviewing AI-generated informational answers?
            </p>
            <div className="researchGrid">
              <article>
                <h3>What is implemented</h3>
                <p>
                  Manual claim selection, editable source records, multiple
                  evidence relations, explicit uncertainty, local persistence,
                  and portable review exports.
                </p>
              </article>
              <article>
                <h3>What remains a hypothesis</h3>
                <p>
                  Better judgment quality, reduced uncritical acceptance, and
                  manageable workload. No participants have been recruited and
                  no effects have been measured.
                </p>
              </article>
            </div>
            <h3>Design foundations</h3>
            <p>
              <a href="https://arxiv.org/abs/2102.09692">
                Buçinca, Malaya & Gajos (2021)
              </a>{" "}
              motivates testing deliberation alongside effort.{" "}
              <a href="https://arxiv.org/abs/2006.14779">
                Bansal et al. (2021)
              </a>{" "}
              cautions against equating explanations with better joint
              performance.{" "}
              <a href="https://doi.org/10.1145/3290605.3300233">
                Amershi et al. (2019)
              </a>{" "}
              informs capability disclosure and user correction. These works do
              not validate this interface.
            </p>
            <h3>Four constructs, kept separate</h3>
            <p>
              Discourse labels describe released text records. Personal trust
              attitudes require separate person-level measurement. Verification
              behavior requires observing what people do. Appropriate reliance
              requires a task-specific criterion for when using AI advice is
              warranted. Neither a completed record nor a self-reported use
              intention establishes any of the other constructs.
            </p>
            <h3>Proposed evaluation</h3>
            <p>
              A formative usability phase followed by a preregistered randomized
              comparison with matched source packs. Primary outcome:
              independently scored evidence-grounded judgment quality. Secondary
              outcomes: false acceptance, review time, source use, and perceived
              effort. The full protocol specifies sampling, power planning,
              blinded coding, confounds, and ethics.
            </p>
            <a
              className="textLink"
              href="https://github.com/ivyhongzhan/ai-trust-verification/tree/main/docs"
            >
              Read rationale, study protocol & implementation guide{" "}
              <ArrowUpRight size={16} />
            </a>
          </section>
        ) : (
          <>
            <div className="toolbar">
              <div>
                <span className="liveDot" />
                {saved}
              </div>
              <div>
                <button onClick={() => setConfirm("demo")}>
                  Load synthetic demo
                </button>
                <label className="button">
                  Import JSON
                  <input
                    aria-label="Import JSON"
                    type="file"
                    accept=".json,application/json"
                    onChange={(e) => {
                      void importFile(e.target.files?.[0]);
                      e.target.value = "";
                    }}
                  />
                </label>
                <button onClick={() => download("json")}>
                  <Download size={14} /> JSON
                </button>
                <button onClick={() => download("md")}>
                  <Download size={14} /> Markdown
                </button>
                <button
                  aria-label="Clear workspace"
                  onClick={() => setConfirm("clear")}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="boundary">
              <ShieldCheck size={18} />
              <p>
                <strong>You are the reviewer.</strong> The system does not find
                factual errors, fetch sources, or verify claims. Completion
                tracks documentation, never truth.
              </p>
            </div>
            <section className="contextPanel">
              <div>
                <div className="eyebrow">
                  CONTEXTUAL DIFFERENCES / DESIGN HYPOTHESIS
                </div>
                <h2>Same answer. Different consequences of use.</h2>
                <p>
                  Explore whether intended use changes what you need to check.
                  These fictional scenarios do not explain community differences
                  described in the prior research.
                </p>
              </div>
              <label>
                INTENDED USE
                <select
                  aria-label="INTENDED USE"
                  value={review.context}
                  onChange={(e) => {
                    setReview({
                      ...review,
                      context: e.target.value as Context,
                      useDecision: {
                        ...review.useDecision,
                        choice: "Undecided",
                        reason: "",
                      },
                    });
                    setNotice(
                      "Context changed. Evidence is retained; reconsider your use decision.",
                    );
                  }}
                >
                  {contexts.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <span>
                  {review.context === "Personal planning"
                    ? "Plan your own Sunday visit. What would you check before acting?"
                    : "Prepare a public notice for residents. What qualifications and unresolved claims must be visible?"}
                </span>
              </label>
            </section>
            <div className="workspace">
              <section className="panel inputPanel">
                <div className="sectionTitle">
                  <span className="step">01</span>
                  <h2>Set the context</h2>
                </div>
                <label>
                  YOUR QUESTION
                  <textarea
                    rows={2}
                    value={review.question}
                    onChange={(e) =>
                      setReview({ ...review, question: e.target.value })
                    }
                    placeholder="What did you ask the AI?"
                  />
                </label>
                <label>
                  AI-GENERATED ANSWER
                  <textarea
                    rows={5}
                    value={review.answer}
                    onChange={(e) =>
                      setReview({ ...review, answer: e.target.value })
                    }
                    placeholder="Paste an answer to examine…"
                  />
                </label>
                <p className="hint">
                  Editing the answer does not update existing claims. Reconcile
                  them manually.
                </p>
                <label>
                  REFERENCE MATERIAL <span>OPTIONAL</span>
                  <textarea
                    rows={8}
                    value={review.references}
                    onChange={(e) =>
                      setReview({ ...review, references: e.target.value })
                    }
                    placeholder="Paste source links, excerpts or context. Nothing is fetched automatically."
                  />
                </label>
                <p className="hint">
                  Demo content is entirely synthetic. Enter only information you
                  are comfortable storing in this browser. No analytics or
                  background collection.
                </p>
                <details>
                  <summary>How to review an answer</summary>
                  <ol>
                    <li>Add specific, independently checkable claims.</li>
                    <li>
                      Read sources and record both supporting and challenging
                      evidence.
                    </li>
                    <li>Explain your judgment. Leave uncertainty visible.</li>
                    <li>Export a review you can revisit.</li>
                  </ol>
                </details>
              </section>
              <section className="panel claimsPanel">
                <div className="sectionTitle">
                  <span className="step">02</span>
                  <h2>Map the claims</h2>
                </div>
                <div className="progressLabel">
                  <strong>
                    {done} / {review.claims.length}
                  </strong>
                  <span>records complete</span>
                </div>
                <progress
                  aria-label="Review documentation progress"
                  value={done}
                  max={review.claims.length || 1}
                />
                <p className="hint">
                  A complete record has a judgment, reasoning, and evidence with
                  scope notes. “Unresolved” can be complete with reasoning
                  alone.
                </p>
                <label className="filterLabel">
                  SHOW
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option>All claims</option>
                    <option>Needs documentation</option>
                    <option>Complete records</option>
                  </select>
                </label>
                <div className="claimList">
                  {review.claims
                    .filter(
                      (c) =>
                        filter === "All claims" ||
                        (filter === "Complete records"
                          ? complete(c)
                          : !complete(c)),
                    )
                    .map((c) => (
                      <button
                        key={c.id}
                        className={`claimCard ${selected === c.id ? "selected" : ""}`}
                        onClick={() => setSelected(c.id)}
                      >
                        <div>
                          <span className="claimNumber">
                            {String(review.claims.indexOf(c) + 1).padStart(
                              2,
                              "0",
                            )}
                          </span>
                          <span
                            className={
                              "badge " +
                              (c.judgment === "Supported" ? "supported" : "")
                            }
                          >
                            {c.judgment}
                          </span>
                        </div>
                        <p>{c.text || "Untitled claim"}</p>
                        <small>
                          {c.evidence.length} source record
                          {c.evidence.length !== 1 ? "s" : ""} ·{" "}
                          {complete(c) ? "Documented" : "Needs documentation"}
                        </small>
                        <ChevronRight className="chevron" size={16} />
                      </button>
                    ))}
                </div>
                <button
                  className="addClaim"
                  onClick={() => {
                    const c = newClaim();
                    setReview({ ...review, claims: [...review.claims, c] });
                    setSelected(c.id);
                    setFilter("All claims");
                  }}
                >
                  <Plus size={16} /> Add a claim manually
                </button>
              </section>
              <section className="panel reviewPanel">
                <div className="sectionTitle">
                  <span className="step">03</span>
                  <h2>Examine & decide</h2>
                </div>
                {active ? (
                  <>
                    <label>
                      CLAIM UNDER REVIEW
                      <textarea
                        rows={3}
                        value={active.text}
                        onChange={(e) =>
                          patch({ ...active, text: e.target.value })
                        }
                      />
                    </label>
                    <div className="evidenceHeader">
                      <h3>
                        Evidence ledger <span>{active.evidence.length}</span>
                      </h3>
                      <button
                        onClick={() =>
                          patch({
                            ...active,
                            evidence: [
                              ...active.evidence,
                              {
                                id: uid(),
                                title: "",
                                url: "",
                                excerpt: "",
                                relation: "Context",
                                limitation: "",
                              },
                            ],
                          })
                        }
                      >
                        <Plus size={14} /> Add source
                      </button>
                    </div>
                    {!active.evidence.length && (
                      <div className="empty">
                        <FileText size={25} />
                        <strong>No evidence recorded yet</strong>
                        <p>
                          Read a source, record what it says, and explain its
                          scope. A citation alone is not support.
                        </p>
                      </div>
                    )}
                    {active.evidence.map((e, i) => (
                      <fieldset className="evidence" key={e.id}>
                        <legend>Source {i + 1}</legend>
                        <label>
                          Source title
                          <input
                            value={e.title}
                            onChange={(x) =>
                              evidence({ ...e, title: x.target.value })
                            }
                          />
                        </label>
                        <label>
                          Source URL (optional)
                          <input
                            type="url"
                            value={e.url}
                            onChange={(x) =>
                              evidence({ ...e, url: x.target.value })
                            }
                            placeholder="https://…"
                          />
                        </label>
                        {e.url && !safeUrl(e.url) && (
                          <p role="alert">
                            Use a full http:// or https:// URL.
                          </p>
                        )}
                        {safeUrl(e.url) && (
                          <a href={e.url} target="_blank" rel="noreferrer">
                            Open source <ArrowUpRight size={12} />
                          </a>
                        )}
                        <label>
                          Relationship to claim
                          <select
                            value={e.relation}
                            onChange={(x) =>
                              evidence({
                                ...e,
                                relation: x.target
                                  .value as Evidence["relation"],
                              })
                            }
                          >
                            <option>Supports</option>
                            <option>Challenges</option>
                            <option>Context</option>
                          </select>
                        </label>
                        <label>
                          Relevant excerpt / observation
                          <textarea
                            rows={3}
                            value={e.excerpt}
                            onChange={(x) =>
                              evidence({ ...e, excerpt: x.target.value })
                            }
                          />
                        </label>
                        <label>
                          Scope, limitations & source independence
                          <textarea
                            rows={2}
                            placeholder="What does this source not establish? Is it independent?"
                            value={e.limitation}
                            onChange={(x) =>
                              evidence({ ...e, limitation: x.target.value })
                            }
                          />
                        </label>
                        <button
                          onClick={() =>
                            patch({
                              ...active,
                              evidence: active.evidence.filter(
                                (x) => x.id !== e.id,
                              ),
                            })
                          }
                        >
                          Remove source {i + 1}
                        </button>
                      </fieldset>
                    ))}
                    <div className="judgmentBox">
                      <label>
                        YOUR JUDGMENT
                        <select
                          aria-label="YOUR JUDGMENT"
                          value={active.judgment}
                          onChange={(e) =>
                            patch({
                              ...active,
                              judgment: e.target.value as Claim["judgment"],
                            })
                          }
                        >
                          {judgments.map((j) => (
                            <option key={j}>{j}</option>
                          ))}
                        </select>
                      </label>
                      <label>
                        REASONING & REMAINING UNCERTAINTY
                        <textarea
                          rows={3}
                          placeholder="What warrants your judgment? What remains unknown?"
                          value={active.rationale}
                          onChange={(e) =>
                            patch({ ...active, rationale: e.target.value })
                          }
                        />
                      </label>
                      <p className="hint">
                        “Supported” records your assessment of the evidence. The
                        system does not endorse it.
                      </p>
                    </div>
                    <div className="recordFooter">
                      <span>
                        {complete(active) ? (
                          <>
                            <Check size={14} /> Record complete
                          </>
                        ) : (
                          "Incomplete documentation"
                        )}
                      </span>
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Delete this claim and its evidence?",
                            )
                          ) {
                            setReview({
                              ...review,
                              claims: review.claims.filter(
                                (c) => c.id !== active.id,
                              ),
                            });
                            setSelected(
                              review.claims.find((c) => c.id !== active.id)
                                ?.id || "",
                            );
                          }
                        }}
                      >
                        Delete claim
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="empty">
                    <FileText />
                    <p>Add or select a claim to begin.</p>
                  </div>
                )}
              </section>
            </div>
            <section className="usePanel">
              <div>
                <div className="eyebrow">
                  REFLECT / INTENDED USE, NOT OBSERVED RELIANCE
                </div>
                <h2>Would you use this answer in this context?</h2>
                <p>
                  Trust and distrust can have distinct reasons. Record both
                  without reducing them to a single score. These optional
                  reflections are not validated psychological measures.
                </p>
              </div>
              <div className="useFields">
                <label>
                  What would justify relying on this answer?
                  <textarea
                    rows={2}
                    value={review.useDecision.trustConsideration}
                    onChange={(e) =>
                      setReview({
                        ...review,
                        useDecision: {
                          ...review.useDecision,
                          trustConsideration: e.target.value,
                        },
                      })
                    }
                  />
                </label>
                <label>
                  What gives you reason for doubt?
                  <textarea
                    rows={2}
                    value={review.useDecision.distrustConsideration}
                    onChange={(e) =>
                      setReview({
                        ...review,
                        useDecision: {
                          ...review.useDecision,
                          distrustConsideration: e.target.value,
                        },
                      })
                    }
                  />
                </label>
                <label>
                  Intended use decision
                  <select
                    aria-label="Intended use decision"
                    value={review.useDecision.choice}
                    onChange={(e) =>
                      setReview({
                        ...review,
                        useDecision: {
                          ...review.useDecision,
                          choice: e.target
                            .value as Review["useDecision"]["choice"],
                        },
                      })
                    }
                  >
                    {[
                      "Undecided",
                      "Use as stated",
                      "Use with qualification",
                      "Do not use",
                    ].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Reason, conditions & remaining checks
                  <textarea
                    rows={2}
                    value={review.useDecision.reason}
                    onChange={(e) =>
                      setReview({
                        ...review,
                        useDecision: {
                          ...review.useDecision,
                          reason: e.target.value,
                        },
                      })
                    }
                  />
                </label>
              </div>
            </section>
          </>
        )}
        <footer>
          <span>Hong Zhan · Independent research prototype · 2026</span>
          <span>Designed to make uncertainty inspectable.</span>
        </footer>
      </main>
      {confirm && (
        <ReplacementDialog
          kind={confirm}
          cancel={() => setConfirm(null)}
          replace={() => {
            const r = confirm === "demo" ? demo() : emptyReview();
            setReview(r);
            setSelected(r.claims[0]?.id || "");
            setFilter("All claims");
            setConfirm(null);
            setNotice("Workspace replaced.");
          }}
        />
      )}
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
