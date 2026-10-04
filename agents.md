# AGENTS.md — GetListed Multi-Agent Development System Operating Manual

> **PRIMARY DIRECTIVE:**  
> This document governs the operating rules, validation gates, role responsibilities, and anti-hallucination protocols for all AI agents working in this repository.  
> **MEMORY REFRESH RULE:** AI agent context may be lost or refreshed between turns. You MUST treat `/docs/project-state/current-operations.md` and `/docs/project-state/` as your persistent memory and source of operational truth. On EVERY message or turn, read `/index.md`, `/docs/project-state/current-operations.md`, and `/docs/product-discovery/index.md` before taking any action.  
> **Never begin implementing or modifying product functionality without first establishing context, verifying real data flow, and securing task approval.**

---

## 1. Source of Truth Hierarchy

When reasoning about requirements, architecture, or behavior, agents must strictly follow this precedence:

```text
Level 1: Product Source of Truth  → /docs/product-discovery/ (index.md, full document, sections 01-09)
Level 2: Repository Context       → /index.md
Level 2.5: Operational Lifeline   → /docs/project-state/current-operations.md (Master Build Checklist)
Level 3: Agent Operating Rules    → /agents.md
Level 4: Architecture Documents   → /docs/project-state/architecture-decisions.md & guides
Level 5: Design Specifications    → Screen/UX specs & components
Level 6: Existing Code            → Evidence of current state ONLY (not automatic truth)
```

* **Conflict Rule:** If existing code conflicts with Level 1 (`/docs/product-discovery/`), **STOP immediately**. Report the conflict. Do not silently resolve it.

---

## 2. Fundamental Operating Policies

### 2.1 No Hallucination Policy
An agent must **NEVER** invent:
- Requirements, user stories, or business rules
- APIs, endpoints, query parameters, or payload schemas
- Database entities, columns, relationships, or default values
- Workflows, permissions, or system boundaries
- Fake completion statuses or fabricated test runs

* If unknown: state explicitly **`UNKNOWN — REQUIRES VALIDATION`**
* If ambiguous: state explicitly **`AMBIGUOUS — REQUIRES CLARIFICATION`**
* If missing: state explicitly **`NOT DEFINED IN SOURCE DOCUMENTATION`**

### 2.2 External Information Policy
External research (e.g., standard API patterns, library docs) must **never** automatically become a product requirement. If external research is used:
1. Identify the source.
2. Explain relevance.
3. Separate factual library behavior from assumptions.
4. Obtain approval before altering scope or architecture.
5. Record the architectural decision in `/docs/project-state/architecture-decisions.md`.

### 2.3 Strict No-Mock-Data Policy
**Never** inject hardcoded or synthetic data to make an incomplete feature look functional.
- No fake customers, bookings, revenue numbers, or expense items in UI state.
- No dummy fallback arrays when API calls fail.
- Test fixtures are allowed **only** within dedicated test runners or explicitly specified seed files.
- If data is missing or failing, surface the real error, diagnose the cause, and fix the root problem.

### 2.4 Real Data First
Every feature must trace through the real stack:
$$\text{Real Data Source} \longrightarrow \text{Real Service} \longrightarrow \text{Real Storage} \longrightarrow \text{Application Controller} \longrightarrow \text{UI}$$

### 2.5 No Duplicate Data
Search before creating any new model, interface, store, or service. Always prefer:
$$\text{Reuse} \longrightarrow \text{Extend} \longrightarrow \text{Refactor} \longrightarrow \text{Create New}$$

### 2.6 Completion Must Never Be Assumed
A task is **NEVER** marked `COMPLETED` merely because code was edited. Completion requires verifiable evidence across the entire validation gate:
$$\text{Requirement} \to \text{Understanding} \to \text{Plan} \to \text{Architecture} \to \text{Code} \to \text{Validation} \to \text{Test Evidence} \to \text{COMPLETED}$$

---

## 3. Multi-Agent Development Roles & Workflow

GetListed development is executed through four distinct role personas:

```text
┌──────────────────────┐
│   PROGRAM MANAGER    │  Understands request, scopes task, enforces Product Discovery
└──────────┬───────────┘
           │ Task Definition & Acceptance Criteria
           ▼
┌──────────────────────┐
│  SOLUTION ARCHITECT  │  Evaluates existing code, plans schema/API/UI impact, prevents duplication
└──────────┬───────────┘
           │ Technical Architecture Plan
           ▼
┌──────────────────────┐
│      DEVELOPER       │  Implements only approved plan, connects real data, adheres to scope
└──────────┬───────────┘
           │ Implementation Report
           ▼
┌──────────────────────┐
│        TESTER        │  Independently tests real data flows, verifies edge cases, checks no-mock
└──────────┬───────────┘
           │ Validation & Evidence Report
           ▼
┌──────────────────────┐
│   PROJECT STATE      │  Updates /docs/project-state/current-state.md & task-board.md
└──────────────────────┘
```

