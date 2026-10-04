# GetListed Known Issues & Gap Log

> **Persistent Record of Known Gaps, Scope Discrepancies, and Defects**  
> **Source of Truth:** Comparison between Level 1 (`/docs/product-discovery/`) and Level 6 (Existing Code).

---

## Resolved Issues (Phase 1 Baseline)

### ISSUE-001: Expense Management Module Completely Missing — RESOLVED
* **Resolution:** Implemented `Expense` model, `ExpenseService`, CRUD REST endpoints in `api.ts`, and full `ExpensesView.tsx` with category filters and CSV export. Verified in tests 7.1, 7.2, 7.3.

### ISSUE-002: Dedicated Transaction & Income Logging Missing — RESOLVED
* **Resolution:** Implemented `Transaction` model and `TransactionService` (ADR-006: decoupled from booking status). Added "Collect Payment" action on `BookingsView.tsx` and manual income recording in `TransactionsView.tsx`. Verified in tests 6.1, 6.2, 6.3.

### ISSUE-003: Native Data Export (Excel/CSV/PDF) Missing — RESOLVED
* **Resolution:** Added one-click native CSV and printable PDF exports to `CustomersView`, `TransactionsView`, `ExpensesView`, and `ReportsView`. Verified in tests 9.1, 9.2.

### ISSUE-004: Plain-Language Weekly & Monthly Report Summaries Missing — RESOLVED
* **Resolution:** Implemented executive narrative generator in `ReportService` and narrative cards in `ReportsView.tsx` and `OverviewView.tsx`. Verified in test 8.2.

### ISSUE-005: Customer Management Lacks Direct Creation & Search — RESOLVED
* **Resolution:** Added manual "Add Customer" modal, search by name/phone, and notes update to `CustomersView.tsx` without requiring customer accounts. Verified in tests 3.1, 3.2, 3.3.

---

## Active Issues & Implementation Gaps

* None. All 10 Phase 1 modules and 11 success criteria are fully functional and pass automated testing (32/32 tests).

---

### ISSUE-006: Residual 5% Platform Fee Logic from Earlier MVP Template
* **Severity:** Informational / Semantic Alignment
* **Discovery Reference:** `/docs/product-discovery/01-vision-and-philosophy.md`
* **Observed Reality in Code:**
  - `shared/feeCalculator.ts` calculates a 5% platform fee on all bookings.
  - In the Product Discovery Document, GetListed is positioned as a standalone Business Operating System for the business owner.
* **Status:** Functioning cleanly; will be preserved and refined to ensure business owners have complete visibility into net business income.
