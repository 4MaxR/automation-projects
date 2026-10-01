# Logistics CRM and Lead Confirmation Automation

## Project overview

Built a logistics lead intake workflow using monday.com, a monday WorkForm, Zapier, and Gmail. A prospect submits a request through the form; monday.com records it on the **Logistics Leads** board; a Zap watches for the new item and sends a personalized acknowledgment email. A separate **Logistics Deals** board supports the next stage of the sales pipeline.

**Project scope at this checkpoint:** The boards, sample lead data, form, and Zapier trigger and Gmail action were set up. The Gmail action test passed: it sent a message with the sample lead's name, service, origin, and destination correctly populated. Delivery bounced because the sample recipient was `test@example.com`, which does not receive mail. The available evidence does not confirm that the Zap was published or that a live form submission reached a real inbox. The qualified-lead-to-deal automation was proposed as the next step and is not counted as completed work.

## Business problem

Logistics inquiries can arrive with incomplete details and wait for a manual response. The workflow standardizes intake, gives the sales team one place to review requests, and provides a prompt confirmation to the prospect. It also keeps lead intake distinct from deal management.

## Architecture and tools

```text
Prospect → monday WorkForm → Logistics Leads board
                               ↓ new item
                             Zapier
                               ↓
                      Gmail confirmation

Qualified lead → monday native automation → Logistics Deals board
                (planned next step)
```

| Tool | Role |
| --- | --- |
| monday.com | Lead and deal boards, structured fields, and internal workflow |
| monday WorkForm | Public-facing intake connected to Logistics Leads |
| Zapier | Watches for a new monday item and passes its data to Gmail |
| Gmail | Sends the prospect's confirmation email |

## Implementation through the current state

1. **Create the CRM boards.** Create **Logistics Leads** for inbound inquiries and **Logistics Deals** for sales opportunities. Keep the boards separate so intake records and active deals can be managed with different statuses and owners.
2. **Define lead fields.** Add the lead identity and contact details, company, requested service, origin, destination, estimated value, sales owner, and lead status to Logistics Leads. Use consistent column names so form answers and Zapier fields are easy to identify.
3. **Define deal fields.** Add deal name, company, contact name, service, origin, destination, estimated revenue, deal owner, and deal stage to Logistics Deals. These support the planned lead-to-deal handoff.
4. **Add sample data.** Enter representative leads in Logistics Leads and check that the fields, statuses, and board layout are usable. Sample records provide realistic data for mapping and testing without using a production prospect.
5. **Build the intake form.** Create a monday WorkForm tied to **Logistics Leads**. Connect its questions to the matching lead columns and submit a sample inquiry to confirm that the form creates an item on the correct board.
6. **Configure the Zapier trigger.** Connect monday.com in Zapier, select a **new item** trigger, and point it to Logistics Leads. Load a sample item and confirm that the fields needed for the email are available.
7. **Configure the Gmail action.** Connect Gmail and choose **Send Email**. Map the recipient to the lead's Email field, set the sender to the connected Gmail account, and use `Logistics Team` as the sender name. Set the subject to `We received your logistics inquiry` and the body type to plain text.
8. **Personalize the message.** Insert monday fields with Zapier's field picker for Lead Name, Service, Origin, and Destination. The message thanks the prospect, repeats the request details, and says the team will follow up. Leave CC, BCC, reply-to, attachments, signature settings, labels, and contact groups unset unless the workflow later needs them.
9. **Test and publish.** Run Zapier's action test and inspect the sent message, including the recipient and substituted fields. The recorded test sent a correctly personalized email, but it bounced because the sample address was `test@example.com`. Publish the Zap, then submit a new WorkForm response with a real email address to verify delivery through the live workflow. Publication and live delivery are not confirmed in the available evidence.

## Field mappings

### WorkForm and lead record

The WorkForm writes answers to the corresponding columns on **Logistics Leads**. The key fields for the email workflow are **Lead Name**, **Email**, **Service**, **Origin**, and **Destination**. Company, Estimated Value, Sales Owner, and Lead Status provide CRM context for follow-up.

### New lead to confirmation email

| Gmail field or message element | monday.com source or value |
| --- | --- |
| To | Email from the new Logistics Leads item |
| From | Connected Gmail account |
| From Name | `Logistics Team` |
| Subject | `We received your logistics inquiry` |
| Greeting | Lead Name |
| Request summary | Service, Origin, Destination |

**Email body template** (the bracketed values represent Zapier-inserted monday fields):

```text
Hi [Lead Name],

Thank you for contacting us regarding your logistics request.

We received your inquiry for [Service] from [Origin] to [Destination].

Our team will review the details and contact you shortly.

Best regards,
Logistics Team
```

### Planned qualified lead to deal mapping

The next planned monday automation is: **When Lead Status changes to Qualified, create an item in Logistics Deals.** This mapping was specified but has not been verified as implemented.

| Logistics Leads | Logistics Deals |
| --- | --- |
| Lead Name | Deal Name |
| Company | Company |
| Lead Name | Contact Name |
| Service | Service |
| Origin | Origin |
| Destination | Destination |
| Estimated Value | Estimated Revenue |
| Sales Owner | Deal Owner |
| `Qualified` status event | Create deal with Deal Stage = `Qualification` |

## Testing notes and acceptance checks

| Check | Expected result | Evidence at this checkpoint |
| --- | --- | --- |
| Submit the WorkForm | One new item appears in Logistics Leads with the submitted values | Form-to-board setup is in project scope; no captured result is available in the referenced conversation |
| Test the Zapier trigger | Zapier loads a new lead item and exposes the fields used by Gmail | Trigger configuration is described; no saved test record is available |
| Test the Gmail action | Gmail sends a readable email with the correct name and route | Passed for the send action and field mapping. The screenshot shows “Hi Test Customer” and an Ocean Freight request from Shanghai to Ain Sokhna. Gmail returned an address-not-found notice for `test@example.com`, so recipient delivery was not verified. |
| Publish and submit a fresh form response | A live new item triggers one confirmation email | Publication and live delivery are not confirmed in the referenced conversation |
| Qualify an existing lead | A mapped item appears in Logistics Deals at `Qualification` | Planned next step; not yet verified |

For a portfolio demonstration, retain a redacted form submission, its corresponding lead item, the Zap run record, and the received email. Use test contact details and remove personal data from screenshots.

## Design decisions

- **Use monday.com for internal CRM transitions.** Lead status and deal creation belong in the same platform, so the planned qualification handoff should use a monday native automation.
- **Use Zapier for the external integration.** Zapier connects the monday lead record to Gmail and keeps the customer acknowledgment separate from internal board logic.
- **Keep the email concise and data-driven.** Repeating the service and route helps the prospect verify that the request was captured correctly.
- **Test at two levels.** An action test checks field mapping; a fresh WorkForm submission after publication checks the complete live workflow.

## What this demonstrates

This project shows structured documentation, clear asynchronous handoff notes, practical process design, CRM data modeling, cross-tool automation, and test planning. The explicit distinction between configured, tested, and still-to-be-verified steps supports reliable remote collaboration.