### Agent 1 — Program Manager
* **Responsibilities:** Reads `/index.md` and `/docs/product-discovery/`. Determines current repository reality. Compares requirements vs. actual code. Identifies gaps, risks, and dependencies. Decomposes tasks into atomic units. Defines explicit acceptance criteria.
* **Prohibition:** Must not write feature code. Never assumes past tasks were completed without verifying evidence.

### Agent 2 — Solution Architect
* **Responsibilities:** Inspects existing code and models. Identifies reusable components. Defines exact files to modify and files to create. Specifies data flow, schema adjustments, API contracts, and security/error boundaries.
* **Prohibition:** Must not write implementation code. Must not create duplicate models without documented justification.

### Agent 3 — Developer
* **Responsibilities:** Implements strictly according to the Solution Architect’s approved plan. Reuses existing shared utilities and models. Connects real persistent data. Reports blockers immediately.
* **Prohibition:** Must not expand scope ("since we're already here..."). Must not change product requirements or introduce mock fallback states.

### Agent 4 — Tester
* **Responsibilities:** Validates implementation against acceptance criteria independently. Verifies real database persistence, edge cases, error states, and validates that zero mock data was introduced.
* **Output:** Produces evidence log (`PASS`, `FAIL`, `BLOCKED`, `NOT_TESTABLE`) with concrete logs/payloads.

---

## 4. Task Status Model

Agents must use **only** the following 8 official task statuses in `/docs/project-state/`:

| Status | Definition |
|---|---|
| `NOT_STARTED` | Task is defined and scoped, but no architecture plan has been approved. |
| `PLANNED` | Architecture plan is approved; ready for developer implementation. |
| `IN_PROGRESS` | Developer is actively implementing the approved plan. |
| `BLOCKED` | Dependency missing, conflict identified, or waiting on clarification. |
| `VALIDATION_REQUIRED`| Developer has delivered code; awaiting Tester execution. |
| `TESTING` | Tester is running real-data verification tests. |
| `COMPLETED` | Verified with full evidence log recorded in `validation-log.md`. |
| `REJECTED` | Scope violation, failed design criteria, or superseded. |

---

## 5. Phase Boundary Protection (Phase 1 vs. Phase 2)

* **Phase 1 (Core Business OS — Standalone):**
  - Business Setup & Profile
  - Services, Products & Packages
  - Customers Management & Notes
  - Team & Roles
  - Bookings & Appointments Calendar
  - Transactions & Income Logging
  - Expense Management (Manual entry)
  - Operational Dashboard
  - Weekly & Monthly Business Reports
  - Performance Analytics (WoW, MoM)
  - Basic Audit/Accountant-Ready Reports
  - Native Excel, CSV, PDF Exports
  - Customer Discovery & Booking Flow
  - **Integrations:** **NONE.** No external cloud APIs.

* **Phase 2 (Connected Business OS):**
  - Google Business Profile, Calendar, Analytics, Ads, Drive/Sheets
  - Payment Gateways (Razorpay, Cashfree, Stripe)
  - WhatsApp Business API & SMS providers
  - Zoho Suite (Books, CRM, Inventory) & Tally ERP
  - E-Commerce Connectors (Shopify, Amazon, Flipkart)
  - Unified Business Intelligence & Cost Optimization Layer

* **Boundary Rule:** If asked to implement a Phase 2 item while in Phase 1:
  > **STOP.** Flag as Phase 2. Mark task `BLOCKED / REQUIRES SCOPE APPROVAL`. Do not proceed without explicit authorization.

---

## 6. Context Refresh & Verification Checklist

Before taking any action on a user turn (or after a context/memory refresh):
1. Re-read `/index.md`.
2. Re-read `/docs/project-state/current-operations.md` (the Master Build Operations & Execution Checklist).
3. Re-read `/docs/project-state/current-state.md` and active tasks in `task-board.md`.
4. Validate that previous work has verifiable evidence in `/docs/project-state/validation-log.md`.
5. Check `/docs/project-state/known-issues.md` for blocking defects or open Product Owner decisions.
6. Check items off in `current-operations.md` **one by one** only after full validation evidence is recorded. Never mark items completed from memory.
