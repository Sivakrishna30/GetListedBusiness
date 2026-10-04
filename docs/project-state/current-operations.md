# GetListed — Master Build Operations & Execution Checklist

> **CRITICAL PERSISTENT SOURCE OF TRUTH (LIFELINE DOCUMENT)**  
> **Purpose:** This file is the persistent operational memory and master checklist for the entire GetListed application build.  
> **Rule for all AI Agents:** When your context or memory is refreshed, **YOU MUST CONSULT THIS FILE FIRST** along with `/index.md` and `/docs/product-discovery/index.md`. Never proceed from conversational memory or unverified assumptions.

---

## 0. Git & Environment Reality Check (Local vs. Remote)

* **Local Working Environment (This Repository):**
  - Contains full authoritative product discovery: `/docs/product-discovery/` (Sections 01 through 09 + full transcript).
  - Contains repository context index: `/index.md`.
  - Contains multi-agent operating manual: `/agents.md`.
  - Contains persistent project state: `/docs/project-state/` (`current-state.md`, `task-board.md`, `architecture-decisions.md`, `validation-log.md`, `known-issues.md`, `current-operations.md`).
  - Active full-stack code: React + Vite + TypeScript frontend, Express backend in `server.ts`, persistent structured file-backed DB in `server/db.ts` / `server/data/db.json`.
* **Remote Git Repository (`Sivakrishna30/GetListedBusiness`):**
  - Currently reflects an earlier commit before local documentation and project-state files were pushed.
  - **Reconciliation Directive:** Treat local verified code and documentation as the authoritative live state for this applet. When files are exported or committed to Git, all local governance and state files must be included.

---

## 1. Core Product Model & Foundation Dependency Chain

The product must be built in strict dependency order, avoiding the mistake of jumping to end-layer features (like Expenses or Exports) before the identity and ownership foundations are solid.

```text
┌────────────────────────────────────────────────────────┐
│               LAYER 0: IDENTITY FOUNDATION             │
│   User (Auth) ──► Customer Identity                    │
│               └──► Business Identity & Ownership       │
│               └──► Business Team / Staff Membership    │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│         LAYER 1: BUSINESS TYPE & OPERATION CONFIG      │
│   Business ──► Business Type (Turf, Studio, Retail, etc)│
│            ──► Available Operations                    │
│            ──► Enabled & Configured Operations         │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│             LAYER 2: CATALOG & FOUNDATION              │
│   Services, Products, Packages, Pricing, Hours, Profile │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│        LAYER 3: OPERATIONS & APPOINTMENTS/BOOKINGS     │
│   Slots, Availability, Customer Booking, Business Flow │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│      LAYER 4: FINANCIAL & TRANSACTION OWNERSHIP        │
│   Clear Financial Model:                               │
│     • When does a Booking produce a Transaction?       │
│     • Manual Income (Over-the-counter sales)           │
│     • Operating Expenses (Rent, Salary, Utilities)     │
│     • Traceable Net Calculation (Income - Expenses)    │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│      LAYER 5: BUSINESS DASHBOARD, PERFORMANCE & REPORTS│
│   Operational Overview, Plain-Language Weekly/Monthly, │
│   WoW / MoM Growth Trends, Native Excel / CSV / PDF    │
└────────────────────────────────────────────────────────┘
```

---

## 2. Non-Negotiable Operational Principles (Product Owner Frozen)

1. **Build the Business Operating System first. Connect the outside world later.** Phase 1 is 100% standalone.
2. **Operational Event vs. Financial Event Separation (ADR-006):**
   - *Booking records business activity & schedule reservations.*
   - *Transaction records actual money movement.*
   - A booking becoming `CONFIRMED` or `COMPLETED` does **NOT** automatically create a transaction. A transaction is recorded when payment actually occurs (advance, partial, venue, or full).
3. **Decoupled Identity Model (ADR-007):**
   - `User`: Global authenticated identity (`id`, `name`, `email`, `passwordHash`, `status`). No global role enum.
   - `BusinessMember`: Links `userId` and `businessId` with contextual `role: 'OWNER' | 'MANAGER' | 'STAFF'`.
   - `Customer`: Business-specific client record. **Customer does NOT require a login account.** Walk-in and offline customers (e.g. "Ravi Kumar, 9876543210") are first-class business-side entities.
