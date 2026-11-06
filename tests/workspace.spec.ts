import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("user creates, documents, reloads, exports, and deletes a claim", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Add a claim manually" }).click();
  await page.getByLabel("CLAIM UNDER REVIEW").fill("A testable new claim");
  await page.getByRole("button", { name: "Add source", exact: true }).click();
  await page.getByLabel("Source title").fill("Independent source");
  await page
    .getByLabel("Relevant excerpt / observation")
    .fill("An observed passage");
  await page
    .getByLabel("Scope, limitations & source independence")
    .fill("One limited observation");
  await page
    .getByLabel("YOUR JUDGMENT", { exact: true })
    .selectOption("Mixed evidence");
  await page
    .getByLabel("REASONING & REMAINING UNCERTAINTY")
    .fill("The passage supports only part of the claim.");
  await expect(
    page.getByText("Record complete", { exact: true }),
  ).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: /04 Mixed evidence/ }).click();
  await expect(page.getByLabel("Source title")).toHaveValue(
    "Independent source",
  );
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "JSON", exact: true }).click();
  expect((await download).suggestedFilename()).toBe("verification-record.json");
  page.on("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Delete claim", exact: true }).click();
  await expect(
    page.getByRole("button", { name: /04 Mixed evidence/ }),
  ).toHaveCount(0);
});
test("replacement can be cancelled and invalid import leaves work intact", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Clear workspace" }).click();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.getByLabel("YOUR QUESTION")).not.toHaveValue("");
  await page.getByLabel("Import JSON", { exact: true }).setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"version":99}'),
  });
  await expect(page.getByRole("status")).toContainText("Invalid review format");
  await expect(page.getByLabel("YOUR QUESTION")).not.toHaveValue("");
});
test("research boundaries and mobile layout remain usable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Research & boundaries" }).click();
  await expect(
    page.getByRole("heading", { name: "What remains a hypothesis" }),
  ).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
test("workspace passes automated accessibility checks", async ({ page }) => {
  await page.goto("/");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
test("context changes retain evidence and reset only the use decision", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByLabel("Intended use decision", { exact: true })
    .selectOption("Use with qualification");
  await page
    .getByLabel("Reason, conditions & remaining checks")
    .fill("Conditional use");
  await page
    .getByLabel("What gives you reason for doubt?")
    .fill("The broad eligibility claim");
  await page
    .getByLabel("INTENDED USE", { exact: true })
    .selectOption("Public communication");
  await expect(
    page.getByLabel("Intended use decision", { exact: true }),
  ).toHaveValue("Undecided");
  await expect(
    page.getByLabel("Reason, conditions & remaining checks"),
  ).toHaveValue("");
  await expect(page.getByLabel("What gives you reason for doubt?")).toHaveValue(
    "The broad eligibility claim",
  );
  await expect(
    page.getByRole("button", { name: /02 Supported/ }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("INTENDED USE", { exact: true })).toHaveValue(
    "Public communication",
  );
});

test("valid exported JSON restores evidence, context, and intentions", async ({
  page,
}) => {
  const { demo } = await import("../src/model");
  const record = demo();
  record.context = "Public communication";
  record.useDecision.choice = "Use with qualification";
  record.useDecision.reason = "Only duration is documented";
  await page.goto("/");
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByLabel("Import JSON", { exact: true }).setInputFiles({
    name: "review.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(record)),
  });
  await expect(page.getByRole("status")).toContainText("Review imported");
  await expect(page.getByLabel("INTENDED USE", { exact: true })).toHaveValue(
    "Public communication",
  );
  await expect(
    page.getByLabel("Intended use decision", { exact: true }),
  ).toHaveValue("Use with qualification");
  await page.getByRole("button", { name: /02 Supported/ }).click();
  await expect(page.getByLabel("Source title")).toHaveValue(
    "Synthetic municipal notice · excerpt B",
  );
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("replacement dialog contains keyboard focus and Escape cancels", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Clear workspace" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page
    .getByRole("button", { name: "Replace workspace", exact: true })
    .focus();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Cancel", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(page.getByLabel("YOUR QUESTION")).not.toHaveValue("");
});
