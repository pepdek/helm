"use server";

import Anthropic from "@anthropic-ai/sdk";
import { aggregateShift, ShiftSummary } from "@/lib/agents/shift-digest";

const SYSTEM_PROMPT = `You write a short end-of-shift digest for a Trident Seafoods factory manager reading it at 6am.

Rules:
- You are an assistant summarizing data a human will act on. You never say you "resolved," "fixed," or "closed" anything — those are the manager's calls. Use language like "flagged for your review" or "recommends checking."
- Ground every claim in the numbers provided. Do not invent data.
- Plain English, 4-6 sentences, no headers or bullet lists, no markdown.
- Lead with the single most important thing the manager should know, then the rest in priority order.
- If nothing needs attention, say so plainly instead of manufacturing urgency.`;

function buildUserPrompt(summary: ShiftSummary): string {
  const flagLines = summary.flags.length
    ? summary.flags
        .map(
          (f) =>
            `- ${f.run.species} on ${f.run.line}: actual yield ${(f.actualYieldPct * 100).toFixed(1)}% vs target ${(f.expectedYieldPct * 100).toFixed(1)}% (${f.variancePct > 0 ? "+" : ""}${(f.variancePct * 100).toFixed(1)}pt)`
        )
        .join("\n")
    : "none";

  const holdLines = summary.qcHolds.length
    ? summary.qcHolds
        .map((h) => `- ${h.species}: ${h.reason} (${h.resolved ? "resolved" : "still open"})`)
        .join("\n")
    : "none";

  return `Shift: ${summary.date} ${summary.shift}, ${summary.line}

Yield anomalies flagged (${summary.flags.length} of ${summary.runs.length} runs):
${flagLines}

QC holds:
${holdLines}

Downtime: ${summary.downtimeMinutes} minutes${summary.downtimeReasons.length ? ` (${summary.downtimeReasons.join("; ")})` : ""}

Staffing: ${summary.staffing ? `${summary.staffing.actual} of ${summary.staffing.scheduled} scheduled, ${summary.staffing.overtimeHours} overtime hours` : "no staffing data logged"}

Write the digest now.`;
}

function fallbackDigest(summary: ShiftSummary): string {
  // ponytail: deterministic template so the demo still works without an
  // ANTHROPIC_API_KEY configured. Upgrade path is automatic once a key is set.
  const parts: string[] = [];
  if (summary.flags.length > 0) {
    const worst = summary.flags[0];
    parts.push(
      `${summary.flags.length} of ${summary.runs.length} runs came in outside yield tolerance, worst being ${worst.run.species} on ${worst.run.line} at ${(worst.actualYieldPct * 100).toFixed(1)}% against a ${(worst.expectedYieldPct * 100).toFixed(1)}% target — flagged for your review.`
    );
  } else if (summary.runs.length > 0) {
    parts.push(`All ${summary.runs.length} runs this shift held within yield tolerance.`);
  } else {
    parts.push(`No production runs logged for this shift.`);
  }
  if (summary.qcHolds.some((h) => !h.resolved)) {
    parts.push(`There's an open QC hold that still needs a decision.`);
  }
  if (summary.downtimeMinutes > 0) {
    parts.push(`Line logged ${summary.downtimeMinutes} minutes of downtime.`);
  }
  if (summary.staffing && summary.staffing.actual < summary.staffing.scheduled) {
    parts.push(
      `Staffed ${summary.staffing.actual} of ${summary.staffing.scheduled} scheduled, recommends checking coverage for the next shift.`
    );
  }
  parts.push(`(Generated from a template — set ANTHROPIC_API_KEY for the live narrative agent.)`);
  return parts.join(" ");
}

export async function generateShiftDigest(date: string, shift: "AM" | "PM", line: string) {
  const summary = aggregateShift(date, shift, line);

  if (!process.env.ANTHROPIC_API_KEY) {
    return { digest: fallbackDigest(summary), summary, usedModel: false as const };
  }

  const client = new Anthropic();
  const response = await client.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 400,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildUserPrompt(summary) }],
  });

  const digest = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();

  return { digest: digest || fallbackDigest(summary), summary, usedModel: true as const };
}
