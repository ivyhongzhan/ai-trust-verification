export const judgments = [
  "Unreviewed",
  "Supported",
  "Contradicted",
  "Mixed evidence",
  "Unresolved",
] as const;
export type Judgment = (typeof judgments)[number];
export interface Evidence {
  id: string;
  title: string;
  url: string;
  excerpt: string;
  relation: "Supports" | "Challenges" | "Context";
  limitation: string;
}
export interface Claim {
  id: string;
  text: string;
  judgment: Judgment;
  rationale: string;
  evidence: Evidence[];
  updatedAt: string;
}
export const contexts = ["Personal planning", "Public communication"] as const;
export type Context = (typeof contexts)[number];
export interface UseDecision {
  choice:
    "Undecided" | "Use as stated" | "Use with qualification" | "Do not use";
  reason: string;
  trustConsideration: string;
  distrustConsideration: string;
}
export interface Review {
  context: Context;
  useDecision: UseDecision;
  version: 1;
  question: string;
  answer: string;
  references: string;
  claims: Claim[];
}
export const uid = () => crypto.randomUUID();
export const blankDecision = (): UseDecision => ({
  choice: "Undecided",
  reason: "",
  trustConsideration: "",
  distrustConsideration: "",
});
export const emptyReview = (): Review => ({
  context: "Personal planning",
  useDecision: blankDecision(),
  version: 1,
  question: "",
  answer: "",
  references: "",
  claims: [],
});
export const newClaim = (text = ""): Claim => ({
  id: uid(),
  text,
  judgment: "Unreviewed",
  rationale: "",
  evidence: [],
  updatedAt: new Date().toISOString(),
});
export const safeUrl = (url: string) => {
  try {
    return ["https:", "http:"].includes(new URL(url).protocol);
  } catch {
    return false;
  }
};
export const complete = (c: Claim) =>
  Boolean(
    c.text.trim() &&
    c.judgment !== "Unreviewed" &&
    c.rationale.trim() &&
    (c.judgment === "Unresolved" ||
      c.evidence.some(
        (e) =>
          e.title.trim() &&
          e.excerpt.trim() &&
          e.limitation.trim() &&
          (!e.url || safeUrl(e.url)),
      )),
  );