4. **Business Type & Modular Operations Model (ADR-008):**
   - Dynamic hierarchy:
     $$\text{Business} \longrightarrow \text{BusinessType} \longrightarrow \text{Available Operations} \longrightarrow \text{Enabled Operations} \longrightarrow \text{Operation Configuration}$$
   - Dashboard views and operations must be dynamically enabled rather than forced universally.
5. **No Mock Production Data:** Never use fake customers, bookings, revenue, or expenses to simulate functionality. Show truthful empty states.
6. **No Duplicate Data:** Reuse existing models before creating new ones.
7. **Ask, Do Not Decide:** If a decision changes business meaning, user identity, or financial logic, **STOP and ask the Product Owner**.
8. **Completion is Evidence-Based:** Only mark a checklist item `[x] COMPLETED` after the real data flow is verified and recorded in `/docs/project-state/validation-log.md`.

---

## 3. Master Execution Checklist (Approved Foundation Order)

> **Status Symbols:**  
> `[ ]` `NOT_STARTED`  
> `[/]` `IN_PROGRESS`  
> `[?]` `VALIDATION_REQUIRED` / `TESTING`  
> `[x]` `COMPLETED` (Evidence logged)  
> `[!]` `BLOCKED` (Waiting on Product Owner decision or dependency)

---

### Step 1: Foundation & Identity (Approved Order)

- [x] **CHK-001: Multi-Agent Operating System & Repository Context**
  - *Requirement:* Establish `/index.md`, `/agents.md`, `/docs/product-discovery/`, `/docs/project-state/`.
  - *Evidence:* VAL-000 logged. All discovery modules and governance files verified.
- [x] **CHK-002: FND-001 — Identity & Business Ownership Model**
  - *Requirement:*
    1. Define `User` (`id`, `name`, `email`, `passwordHash`, `status`, `createdAt`, `updatedAt`).
    2. Define `BusinessMember` (`id`, `userId`, `businessId`, `role: 'OWNER' | 'MANAGER' | 'STAFF'`).
    3. Update `Business` to explicitly reference `ownerId: string`.
    4. Maintain `Customer` as a separate business-side entity (no mandatory user account).
    5. Provide simple prototype authentication (Email + Password) isolated from business logic.
  - *Status:* `COMPLETED`.
  - *Evidence:* VAL-001 logged. `AuthService.login`, `AuthService.register`, `AuthContext.tsx`, and `AuthModal.tsx` verified with 3 passing tests.
- [x] **CHK-003: FND-002 — Business Type & Operations Architecture**
  - *Requirement:*
    1. Define `BusinessType` (e.g. `TURF`, `STUDIO`, `RETAIL`, `CLINIC`, `GENERAL`).
    2. Define `Operation` catalog (`BOOKINGS`, `SERVICES`, `PRODUCTS`, `PACKAGES`, `MEMBERSHIPS`, `EVENTS`, `EXPENSES`, `TRANSACTIONS`).
    3. Define extensible `BusinessOperationConfig` model.
    4. Connect `business.enabledOperations` to dynamically control active dashboard navigation tabs.
  - *Status:* `COMPLETED`.
  - *Evidence:* VAL-001 logged. `BusinessService.updateOperations`, `DashboardLayout.tsx` dynamic tabs, and persistence verified.
- [x] **CHK-004: FND-003 — Customer Management (Walk-in & Directory)**
  - *Requirement:* Business owner can view customers, search by name/phone, view interaction history, and manually add walk-in/offline customers without requiring customer login.
  - *Status:* `COMPLETED`.
  - *Evidence:* VAL-001 logged. `CustomersView.tsx` and `CustomerService` verified with 3 passing tests.

---

### Step 2: Catalog & Operational Core (Existing Assets Verified)

