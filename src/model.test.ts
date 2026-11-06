import { describe, it, expect } from "vitest";
import {
  demo,
  complete,
  newClaim,
  parseReview,
  markdown,
  safeUrl,
} from "./model";
describe("review records", () => {
  it("starts with one documented synthetic claim, not a truth percentage", () => {
    const d = demo();
    expect(d.claims.filter(complete)).toHaveLength(1);
    expect(d.references).toContain("SYNTHETIC");
  });
  it("requires reasoning and scoped evidence for a supported claim", () => {
    const c = newClaim("A");
    c.judgment = "Supported";
    expect(complete(c)).toBe(false);
    c.rationale = "Because";
    expect(complete(c)).toBe(false);
    c.evidence = demo().claims[1].evidence;
    expect(complete(c)).toBe(true);
    c.evidence[0].limitation = "";
    expect(complete(c)).toBe(false);
  });
  it("allows reasoned unresolved judgments without fabricated evidence", () => {
    const c = newClaim("Unknown");
    c.judgment = "Unresolved";
    c.rationale = "No accessible evidence";
    expect(complete(c)).toBe(true);
    c.text = "";
    expect(complete(c)).toBe(false);
  });
  it("roundtrips JSON without losing judgments or evidence", () => {
    const d = demo();
    expect(parseReview(JSON.stringify(d))).toEqual(d);
  });
  it.each([
    "javascript:alert(1)",
    "data:text/html,test",
    "file:///etc/passwd",
    "not a url",
  ])("rejects unsafe URL %s", (url) => {
    expect(safeUrl(url)).toBe(false);
    const d = demo();
    d.claims[1].evidence[0].url = url;
    expect(() => parseReview(JSON.stringify(d))).toThrow();
  });
  it("rejects malformed schema, duplicate identifiers and oversized imports", () => {
    expect(() => parseReview("{}")).toThrow();
    const d = demo();
    d.claims[1].id = d.claims[0].id;
    expect(() => parseReview(JSON.stringify(d))).toThrow();
    expect(() => parseReview(" ".repeat(2_000_001))).toThrow();
  });
  it("exports original context and source limits with explicit human judgment", () => {
    const d = demo();
    const m = markdown(d);
    expect(m).toContain(d.answer);
    expect(m).toContain("not a truth score");
    expect(m).toContain(d.claims[1].evidence[0].limitation);
  });
});
describe("context and use intentions", () => {
  it("preserves distinct trust/distrust reflections and use intentions across export", () => {
    const d = demo();
    d.context = "Public communication";
    d.useDecision = {
      choice: "Use with qualification",
      reason: "Only the duration is documented",
      trustConsideration: "Source is explicit",
      distrustConsideration: "Eligibility is overstated",
    };
    expect(parseReview(JSON.stringify(d))).toEqual(d);
    expect(markdown(d)).toContain("Public communication");
    expect(markdown(d)).toContain("not validated trust scales");
  });
  it("restores older v1 files with explicit context defaults", () => {
    const d = JSON.parse(JSON.stringify(demo()));
    delete d.context;
    delete d.useDecision;
    expect(parseReview(JSON.stringify(d)).context).toBe("Personal planning");
    expect(parseReview(JSON.stringify(d)).useDecision.choice).toBe("Undecided");
  });
  it("rejects invalid contexts and use decisions", () => {
    const d = JSON.parse(JSON.stringify(demo()));
    d.context = "proven community effect";
    expect(() => parseReview(JSON.stringify(d))).toThrow();
    delete d.context;
    d.useDecision.choice = "Verified";
    expect(() => parseReview(JSON.stringify(d))).toThrow();
  });
});
