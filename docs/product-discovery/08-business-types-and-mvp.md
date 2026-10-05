# 08 — Business Types, Launch Templates & MVP Strategy

[← Back to Discovery Index](./index.md) | [← Prev: Architecture & Evolution](./07-architecture-and-evolution.md) | [Next: Scope Control & Definition →](./09-scope-control-and-definition.md)

---

## 16. Generic Business Platform & Launch Templates

### 16.1 Core Principle: Generic Business Platform

> **"GetListed is a general business platform that can be used by different types of businesses."**

GetListed must **NOT** be defined or architected as a category-specific marketplace or restrictive niche tool. The platform architecture is fundamentally generic so that any business can configure its own:
* Business profile & public identity
* Services catalog & durations
* Products catalog & inventory/rentals
* Combo packages & bundled offerings
* Time slot availability & operational schedules
* Booking/appointment behavior & rules
* Customers directory & operational notes
* Transactions & income logging
* Expenses tracking
* Team members & role delegation
* Modular operational capabilities

The platform architecture is never restricted to initial launch categories.

---

### 16.2 Business Categories vs. Business Templates

A critical architectural distinction is maintained between **Business Categories** and **Business Templates**:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       CATEGORIES vs. LAUNCH TEMPLATES                       │
├──────────────────────────────────────┬──────────────────────────────────────┤
│          BUSINESS CATEGORIES         │           LAUNCH TEMPLATES           │
├──────────────────────────────────────┼──────────────────────────────────────┤
│ • Classification for search/filters  │ • Pre-configured starting setups     │
│ • Open and extensible                │ • Acceleration & product demo tool   │
│ • Generic search across all services │ • Examples, NOT platform limits      │
│ • Any business type can be created   │ • Generic setup always available     │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

#### Launch Templates as Accelerated Starting Points
GetListed provides ready-to-use business templates for selected business types (e.g. Sports Turf, Photography Studio, Healthcare Clinic, Retail Boutique, Event Space) to accelerate onboarding and demonstrate the product.

* **Templates are examples and starter configurations**, not hard platform boundaries.
* A business is always able to:
  1. Create a business using a **generic setup** without any template.
  2. Configure its own custom business name, category, and sub-category.
  3. Configure its own services, products, packages, memberships, and events.
  4. Configure its own pricing, slot rules, and availability.
  5. Enable or disable whichever operational modules fit its business model.

---

### 16.3 The Common Operational Core

Every business onboarded to GetListed receives the unified common core:
* Business Profile & Public Presence
* Customer Directory & History
* Team Members & Contextual Permissions (Owner, Manager, Staff)
* Services & Products Catalog
* Bookings, Memberships, Events & Orders Workflow
* Payments & Transaction Logging
* Expense Management
* Operational Dashboard
* Weekly, Monthly & Accountant-Ready Reports
* Native Excel, CSV & PDF Exports

---

## 17. MVP Philosophy

The MVP must answer one fundamental, real-world question:

> ### **"Can a real business run its basic day-to-day operations through GetListed?"**

#### What the MVP is NOT trying to answer:
* ❌ *"Can GetListed connect to every platform in existence?"*
* ❌ *"Can GetListed replace complete double-entry accounting software?"*
* ❌ *"Can GetListed replace every existing SaaS tool on day one?"*

The primary objective of the MVP is **immediate operational usefulness** and **friction-free customer discovery**.

---

## 18. Phase 1 Success Criteria

Phase 1 is deemed successful when a business and its customers can reliably complete all 11 foundational steps:

1. **Create Business Profile:** Create and customize a complete business profile (via generic setup or launch template) with photos, hours, and contact information.
2. **Catalog Services & Products:** Add, price, and describe services, products, and package bundles.
3. **Manage Customers:** Add customer profiles, view interaction history, and keep private operational notes.
4. **Accept & Manage Bookings:** Seamlessly book appointments from both the business dashboard and customer flow, with status changes, rescheduling, and cancellation.
5. **Record Transactions:** Log payments received, link them to bookings or direct sales, and track payment status.
6. **Record Operating Expenses:** Manually record daily/monthly business expenditures with categories.
7. **View Business Dashboard:** Monitor today's bookings, month-to-date revenue, active customers, and pending actions at a glance.
8. **Compare Performance Periods:** View week-over-week and month-over-month growth comparisons.
9. **Generate Business Reports:** Access automated, easy-to-read weekly and monthly business summaries.
10. **Export Structured Business Data:** Download clean Excel (.xlsx), CSV, and PDF exports for internal analysis or sharing with an accountant/CA.
11. **Customer Discovery & Booking Experience:** Enable customers to enter from *"What are you looking for?"*, discover businesses near them (with location detection or manual city selection), check live availability, and make confirmed bookings without mandatory login.

---

### Related Sections
- [01 — Vision & Philosophy](./01-vision-and-philosophy.md)
- [02 — Product Structure & Sides](./02-product-structure-and-sides.md)
- [03 — Core Product Layers](./03-core-product-layers.md)
- [05 — Phase 1 Core Scope](./05-phase-1-core-scope.md)
- [09 — Scope Control & Definition](./09-scope-control-and-definition.md)