export function parseReview(raw: string): Review {
  if (raw.length > 2_000_000) throw Error("File exceeds the 2 MB limit.");
  const d = JSON.parse(raw);
  const str = (x: unknown) => typeof x === "string" && x.length <= 100000;
  if (
    d?.version !== 1 ||
    !str(d.question) ||
    !str(d.answer) ||
    !str(d.references) ||
    !Array.isArray(d.claims) ||
    d.claims.length > 200
  )
    throw Error("Invalid review format.");
  const ids = new Set<string>();
  for (const c of d.claims) {
    if (
      !str(c.id) ||
      ids.has(c.id) ||
      !str(c.text) ||
      !judgments.includes(c.judgment) ||
      !str(c.rationale) ||
      !str(c.updatedAt) ||
      !Number.isFinite(Date.parse(c.updatedAt)) ||
      !Array.isArray(c.evidence) ||
      c.evidence.length > 100
    )
      throw Error("Invalid claim.");
    ids.add(c.id);
    const eids = new Set<string>();
    for (const e of c.evidence) {
      if (
        !str(e.id) ||
        eids.has(e.id) ||
        !str(e.title) ||
        !str(e.url) ||
        (e.url && !safeUrl(e.url)) ||
        !str(e.excerpt) ||
        !str(e.limitation) ||
        !["Supports", "Challenges", "Context"].includes(e.relation)
      )
        throw Error("Invalid evidence or unsafe source URL.");
      eids.add(e.id);
    }
  }
  if (d.context !== undefined && !contexts.includes(d.context))
    throw Error("Invalid task context.");
  if (
    d.useDecision !== undefined &&
    (![
      "Undecided",
      "Use as stated",
      "Use with qualification",
      "Do not use",
    ].includes(d.useDecision?.choice) ||
      !str(d.useDecision.reason) ||
      !str(d.useDecision.trustConsideration) ||
      !str(d.useDecision.distrustConsideration))
  )
    throw Error("Invalid use decision.");
  // Version 1 files without optional context fields receive explicit defaults.
  // Reconstruct only supported fields; discard unknown properties.
  return {
    context: d.context ?? "Personal planning",
    useDecision: d.useDecision
      ? {
          choice: d.useDecision.choice,
          reason: d.useDecision.reason,
          trustConsideration: d.useDecision.trustConsideration,
          distrustConsideration: d.useDecision.distrustConsideration,
        }
      : blankDecision(),
    version: 1,
    question: d.question,
    answer: d.answer,
    references: d.references,
    claims: d.claims.map((c: Claim) => ({
      id: c.id,
      text: c.text,
      judgment: c.judgment,
      rationale: c.rationale,
      updatedAt: c.updatedAt,
      evidence: c.evidence.map((e) => ({
        id: e.id,
        title: e.title,
        url: e.url,
        excerpt: e.excerpt,
        relation: e.relation,
        limitation: e.limitation,
      })),
    })),
  };
}
export function markdown(r: Review) {
  return `# AI Trust & Verification\n\nHuman-authored review; not an automated fact check.\n\n## Intended use context\n${r.context}\nUse decision: ${r.useDecision.choice}\nReason and conditions: ${r.useDecision.reason}\nWhat would justify relying on this answer: ${r.useDecision.trustConsideration}\nWhat gives reason for doubt: ${r.useDecision.distrustConsideration}\nThese are reflections, not validated trust scales or observed reliance.\n\n## Question\n${r.question}\n\n## Original answer\n${r.answer}\n\n## Supplied references (not reviewed automatically)\n${r.references}\n\n${r.claims.map((c, i) => `## ${i + 1}. ${c.text}\nJudgment: ${c.judgment}\nRecord complete: ${complete(c) ? "Yes" : "No"} (not a truth score)\nUpdated: ${c.updatedAt}\n\nRationale: ${c.rationale}\n\n${c.evidence.map((e) => `### ${e.title}\nURL: ${e.url}\nRelation: ${e.relation}\nExcerpt / observation: ${e.excerpt}\nScope / limitations: ${e.limitation}`).join("\n\n")}`).join("\n\n")}`;
}
export function demo(): Review {
  const a = newClaim(
    "The pilot gives every resident access to the library on Sundays.",
  );
  const b = newClaim("The pilot lasts twelve weeks.");
  const c = newClaim("The pilot increased attendance by 40%.");
  b.judgment = "Supported";
  b.rationale =
    "The supplied synthetic notice explicitly gives a twelve-week duration. This supports duration only.";
  b.evidence = [
    {
      id: uid(),
      title: "Synthetic municipal notice · excerpt B",
      url: "",
      excerpt:
        "The twelve-week pilot runs from 6 September through 22 November.",
      relation: "Supports",
      limitation:
        "Fictional demonstration source. No evidence about attendance or eligibility.",
    },
  ];
  return {
    context: "Personal planning",
    useDecision: blankDecision(),
    version: 1,
    question: "What does the fictional Northbridge library Sunday pilot offer?",
    answer:
      "The pilot gives every resident access to the library on Sundays. The pilot lasts twelve weeks. The pilot increased attendance by 40%.",
    references:
      "SYNTHETIC SOURCE PACK — all names, policies, dates and claims are invented for this demo.\n\nA · Municipal notice: Sunday access is available to adult library cardholders at the Central branch only.\n\nB · Municipal notice: The twelve-week pilot runs from 6 September through 22 November.\n\nC · Evaluation note: Attendance will be evaluated after the pilot ends; no attendance results have been published.",
    claims: [a, b, c],
  };
}
