# GetListed Architecture Decision Records (ADR)

> **Persistent Record of Engineering & Architectural Decisions**  
> **Source of Truth Hierarchy:** Level 4 (Architecture must not contradict Level 1 Product Discovery)

---

## ADR-001: Persistence Engine — File-Backed Structured Store (`db.json`)
* **Status:** `ACCEPTED`
* **Date:** Baseline Audit
* **Context:** GetListed Phase 1 is a standalone business operating system that requires robust local/cloud data persistence across dev server restarts and preview sessions without requiring external managed database provisioning (Cloud SQL/PostgreSQL) during initial Phase 1 core setup.
* **Decision:** Use `server/db.ts` managing `server/data/db.json` with synchronous initialization, in-memory state caching, atomic writes, and debounced disk flushes. Schema integrity is strictly enforced via TypeScript interfaces in `shared/types.ts`.
* **Consequences:** Provides fast queries, deterministic state inspection, easy seeding, zero-latency local development, and trivial automated export/backup capabilities. Will migrate or extend to PostgreSQL/Cloud SQL if requested when scaling multi-tenant loads.

---

## ADR-002: Strict Enforcement of Phase 1 Boundary (Zero External API Integrations)
* **Status:** `ACCEPTED`
* **Date:** Baseline Audit
* **Context:** The Product Discovery document explicitly dictates that Phase 1 must not depend on external third-party integrations (Google APIs, Razorpay, WhatsApp, Zoho, Shopify).
* **Decision:** Reject any external cloud SDKs or mock external connectors in Phase 1. Build the standalone operating system first (manual expense entry, local booking calendar, customer management, manual transaction logging, and native exports).
* **Consequences:** Protects against premature scope explosion, eliminates external authentication failure modes, and guarantees the core product is self-contained.

---

## ADR-003: Native Data Export Strategy (Client-side & Server-side Utilities)
* **Status:** `ACCEPTED`
* **Date:** Baseline Audit
* **Context:** Product Discovery Layer 5 & Section 9 mandates Excel, CSV, and PDF exports as native utilities without requiring external third-party integrations.
* **Decision:** Implement CSV and structured Excel tabular generators using lightweight standard client/server formatting utilities. Do not integrate external cloud export services.
* **Consequences:** Completely offline-capable, instant downloads, accountant-ready, and aligns directly with local business workflows.

---

## ADR-004: Elimination of Mock Fallbacks in Favor of Real Error Reporting
* **Status:** `ACCEPTED`
* **Date:** Baseline Audit
* **Context:** Incomplete features or failing endpoints must never fall back to synthetic dummy data.
* **Decision:** In accordance with the No-Mock-Data Policy in `agents.md`, all UI components and API clients must surface actual empty states, actual server error messages, or loading states.
* **Consequences:** Development and testing are 100% grounded in real system reality; false completions are impossible.

---

## ADR-005: 4-Persona Multi-Agent Workflow
* **Status:** `ACCEPTED`
* **Date:** Baseline Audit
* **Context:** Preventing hallucination, scope drift, unverified assertions of completion, and code duplication.
* **Decision:** Enforce four explicit agent roles: Program Manager (scoping & criteria), Solution Architect (impact assessment & component reuse), Developer (execution of approved plan only), Tester (independent verification of real data flow).
* **Consequences:** All work requires documented criteria and test evidence before status reaches `COMPLETED`.

---

## ADR-006: Separation of Operational Events (Bookings) vs. Financial Events (Transactions)
* **Status:** `ACCEPTED` (Product Owner Directive)
* **Date:** 2026-10-04
* **Context:** Booking status and payment status are fundamentally distinct concepts. A booking can be `CONFIRMED` with zero advance paid, partial advance paid, or pay-at-venue. Automatically creating a revenue transaction merely on booking confirmation conflates operational schedule reservations with real money movement and causes financial double-counting.
* **Decision:**
  - **Booking records business activity & operational scheduling** (`date`, `time`, `slot`, `status: PENDING | CONFIRMED | CANCELLED | COMPLETED`).
  - **Transaction records actual money movement** (`amount`, `paymentMethod`, `type: INCOME | EXPENSE | REFUND`, `status: SUCCESS | PENDING | FAILED`, `date`, optional `bookingId`, optional `orderId`).
  - Bookings do not automatically become revenue transactions upon confirmation. A transaction is created only when actual payment/money movement occurs.
* **Consequences:** Prevents revenue inflation, cleanly supports partial payments, walk-ins, advance deposits, and zero-dollar bookings without corrupting ledger integrity.

---

## ADR-007: Identity Model — Decoupled User, Contextual BusinessMember, and Customer
* **Status:** `ACCEPTED` (Product Owner Directive)
* **Date:** 2026-10-04
* **Context:** Identity in a Business Operating System must accommodate multiple roles across businesses without conflating a human user with a customer profile.
* **Decision:**
  - `User`: Global authenticated identity (`id`, `name`, `email`, `passwordHash`, `status`, `createdAt`, `updatedAt`). Does not contain a hardcoded global `role` field.
  - `Business`: Operating commercial entity (`id`, `name`, `ownerId`, `businessType`, etc.).
  - `BusinessMember`: Links `userId` to `businessId` with a contextual role (`role: 'OWNER' | 'MANAGER' | 'STAFF'`), enabling multi-business membership (e.g. User A is Owner of Business 1, but Staff at Business 2).
  - `Customer`: A business-specific customer profile (`id`, `businessId`, `name`, `phone`, `email?`, `notes?`, `totalSpent`, `bookingCount`). **Customer does NOT require a login account.** Walk-in or offline clients (e.g. "Ravi Kumar, 9876543210") can be created and managed by the business owner without forcing customer registration.
* **Consequences:** Provides an enterprise-grade multi-business foundation while preserving extreme ease-of-use for local walk-in customers.

---

## ADR-008: Business Type & Modular Operations Configuration Architecture
* **Status:** `ACCEPTED` (Product Owner Directive)
* **Date:** 2026-10-04
* **Context:** GetListed serves diverse business types (Turf, Studio, Retail, Clinic, General Services) that require different operational modules. A simple string array is insufficient to represent operation capabilities and future module configuration.
* **Decision:**
  - Architectural model:
    $$\text{Business} \longrightarrow \text{BusinessType} \longrightarrow \text{Available Operations} \longrightarrow \text{Enabled Operations} \longrightarrow \text{Operation Configuration}$$
  - Define structured operation keys (`BOOKINGS`, `SERVICES`, `PRODUCTS`, `PACKAGES`, `MEMBERSHIPS`, `EVENTS`, `EXPENSES`, `TRANSACTIONS`).
  - Define `BusinessOperationConfig` allowing extensible module settings (e.g., slot durations, court counts, package validity rules) without requiring full enterprise schemas immediately.
  - Dashboard navigation dynamically renders views based on `business.enabledOperations`.
* **Consequences:** Eliminates UI clutter for single-vertical businesses and allows new verticals to be onboarded modularly without rewriting the core.

