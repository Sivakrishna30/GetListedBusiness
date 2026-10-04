# 08 — Business Types & MVP Strategy

[← Back to Discovery Index](./index.md) | [← Prev: Architecture & Evolution](./07-architecture-and-evolution.md) | [Next: Scope Control & Definition →](./09-scope-control-and-definition.md)

---

## 16. Business-Type Configuration

GetListed avoids becoming one giant, bloated, generic application where every user is forced to see fields they never use.

Instead, the platform features a **Common Core** with **Business-Specific Modules** configured by business category.

---

### The Common Core
Every business onboarded to GetListed receives:
* Business Profile & Public Presence
* Customer Directory & History
* Team Members & Permissions
* Services & Products Catalog
* Bookings & Orders Workflow
* Payments & Transaction Logging
* Operational Dashboard
* Weekly & Monthly Reports

---

### Business-Specific Modules Matrix

| Industry / Vertical | Specific Operational Modules Activated |
|---|---|
| **Turf / Sports Arenas** | Turf management, Slot management, Memberships, Hourly court scheduling |
| **Creative Studios & Agencies** | Packages, Projects, Events, Client management, Lead pipeline |
| **Retail & Boutiques** | Inventory tracking, Order management, Over-the-counter sales |
| **Clinics & Healthcare** | Patient appointments, Practitioner schedules, Service notes |

> **Rollout Principle:** Verticals are enabled gradually. The underlying architecture treats these modules as composable building blocks on top of the common core.

---

## 17. MVP Philosophy

The MVP must answer one fundamental, real-world question:

> ### **"Can a real business run its basic day-to-day operations through GetListed?"**

#### What the MVP is NOT trying to answer:
* ❌ *"Can GetListed connect to every platform in existence?"*
* ❌ *"Can GetListed replace complete double-entry accounting software?"*
* ❌ *"Can GetListed replace every existing SaaS tool on day one?"*

The primary objective of the MVP is **immediate operational usefulness**.

---

## 18. Phase 1 Success Criteria

Phase 1 is deemed successful when a business and its customers can reliably complete all 11 foundational steps:

1. **Create Business Profile:** Create and customize a complete business profile with photos, hours, and contact information.
2. **Catalog Services & Products:** Add, price, and describe services, products, and package bundles.
3. **Manage Customers:** Add customer profiles, view interaction history, and keep private operational notes.
4. **Accept & Manage Bookings:** Seamlessly book appointments from both the business dashboard and customer flow, with status changes, rescheduling, and cancellation.
5. **Record Transactions:** Log payments received, link them to bookings or direct sales, and track payment status.
6. **Record Operating Expenses:** Manually record daily/monthly business expenditures with categories.
7. **View Business Dashboard:** Monitor today's bookings, month-to-date revenue, active customers, and pending actions at a glance.
8. **Compare Performance Periods:** View week-over-week and month-over-month growth comparisons.
9. **Generate Business Reports:** Access automated, easy-to-read weekly and monthly business summaries.
10. **Export Structured Business Data:** Download clean Excel (.xlsx), CSV, and PDF exports for internal analysis or sharing with an accountant/CA.
11. **Customer Discovery & Booking:** Enable customers to find the business, view real availability, and make confirmed bookings.

---

### Related Sections
- [03 — Core Product Layers](./03-core-product-layers.md)
- [05 — Phase 1 Core Scope](./05-phase-1-core-scope.md)
- [09 — Scope Control & Definition](./09-scope-control-and-definition.md)
