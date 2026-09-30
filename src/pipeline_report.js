const response = JSON.parse(inputData.pipeline_response);

if (response.errors?.length) {
  throw new Error(JSON.stringify(response.errors));
}

const board = response.data?.boards?.[0];
const items = board?.items_page?.items;

if (!Array.isArray(items)) {
  throw new Error("Board records are missing.");
}

if (board.items_page.cursor || items.length !== board.items_count) {
  throw new Error("Incomplete data: not all board records were fetched.");
}

// Find columns by their titles.
const required = [
  "Candidate Name", "Stage", "Submitted Date", "Last Updated"
];

const columns = Object.fromEntries(
  board.columns.map(c => [c.title, c.id])
);

for (const title of required) {
  if (!columns[title]) {
    throw new Error(`Required column missing: ${title}`);
  }
}

const clean = value =>
  String(value ?? "").trim().replace(/\s+/g, " ");

const stages = [
  "Sourced",
  "Screened",
  "Submitted to Client",
  "Client Interview",
  "Offer Extended",
  "Placed"
];

const stageLookup = Object.fromEntries(
  stages.map(stage => [stage.toLowerCase(), stage])
);

Object.assign(stageLookup, {
  "submitted": "Submitted to Client",
  "interview": "Client Interview",
  "offer": "Offer Extended"
});

const issues = [];
const names = new Map();
let standardizedStages = 0;

const records = items.map(item => {
  const values = Object.fromEntries(
    item.column_values.map(c => [c.id, clean(c.text)])
  );

  const candidate = values[columns["Candidate Name"]] || "";
  const originalStage = values[columns["Stage"]] || "";
  const stage = stageLookup[originalStage.toLowerCase()] || "";
  const submittedDate = values[columns["Submitted Date"]] || "";
  const lastUpdated = values[columns["Last Updated"]] || "";

  if (!candidate) issues.push(`${item.name}: missing candidate name`);
  if (!originalStage) issues.push(`${item.name}: missing stage`);
  else if (!stage) {
    issues.push(`${item.name}: unexpected stage "${originalStage}"`);
  }

  if (!submittedDate) {
    issues.push(`${item.name}: missing Submitted Date`);
  }
  if (!lastUpdated) {
    issues.push(`${item.name}: missing Last Updated`);
  }

  if (stage && stage !== originalStage) standardizedStages++;

  if (candidate) {
    const key = candidate.toLowerCase();
    const group = names.get(key) || [];
    group.push(item.name);
    names.set(key, group);
  }

  return {
    record_id: item.name,
    monday_item_id: item.id,
    candidate,
    original_stage: originalStage,
    stage,
    submitted_date: submittedDate,
    last_updated: lastUpdated
  };
});

// Matching names are review flags, not confirmed duplicates.
for (const [name, ids] of names) {
  if (ids.length > 1) {
    issues.push(
      `Possible duplicate: ${name} — ${ids.join(", ")}; confirm identity`
    );
  }
}

const current = Object.fromEntries(
  stages.map(stage => [
    stage,
    records.filter(r => r.stage === stage).length
  ])
);

const report = [
  "Weekly pipeline snapshot",
  `Total records: ${records.length}`,
  "",
  "Current stage counts:",
  ...stages.map(stage => `${stage}: ${current[stage]}`),
  "",
  "Cumulative counts (assuming stages progress in order):",
  ...stages.map((stage, index) =>
    `${stage}: ${stages.slice(index).reduce(
      (sum, laterStage) => sum + current[laterStage], 0
    )}`
  ),
  "",
  "Scope: all current board records.",
  "Cumulative counts overlap; do not add them together."
].join("\n");

return {
  review_status: issues.length ? "NEEDS REVIEW" : "CHECKS PASSED",
  record_count: records.length,
  standardized_stages: standardizedStages,
  issue_count: issues.length,
  issues: issues.join("\n") || "No issues found.",
  records_json: JSON.stringify(records),
  report_subject: "Weekly recruitment pipeline report",
  report_body: issues.length
    ? "Report withheld: data needs review."
    : report
};
