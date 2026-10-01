# Automation Projects

A collection of end-to-end automation projects I have built, configured, and documented — mainly **Zapier** workflows connecting **monday.com**, **Google Workspace** (Forms, Sheets, Gmail), **Zapier Forms & Tables**, and **JavaScript**.

Each project lives in its own folder with its own README, screenshots, and code. Pick one below to see how it works.

## Projects

| Project | What it does | Tools | Status |
| --- | --- | --- | --- |
| **[Weekly Recruitment Pipeline Report](weekly-recruitment-pipeline-report/)** | A scheduled weekly report on a recruitment pipeline with data-quality checks built in. Reads the monday.com board through GraphQL, normalizes stage labels, flags issues, then routes to either a data review alert or the weekly report email. | monday.com, Zapier, JavaScript, GraphQL, Gmail | Core build completed and tested (42 records retrieved, 5 issues flagged, alert delivered); clean-data report branch not yet verified |
| **[Logistics CRM & Lead Confirmation](logistics-crm-automation/)** | Lead intake for a logistics business. A monday.com WorkForm captures each inquiry on a Leads board; a Zap waits for the record to finish populating, retrieves it by Item ID, then either emails the prospect an acknowledgment or creates an internal work-assignment item. Qualified-lead-to-deal handoff is planned next. | monday.com, WorkForm, Zapier, Gmail | Boards, form, and Zap with delay + Item ID lookup and Gmail/Create Item paths configured; step tests passing; publication and live delivery not yet verified |
| **[TuckerTech Intake & Technician Routing](tuckertech-intake-routing/)** | Repair-shop customer intake. A Google Form feeds Zapier; requests are date-formatted, split by device type, and recorded in a Google Sheets tracker. After a 30-minute review window, PC requests are assigned to Sarah and Mac requests to Joey; other devices are recorded as Declined and receive a reply email. | Google Forms, Zapier, Google Sheets, Gmail | Core workflow configured and partially tested (trigger, formatter, path rules, row creation); technician-assignment updates and declined-email delivery not yet verified |
| **[Tucker Request Tracker: Form → Create or Update](Tucker-table-form-zapier/)** | A Zapier form collects customer details; an exact-email table lookup routes new customers to record creation and existing customers to a targeted update. The captured update appends Notes; a COUNT + 1 display-ID extension is documented separately. | Zapier Forms, Zapier Tables, Paths by Zapier | Table, form, lookup, and path rules configured; found-result routing tested; update mappings captured. Saved create/update results and publication not verified; ID extension blocked by account feature access |

## Repository structure

```text
.
├── weekly-recruitment-pipeline-report/   # scheduled pipeline report with data-quality checks
├── logistics-crm-automation/             # lead intake form + confirmation email
├── tuckertech-intake-routing/            # repair-shop intake: form → tracker → technician routing
├── Tucker-table-form-zapier/             # native Zapier form + table lookup + create/update paths
└── _template/                            # skeleton used for each new project README
```

## How to read this repository

- Every top-level folder is a **self-contained project**. Start from its `README.md`.
- Each project README covers the business problem, the workflow (with a diagram), the exact configuration steps, field mappings, testing evidence, and an honest verification status — what was tested versus what was not.
- Screenshots are included for the key configuration steps, with account details, IDs, and email addresses redacted.

## Adding a new project

New automations follow the same pattern: create a folder, copy [`_template/README.md`](_template/README.md) into it, and fill in the sections.

## About

**Mustafa Mohamed Al Rouby** — Data Analyst & Logistics Specialist

- Portfolio: [mostafaalrouby.com](https://mostafaalrouby.com)
- LinkedIn: [mustafa-al-rouby](https://www.linkedin.com/in/mustafa-al-rouby-20218b171)
- GitHub: [@4MaxR](https://github.com/4MaxR)
