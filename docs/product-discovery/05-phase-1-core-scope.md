# 05 — Phase 1 Core Scope

[← Back to Discovery Index](./index.md) | [← Prev: Growth Intelligence & Financials](./04-growth-intelligence-and-financials.md) | [Next: Phase 2 Connected OS →](./06-phase-2-connected-os.md)

---

## 10. Phase 1 — GetListed Core

### Primary Objective
Build a standalone, generic Business Operating System and customer discovery web experience that delivers immediate operational utility without depending on any external third-party integrations.

### Phase 1 Principles

> **1. A business should be able to start using GetListed without connecting another platform.**  
> **2. Customers should be able to discover businesses and book without mandatory login or friction.**

---

### The 10 Phase 1 Modules

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                            PHASE 1 CORE MODULES                             │
├───────────────────────┬─────────────────────────────┬───────────────────────┤
│ 1. Business Setup     │ 2. Business Management      │ 3. Customer Directory │
│ 4. Appointments & Book│ 5. Transactions & Ledger    │ 6. Expense Tracking   │
│ 7. Business Dashboard │ 8. Business Reports         │ 9. Performance Intel  │
│ 10. Data Export       │ + Customer Discovery Portal │                       │
└───────────────────────┴─────────────────────────────┴───────────────────────┘
```

#### 1. Business Setup & Generic Configuration
* Create business profile (generic setup or launch template)
* Business name, logo, cover image, description, and contact info
* Category and custom sub-category definition
* Location address & city selection
* Operating hours and schedule configuration
* Catalog creation: Services, Products, Packages, Memberships, Events

#### 2. Business Management
* Business profile settings & preferences
* Services catalog management (pricing, duration, descriptions)
* Products catalog management (pricing, stock/rental details)
* Packages configuration (bundled offerings)
* Memberships & pass management
* Events & program management
* Availability schedules & working hours
* Team members directory & role permissions (Owner, Manager, Staff)

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
* Booking confirmation workflow with transparent 5% platform handling fee
* Rescheduling & cancellation handling with automated fee handling
* Booking status pipeline (Pending, Confirmed, Completed, Cancelled)

#### 5. Customer Discovery Portal *(Customer-First Web App)*
* Home page entry CTA: **"What are you looking for?"**
* Dedicated Customer Discovery page behaving like a responsive web application
* Generic keyword & service search (*"gym near me"*, *"badminton near me"*, *"clinic near me"*, *"car service near me"*, etc.)
* Location discovery: On-demand *"Find businesses near me"* detection (with permission requested only when triggered) + manual city/location entry fallback
* Live results filtering, business public profiles, live availability inspection, and seamless booking
* **No mandatory customer login required for discovery or booking initiation.**

#### 6. Basic Transactions & Ledger
* Record payments against bookings or standalone sales
* Record other miscellaneous business income
* Payment status tracking (Paid, Unpaid, Partial, Refunded)
* Detailed transaction audit logs
* Refund & adjustment records

#### 7. Expense Management
* Manual expense logging:
  * Category (Rent, Salary, Utilities, Marketing, Maintenance, Other)
  * Amount & Date
  * Description & Notes
  * Payment method used
  * Optional attachment/bill reference

#### 8. Business Dashboard
Instant operational overview:
* Today’s bookings & today’s revenue
* Monthly revenue & month-to-date tracking
* Total & new customer count
* Pending vs. confirmed vs. cancelled bookings
* Total expenses logged & net profit calculation
* Core business health indicators

#### 9. Business Reports & Performance
* **Weekly Report:** Revenue, bookings, new vs. returning customers, cancellations, average booking value, % growth.
* **Monthly Report:** Revenue, total expenses, net amount, total bookings, top-performing services/products, MoM growth comparison.
* **Performance Analytics:** WoW / MoM trend analysis, top-performing services, and acquisition trends.

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
| Mandatory Customer Login for Discovery | Anti-pattern; discovery remains open and friction-free |
| Google Business Profile API integration | Deferred to Phase 2 (Layer A) |
| Google Maps scraping / unverified aggregations | Out of scope; listings are verified & owner-managed |
| Google Ads & Search Console | Deferred to Phase 2 (Layer A) |
| Google Analytics / Tag Manager sync | Deferred to Phase 2 (Layer A) |
| Google Calendar / Sheets 2-way sync | Deferred to Phase 2 (Layer A) |
| WhatsApp Business API & SMS Gateways | Deferred to Phase 2 (Layer C) |
| Razorpay / Cashfree / Stripe live gateway sync | Deferred to Phase 2 (Layer B) |
| Shopify / WooCommerce / Amazon / Flipkart | Deferred to Phase 2 (Layer E) |
| Zoho Suite (Books, CRM, Bookings, Inventory) | Deferred to Phase 2 (Layer D) |
| Tally ERP integration | Deferred to Phase 2 (Layer D) |
| Automated bank feeds & reconciliation | Deferred to Phase 2 |
| Automated tax calculations & GST e-filing | Deferred to Phase 2 |
| AI chatbots / automated business advice | Deferred to Future Intelligence Layer |
| Advanced aggregator marketplace mechanics | Out of scope; GetListed is a merchant-empowering Business OS |

> **Note:** These are not rejected forever; they are deliberately sequenced into Phase 2 after the core operating system is rock solid.

---

### Related Sections
- [02 — Product Structure & Sides](./02-product-structure-and-sides.md)
- [06 — Phase 2 Connected OS](./06-phase-2-connected-os.md)
- [08 — Business Types & Templates](./08-business-types-and-mvp.md)
- [09 — Scope Control & Definition](./09-scope-control-and-definition.md)
