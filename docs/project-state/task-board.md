# GetListed Task Board — Phase 1 Core Scope

> **Official Task Management Board**  
> **Source of Truth:** `/docs/product-discovery/` & `/docs/project-state/current-operations.md`  
> **Permitted Statuses:** `NOT_STARTED` | `PLANNED` | `IN_PROGRESS` | `BLOCKED` | `VALIDATION_REQUIRED` | `TESTING` | `COMPLETED` | `REJECTED`

---

## Active & Sequenced Tasks

### TASK-000: Multi-Agent System Setup & Repository Audit
* **Phase:** Phase 1 (Foundation)
* **Requirement Source:** Agent Operating Manual (`/agents.md`) & Root Context (`/index.md`)
* **Status:** `COMPLETED`
* **Priority:** P0
* **Dependencies:** None
* **Assigned Agent:** Solution Architect & Program Manager
* **Acceptance Criteria:**
  - Multi-agent framework established with 4 distinct roles (Program Manager, Solution Architect, Developer, Tester).
  - Persistent project state established in `/docs/project-state/`.
  - Comprehensive repository baseline audit completed.
* **Implementation Evidence:** `/agents.md`, `/index.md`, `/docs/project-state/*`.
* **Validation Evidence:** Verified in [`validation-log.md`](./validation-log.md) (Log entry VAL-000).

---

### TASK-FND-001: Identity & Business Ownership Architecture (CHK-002)
* **Phase:** Phase 1 (Foundation Step 1)
* **Requirement Source:** ADR-007 & PO Foundation Order
* **Status:** `COMPLETED`
* **Priority:** P0
* **Dependencies:** `TASK-000`
* **Assigned Agent:** Solution Architect → Developer
* **Acceptance Criteria:**
  - Define `User` interface in `shared/types.ts`: `id`, `name`, `email`, `passwordHash`, `status: 'ACTIVE' | 'SUSPENDED'`, `createdAt`, `updatedAt`.
  - Do NOT put a global `role` enum on `User`.
  - Define `BusinessMember` in `shared/types.ts`: `id`, `userId`, `businessId`, `role: 'OWNER' | 'MANAGER' | 'STAFF'`, `createdAt`.
  - Update `Business` in `shared/types.ts` to include `ownerId: string`.
  - Validate and maintain `Customer` as an independent business-side profile (`id`, `businessId`, `name`, `phone`, `email?`, `notes?`, `totalSpent`, `bookingCount`) without requiring a login account.
  - Implement basic prototype auth endpoints/handlers in `server/routes/api.ts` (`POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`).
  - Seed initial owner user and business member link in `server/data/initialSeed.ts`.
  - Zero mock data. Persist to real `server/data/db.json`.
* **Implementation Evidence:** `shared/types.ts`, `server/services/authService.ts`, `server/routes/api.ts`, `src/context/AuthContext.tsx`, `src/components/AuthModal.tsx`.
* **Validation Evidence:** Automated tests 1.1, 1.2, 1.3 in `scripts/test-phase1.ts`. Logged in VAL-001.

---

### TASK-FND-002: Business Type & Modular Operations Architecture (CHK-003)
* **Phase:** Phase 1 (Foundation Step 2)
* **Requirement Source:** ADR-008, Discovery Sec 16 & PO Foundation Order
* **Status:** `COMPLETED`
* **Priority:** P0
* **Dependencies:** `TASK-FND-001`
* **Assigned Agent:** Solution Architect → Developer
* **Acceptance Criteria:**
  - Define `BusinessType` enum (`TURF`, `STUDIO`, `RETAIL`, `CLINIC`, `GENERAL`).
  - Define `Operation` enum (`BOOKINGS`, `SERVICES`, `PRODUCTS`, `PACKAGES`, `MEMBERSHIPS`, `EVENTS`, `EXPENSES`, `TRANSACTIONS`).
  - Define `BusinessOperationConfig` model for extensible module settings.
  - Update `Business` to have `businessType: BusinessType`, `enabledOperations: Operation[]`, and optional `operationConfig`.
  - Update `DashboardLayout.tsx` to dynamically render sidebar navigation tabs based on `business.enabledOperations`.
* **Implementation Evidence:** `shared/types.ts`, `server/services/businessService.ts` (`updateOperations`), `src/pages/dashboard/DashboardLayout.tsx`, `src/pages/dashboard/SettingsView.tsx`.
* **Validation Evidence:** Automated tests 2.1, 2.2 in `scripts/test-phase1.ts`. Logged in VAL-001.

---

### TASK-FND-003: Customer Management & Walk-in Profiles (CHK-004)
* **Phase:** Phase 1 (Foundation Step 3)
* **Requirement Source:** Discovery Sec 10.3 & PO Foundation Order
* **Status:** `COMPLETED`
* **Priority:** P1
* **Dependencies:** `TASK-FND-001`
* **Assigned Agent:** Developer
* **Acceptance Criteria:**
  - Add manual "Add Customer" modal in `CustomersView.tsx` so business owners can add offline/walk-in clients.
  - Add search by name and phone number.
  - Display linked booking and transaction history in customer detail view.
* **Implementation Evidence:** `server/services/customerService.ts`, `src/pages/dashboard/CustomersView.tsx`.
* **Validation Evidence:** Automated tests 3.1, 3.2, 3.3 in `scripts/test-phase1.ts`. Logged in VAL-001.

