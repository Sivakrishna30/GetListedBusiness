# 05 — Phase 1 Core Scope

[← Back to Discovery Index](./index.md) | [← Prev: Growth Intelligence & Financials](./04-growth-intelligence-and-financials.md) | [Next: Phase 2 Connected OS →](./06-phase-2-connected-os.md)

---

## 10. Phase 1 — GetListed Core

### Primary Objective
Build a standalone Business Operating System that delivers immediate operational utility without depending on any external third-party integrations.

### Phase 1 Principle

> **A business should be able to start using GetListed without connecting another platform.**

---

### The 10 Phase 1 Modules

```text
┌────────────────────────────────────────────────────────┐
│                   PHASE 1 CORE MODULES                 │
├────────────────────┬───────────────────┬───────────────┤
│ 1. Business Setup  │ 2. Business Mgmt  │ 3. Customer   │
│ 4. Appointments    │ 5. Transactions   │ 6. Expenses   │
│ 7. Dashboard       │ 8. Reports        │ 9. Performance│
│ 10. Data Export    │                   │               │
└────────────────────┴───────────────────┴───────────────┘
```

#### 1. Business Setup
* Create Business
* Business Profile & Category
* Location & Geolocation
* Contact Information & Business Hours
* Logo & Cover Image
* Initial catalog of Services, Products, and Packages

#### 2. Business Management
* Business profile settings & preferences
* Services catalog management (pricing, duration, descriptions)
* Products catalog management (pricing, SKU/details)
* Packages configuration
* Availability schedules & working hours
* Team members directory & basic role permissions

#### 3. Customer Management
* Add & edit customers manually or via booking
* Detailed customer profile (Contact, metadata, notes)
* Full customer history (Bookings, purchases, transactions)
* Fast customer search & filtering
* Basic segmentation (New vs. Returning, Inactive, VIP)

#### 4. Appointment / Booking Management *(Primary Phase 1 Capability)*
* Create appointment (business-side)
* Online customer booking flow (customer-side)
* Availability slot validation & calendar view
* Booking confirmation workflow
* Rescheduling & cancellation handling
* Booking status pipeline (Pending, Confirmed, Completed, Cancelled)

#### 5. Basic Transactions
* Record payments against bookings or standalone sales
* Record other miscellaneous business income
* Payment status tracking (Paid, Unpaid, Partial, Refunded)
* Detailed transaction audit logs
* Refund & adjustment records

#### 6. Expense Management
* Manual expense logging:
  * Category (Rent, Salary, Utilities, Marketing, Maintenance, Other)
  * Amount & Date
  * Description & Notes
  * Payment method used
  * Optional attachment/bill reference

#### 7. Business Dashboard
Instant operational overview:
* Today’s bookings & today’s revenue
* Monthly revenue & month-to-date tracking
* Total & new customer count
* Pending vs. confirmed vs. cancelled bookings
* Total expenses logged
* Core business health indicators

#### 8. Business Reports
* **Weekly Report:** Revenue, bookings, new vs. returning customers, cancellations, average booking value, % growth.
* **Monthly Report:** Revenue, total expenses, net amount, total bookings, top-performing services/products, MoM growth comparison.

#### 9. Business Performance
* Week-over-week (WoW) comparison
* Month-over-month (MoM) comparison
* Period-over-period trend analysis
* Identification of best month, busiest day of the week, and top services
* Customer acquisition & retention growth

#### 10. Data Export (Native Business Utility)
* Excel export (.xlsx)
* CSV export (.csv)
* Printable PDF summaries
* **Zero external integration required.**

---

## 11. Phase 1 — Explicitly NOT Included

To prevent scope creep and maintain development focus, the following capabilities are **strictly deferred to Phase 2 or beyond**:

| Excluded in Phase 1 | Reason & Destination |
|---|---|
| Google Business Profile API | Deferred to Phase 2 (Layer A) |
| Google Ads & Search Console | Deferred to Phase 2 (Layer A) |
| Google Analytics | Deferred to Phase 2 (Layer A) |
| Google Calendar / Sheets 2-way sync | Deferred to Phase 2 (Layer A) |
| WhatsApp Business API | Deferred to Phase 2 (Layer C) |
| Razorpay / Cashfree / Stripe live gateway | Deferred to Phase 2 (Layer B) |
| Shopify / WooCommerce / Amazon / Flipkart | Deferred to Phase 2 (Layer E) |
| Zoho Suite (Books, CRM, Bookings, Inventory) | Deferred to Phase 2 (Layer D) |
| Tally integration | Deferred to Phase 2 (Layer D) |
| Automated bank feeds & reconciliation | Deferred to Phase 2 |
| Automated tax calculations & GST e-filing | Deferred to Phase 2 |
| AI chatbots / automated business advice | Deferred to Future Intelligence Layer |
| Full enterprise multi-warehouse inventory | Deferred to future vertical expansions |

> **Note:** These are not rejected forever; they are deliberately sequenced into Phase 2 after the core operating system is rock solid.

---

### Related Sections
- [06 — Phase 2 Connected OS](./06-phase-2-connected-os.md)
- [08 — Business Types & MVP](./08-business-types-and-mvp.md)
- [09 — Scope Control & Definition](./09-scope-control-and-definition.md)