- [x] **CHK-005: Business Catalog (Services, Products, Packages)**
  - *Requirement:* Full CRUD for services (pricing, duration, availability), products (stock status), packages.
  - *Status:* `COMPLETED`. Verified in `ServicesView`, `ProductsView`, `PackagesView`, and `CatalogService`.
- [x] **CHK-006: Operational Calendar & Bookings**
  - *Requirement:* Business-side calendar for managing daily slots, viewing bookings, rescheduling, cancellations.
  - *Status:* `COMPLETED`. Verified in `BookingsView.tsx` and `BookingService`.
- [x] **CHK-007: Customer Discovery & Booking Flow**
  - *Requirement:* Public discovery page, business profile, real availability, customer booking flow.
  - *Status:* `COMPLETED`. Verified in `DiscoveryPage.tsx`, `BusinessDetailPage.tsx`, `BookingFlowPage.tsx`.

---

### Step 3: Financial Operating System (Strict Separation)

- [x] **CHK-008: FIN-001 — Transaction & Income Ledger**
  - *Requirement:*
    1. Define `Transaction` (`id`, `businessId`, `type: 'INCOME' | 'EXPENSE' | 'REFUND'`, `category`, `amount`, `paymentMethod: 'CASH' | 'UPI' | 'CARD' | 'NET_BANKING' | 'OTHER'`, `status: 'SUCCESS' | 'PENDING' | 'FAILED'`, `date`, `bookingId?`, `customerId?`, `description?`).
    2. Decouple booking confirmation from automatic transaction creation (ADR-006).
    3. Allow manual over-the-counter income entry and booking payment recording.
    4. Define unambiguous revenue aggregation: $$\text{Total Income} = \sum(\text{Income Transactions with status SUCCESS})$$.
  - *Status:* `COMPLETED`.
  - *Evidence:* VAL-001 logged. ADR-006 validated: booking creation generates ₹0 income until payment recorded via `BookingsView` or `TransactionService`.
- [x] **CHK-009: FIN-002 — Manual Expense Management**
  - *Requirement:*
    1. Define `Expense` with categories (Rent, Salary, Utilities, Marketing, Maintenance, Other), date, amount, description, payment method.
    2. Expose CRUD APIs and add dedicated "Expenses" view in Business Dashboard.
  - *Status:* `COMPLETED`.
  - *Evidence:* VAL-001 logged. `ExpensesView.tsx` and `ExpenseService` verified with 3 passing tests.
- [x] **CHK-010: FIN-003 — Financial Dashboard & Net Business Amount**
  - *Requirement:* Compute and display $$\text{Total Income} - \text{Total Expenses} = \text{Net Business Amount}$$ on Overview dashboard with period comparisons.
  - *Status:* `COMPLETED`.
  - *Evidence:* VAL-001 logged. `OverviewView.tsx` and `ReportService.getReportsForBusiness` verified.

---

### Step 4: Intelligence, Reporting & Native Exports

- [x] **CHK-011: REP-001 — Plain-Language Weekly & Monthly Report Engine**
  - *Requirement:* Generate narrative summaries focusing on *what happened and what changed* (e.g. "Revenue increased 14% compared with last week") alongside WoW/MoM trends.
  - *Status:* `COMPLETED`.
  - *Evidence:* VAL-001 logged. Weekly and monthly narrative reports verified in `ReportService` and `ReportsView.tsx`.
- [x] **CHK-012: EXP-001 — Native Data Export (Excel / CSV / PDF)**
  - *Requirement:* Native client/server export for Customers, Bookings, Expenses, and Accountant-ready Monthly Summaries.
  - *Status:* `COMPLETED`.
  - *Evidence:* VAL-001 logged. Native CSV exports verified in `CustomersView`, `TransactionsView`, `ExpensesView`, and `ReportsView`.

---

### Step 5: Final Validation Gate

- [x] **CHK-013: VAL-001 — 11 Phase 1 Success Criteria Verification**
  - *Requirement:* Independently verify and record evidence for all 11 criteria in Section 18 of Product Discovery.
  - *Status:* `COMPLETED`.
  - *Evidence:* VAL-001 logged. All 11 criteria passed automated testing in `scripts/test-phase1.ts` (32/32 tests passed).