---

### TASK-FIN-001: Transaction & Income Ledger (CHK-008)
* **Phase:** Phase 1 (Financials Step 1)
* **Requirement Source:** ADR-006, Discovery Sec 10.5 & PO Foundation Order
* **Status:** `COMPLETED`
* **Priority:** P1
* **Dependencies:** `TASK-FND-001`, `TASK-FND-002`
* **Assigned Agent:** Solution Architect → Developer
* **Acceptance Criteria:**
  - Define `Transaction` interface in `shared/types.ts`: `id`, `businessId`, `type: 'INCOME' | 'EXPENSE' | 'REFUND'`, `category`, `amount`, `paymentMethod`, `status: 'SUCCESS' | 'PENDING' | 'FAILED'`, `date`, `bookingId?`, `customerId?`, `description?`.
  - Strictly enforce: Booking status does NOT automatically generate revenue transactions. Transactions record actual money movement.
  - Expose API to record payments against bookings and record manual over-the-counter sales.
* **Implementation Evidence:** `server/services/transactionService.ts`, `src/pages/dashboard/TransactionsView.tsx`, `src/pages/dashboard/BookingsView.tsx` (Collect Payment modal and status badges).
* **Validation Evidence:** Automated tests 6.1, 6.2, 6.3 in `scripts/test-phase1.ts`. Logged in VAL-001.

---

### TASK-FIN-002: Manual Expense Management Module (CHK-009)
* **Phase:** Phase 1 (Financials Step 2)
* **Requirement Source:** Discovery Sec 10.6 & PO Foundation Order
* **Status:** `COMPLETED`
* **Priority:** P1
* **Dependencies:** `TASK-FIN-001`
* **Assigned Agent:** Developer
* **Acceptance Criteria:**
  - Define `Expense` interface with categories (Rent, Salary, Utilities, Marketing, Maintenance, Other), amount, date, description, payment method.
  - Expose CRUD APIs and add dedicated "Expenses" view in Business Dashboard.
* **Implementation Evidence:** `server/services/expenseService.ts`, `src/pages/dashboard/ExpensesView.tsx`.
* **Validation Evidence:** Automated tests 7.1, 7.2, 7.3 in `scripts/test-phase1.ts`. Logged in VAL-001.

---

### TASK-FIN-003: Financial Dashboard & Net Business Amount (CHK-010)
* **Phase:** Phase 1 (Financials Step 3)
* **Requirement Source:** Discovery Sec 10.7 & PO Foundation Order
* **Status:** `COMPLETED`
* **Priority:** P1
* **Dependencies:** `TASK-FIN-001`, `TASK-FIN-002`
* **Assigned Agent:** Developer
* **Acceptance Criteria:**
  - Compute and display $$\text{Total Income} - \text{Total Expenses} = \text{Net Business Amount}$$ on Overview dashboard.
  - Display month-to-date and period financial health cards.
* **Implementation Evidence:** `src/pages/dashboard/OverviewView.tsx`, `server/services/reportService.ts`.
* **Validation Evidence:** Automated test 8.1 in `scripts/test-phase1.ts`. Logged in VAL-001.

---

### TASK-REP-001: Plain-Language Weekly & Monthly Report Engine (CHK-011)
* **Phase:** Phase 1 (Reporting)
* **Requirement Source:** Discovery Layer 5 & Module 8
* **Status:** `COMPLETED`
* **Priority:** P2
* **Dependencies:** `TASK-FIN-003`
* **Assigned Agent:** Developer
* **Acceptance Criteria:**
  - Generate plain-language weekly and monthly reports focusing on *what happened and what changed* with WoW / MoM comparisons.
* **Implementation Evidence:** `server/services/reportService.ts`, `src/pages/dashboard/ReportsView.tsx`.
* **Validation Evidence:** Automated test 8.2 in `scripts/test-phase1.ts`. Logged in VAL-001.

---

### TASK-EXP-001: Native Data Export (Excel / CSV / PDF) (CHK-012)
* **Phase:** Phase 1 (Exports)
* **Requirement Source:** Discovery Sec 9 & Module 10
* **Status:** `COMPLETED`
* **Priority:** P2
* **Dependencies:** `TASK-FND-003`, `TASK-FIN-001`, `TASK-FIN-002`
* **Assigned Agent:** Developer
* **Acceptance Criteria:**
  - Native client/server one-click download for Customers, Bookings, Expenses, and Accountant summaries.
* **Implementation Evidence:** CSV export actions in `CustomersView.tsx`, `TransactionsView.tsx`, `ExpensesView.tsx`, `ReportsView.tsx`.
* **Validation Evidence:** Automated tests 9.1, 9.2 in `scripts/test-phase1.ts`. Logged in VAL-001.

---

### TASK-VAL-001: 11 Phase 1 Success Criteria Verification Gate (CHK-013)
* **Phase:** Phase 1 (Closeout)
* **Requirement Source:** Discovery Sec 18
* **Status:** `COMPLETED`
* **Priority:** P0
* **Dependencies:** All above tasks
* **Assigned Agent:** Tester
* **Acceptance Criteria:**
  - End-to-end real data verification of all 11 criteria in `server/data/db.json`.
* **Implementation Evidence:** `scripts/test-phase1.ts` (32 tests passing), `server/data/db.json`.
* **Validation Evidence:** Log entry VAL-001 in `validation-log.md`.
