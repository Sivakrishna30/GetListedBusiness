# GetListed — Product Discovery Document

- **Product:** GetListed
- **Positioning:** Generic Business Operating System & Customer Discovery Platform
- **Primary Users:** Business Owners / Business Teams / Customers
- **Product Sides:** GetListed Business + GetListed Customer
- **Development Strategy:** Phase 1 → Phase 2
- **Source of Truth:** `/docs/product-discovery/full-discovery-document.md`

---

## 1. Product Vision

### GetListed — Your Business Operating System

GetListed is a general, simple business operating system that can be used by different types of businesses. It helps businesses:
- Create their digital business presence and get discovered
- Configure and manage offerings (services, products, packages)
- Manage customer relationships and notes
- Manage day-to-day operations and schedules
- Accept and manage appointments/bookings
- Track business performance, income, and operating expenses
- Understand how their business is growing from one simple system

The product is **NOT** a category-specific marketplace or restrictive niche directory. The platform architecture is fundamentally generic, enabling any service, product, appointment, or membership-based business to configure its own profile, offerings, availability, customers, transactions, and operations.

The initial product first provides a simple, standalone core system for running and discovering a business. External integrations will be added in Phase 2 so that GetListed can connect with the external tools and services already used by the business.

### Core Principles

> **1. GetListed is a general business platform that can be used by different types of businesses.**  
> **2. Build the business operating system first. Connect the outside world later.**

---

## 2. Product Philosophy & Alignment

GetListed solves a simple, dual-sided problem:

> *"I run a business. I need one simple place to set up, manage, operate, and understand how my business is performing."*  
> *"I am a customer. I want a simple, unhindered way to discover local businesses, find services near me, check availability, and book."*

### Dual North Star Alignment

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                            GETLISTED PLATFORM                               │
├──────────────────────────────────────┬──────────────────────────────────────┤
│            BUSINESS SIDE             │            CUSTOMER SIDE             │
├──────────────────────────────────────┼──────────────────────────────────────┤
│  Create → Configure → Manage         │  Discover → Find → Check Availability│
│  → Operate → Get Discovered          │  → Book                              │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

### What the Product Must Avoid Becoming

The product should avoid becoming:
- A category-restricted vertical silo (it is a generic business platform)
- An accounting-only application
- An integration platform
- A booking-only widget
- An analytics-only application
- An aggressive consumer aggregator marketplace
- A tax filing application
- An ERP with hundreds of bloated, mandatory features

These can become supporting or modular capabilities later.

### The Unchanging Core

$$\text{Business Management} + \text{Customer Management} + \text{Operations} + \text{Business Performance} + \text{Discovery}$$

---

## 3. Product Structure

GetListed has two primary experiences designed as two complementary sides of the same platform:

```text
                              GETLISTED PLATFORM
                             ┌────────┴────────┐
                             ▼                 ▼
                    GetListed Business   GetListed Customer
```

---

### 3.1 GetListed Customer (Customer-First Discovery Experience)

The home page and public entry points primarily communicate the **Customer Discovery Experience**.

#### Primary Customer Journey
$$\text{Home Page} \longrightarrow \text{"What are you looking for?"} \longrightarrow \text{Customer Discovery Page} \longrightarrow \text{Search \& Location} \longrightarrow \text{Results \& Filters} \longrightarrow \text{Business Detail} \longrightarrow \text{Check Availability} \longrightarrow \text{Book}$$

#### Customer Journey Breakdown
1. **Home Page Entry:** Features a prominent, customer-centric search entry / CTA: **"What are you looking for?"**
2. **Dedicated Customer Discovery Page:** Clicking the entry navigates the customer to a rich, web-application-style discovery interface.
3. **Generic Search:** Not restricted to fixed categories (e.g., searches for *"gym near me"*, *"badminton near me"*, *"clinic near me"*, *"car service near me"*, *"photography studio near me"*, or any other local service).
4. **Location Discovery & Permissions:**
   - Provides on-demand **"Find businesses near me"** location detection.
   - Location permission is requested **only** when the user explicitly triggers near-me discovery.
   - If permission is denied or unavailable, the user can always manually select or type any city/location (e.g., Bengaluru, Hyderabad, Mumbai, Delhi).
5. **Interactive Exploration:** Live search results, category/amenity filters, verified badges, and sponsored preference indicators.
6. **Business Public Page:** Operating hours, location address, contact info, photo gallery, verified status, services, products, packages, memberships, and events.
7. **Availability & Booking:** Live time slot checking, booking selection, and booking confirmation without friction.

#### Customer Login Policy (No Forced Login)
> **Customer authentication is NOT required for the initial customer discovery experience or exploring business availability.**  
> Discovery is completely open and accessible to all visitors.

---

### 3.2 Business Owner Entry (From Home Page)

The Home Page also provides a clear, secondary entry point for business owners to get their business listed and operating.

* **Messaging:** Communicates the direct commercial value of getting discovered: **"Want your business to be discovered?"**
* **Call to Action:** Directs business owners to the business onboarding and setup workflow.
* **Business Journey:**
  $$\text{Create Profile} \longrightarrow \text{Configure Offerings} \longrightarrow \text{Manage Operations} \longrightarrow \text{Operate Day-to-Day} \longrightarrow \text{Get Discovered}$$

---

### 3.3 GetListed Business (Operational Capabilities)

The business owner and their team use **GetListed Business** to:

* **Create & manage the business:** Profile, branding, hours, location, contact, settings
* **Catalog offerings:** Create and organize services, products, and combo packages
* **Configure operations:** Define time slot availability, capacities, booking rules, memberships, and events
* **Manage customers:** Directory, contact history, customer notes, activity, segmentation
* **Manage appointments & bookings:** Calendar, scheduling, confirmations, status updates, rescheduling, cancellations
* **Manage payments & transactions:** Record payments, log income, payment statuses, refunds/adjustments
* **Manage team members:** Staff directory, roles (Owner, Manager, Staff), and operational permissions
* **Track business activity:** Live operational stream and daily logs
* **View business performance:** Real-time metrics, growth indicators, period comparisons
* **Generate reports:** Weekly, monthly, and accountant-ready summaries
* **Export business data:** Native Excel (.xlsx), CSV, and PDF exports

---

## 4. Core Product Layers

GetListed is conceptually divided into five foundational layers that form a generic, adaptable platform for diverse business types.

---

### Layer 1 — Business Foundation & Configuration

The business creates its digital presence and defines what it offers. The platform architecture is modular and generic, allowing any business to configure its unique operations.

**Includes:**
* Business Profile & Identity (Name, Logo, Cover Image, Description, Contact info)
* Physical Location & Coordinates
* Business Operating Hours & Holiday Schedules
* Category & Custom Business Type definition
* Services Catalog (Durations, pricing, staff assignment)
* Products Catalog (Direct sales, rentals, inventory tracking)
* Combo Packages (Bundled offerings across services and products)
* Memberships & Subscriptions (Recurring passes, credit allotments)
* Events & Program Schedules (Workshops, tournaments, bootcamps)
* Basic business operational settings

> *This is where the original "Get Listed" concept provides immediate public presence and discovery.*

---

### Layer 2 — Customer Management

Businesses need a simple way to understand and manage their customers without requiring bloated enterprise CRM software.

**Includes:**
* Customer profiles (Name, Phone, Email, Address)
* Customer contact information
* Customer history
* Booking history
* Purchase / transaction history
* Internal operational notes
* Customer status (Active, Inactive, VIP)
* New vs. returning customer indicators
* Customer activity tracking

> *Customer data forms the bedrock for future CRM capabilities.*

---

### Layer 3 — Business Operations & Scheduling

This is the actual day-to-day operating layer.

**Core capabilities:**
* Appointments & Slot Scheduling
* Real-time slot availability calculation
* Multi-staff & multi-court/room resource assignment
* Booking status pipeline (Pending, Confirmed, Completed, Cancelled)
* Rescheduling & cancellation handling with automated fee handling
* Over-the-counter and online payments / transaction logging
* Team members & contextual role permissions (Owner, Manager, Staff)

#### Generic Architecture vs. Launch Templates

GetListed distinguishes clearly between **business categories** and **business templates**:
* **Generic Architecture:** The core platform provides generic primitives (Services, Products, Packages, Bookings, Memberships, Events, Transactions, Expenses, Team) that any business can enable or disable.
* **Launch Templates:** Pre-configured starting points (e.g. Sports Turf, Photography Studio, Healthcare Clinic, Retail Boutique) provided to accelerate initial onboarding. Templates are examples, not architectural boundaries.

---

### Layer 4 — Business Performance

This is the reporting and understanding layer.

**Core purpose:**  
The purpose is **not** to create an overwhelming enterprise analytics dashboard with confusing charts.  
The purpose is: **Tell the business owner what happened in simple language.**

**Examples of metrics:**
* Revenue this week / month
* Number of bookings and capacity utilization
* Number of customers & new vs. returning breakdown
* Cancelled bookings & cancellation rate
* Average booking / transaction value
* Top-performing service, product, or package
* Peak days of the week and busiest hours
* Business growth trajectory (Month-over-Month & Week-over-Week)

---

### Layer 5 — Business Reports

GetListed provides simple reports that a business owner can understand without needing accounting or analytics knowledge.

#### Weekly Report Example
```text
This Week

Revenue: ₹42,500
Bookings: 38
New Customers: 12
Returning Customers: 18
Cancellation: 4
Average Booking: ₹1,118

Revenue increased 14% compared with last week.
```

#### Monthly Report Example
```text
September Business Report

Revenue: ₹1,82,000
Bookings: 164
New Customers: 46
Returning Customers: 78
Average Transaction: ₹1,110

Revenue increased 18% compared with August.
```

> **Guiding Principle:** The report should focus on *what happened and what changed*, not just display raw charts.

---

## 6. Business Growth Intelligence

GetListed helps the business understand growth without complex enterprise business intelligence (BI) tools.

### Growth
* Are we getting more customers?
* Is revenue increasing?
* Which services are expanding?

### Customer Behaviour
* How many customers return?
* Which customers visit regularly?
* Which customers have stopped coming?

### Business Performance
* Which days are busiest?
* Which services generate the highest revenue?
* Where is time or capacity under-utilized?

### Improvement
* Are cancellations increasing?
* What are the primary reasons?
* Which offerings should be expanded or discontinued?

---

## 7. Basic Financial Tracking

Businesses need a simple way to record financial activity without full accounting software.

### Income
* Income from bookings and services
* Income from direct product sales
* Income from memberships and packages
* Other miscellaneous business revenue

### Expenses
* Rent & facility leases
* Staff salaries and contractor wages
* Utilities (Electricity, Water, Internet)
* Maintenance and supplies
* Marketing and advertising
* Miscellaneous operational costs

### Important Limitation
> **GetListed is NOT a complete double-entry accounting software.**  
> It tracks cash flows and operational profit/loss. Full ledger balancing and tax compliance are supported via clean data export to accountants.

---

## 8. Basic Audit / Accountant-Ready Reports

Small businesses frequently need to share clean financial summaries with their accountant or Chartered Accountant (CA).

### Accountant Summaries Include:
* Monthly revenue statement
* Categorized expense register
* Customer transaction ledger
* Net operational margin summary

### Export Formats:
* **Excel (.xlsx)**
* **CSV (.csv)**
* **Printable PDF summaries**

---

## 9. Native Excel & Data Export

Spreadsheets are the universal business tool. GetListed treats Excel export as a **first-class native utility**, not an external integration.

### Standard Exports:
* Customer Directory (.xlsx / .csv)
* Bookings and Appointments Register (.xlsx / .csv)
* Transaction and Payment Ledger (.xlsx / .csv)
* Expense Log (.xlsx / .csv)
* Monthly Financial Statement (.xlsx / .pdf)

---

## 10. Phase 1 — GetListed Core Scope

### Primary Objective
Build a standalone, generic Business Operating System and customer discovery web experience that delivers immediate operational utility without depending on any external third-party integrations.

### Phase 1 Principles
> **1. A business should be able to start using GetListed without connecting another platform.**  
> **2. Customers should be able to discover businesses and book without mandatory login or friction.**

### Phase 1 Core Modules

1. **Business Setup & Generic Configuration**
   * Create business profile (generic setup or launch template)
   * Business name, logo, cover image, description, and contact info
   * Category and custom sub-category definition
   * Location address & city selection
   * Operating hours and schedule configuration
   * Catalog creation: Services, Products, Packages, Memberships, Events

2. **Business Management**
   * Business profile settings & preferences
   * Services catalog management (pricing, duration, descriptions)
   * Products catalog management (pricing, stock/rental details)
   * Packages configuration (bundled offerings)
   * Memberships & pass management
   * Events & program management
   * Availability schedules & working hours
   * Team members directory & role permissions (Owner, Manager, Staff)

3. **Customer Management**
   * Add & edit customers manually or via booking
   * Detailed customer profile (Contact, metadata, notes)
   * Full customer history (Bookings, purchases, transactions)
   * Fast customer search & filtering
   * Basic segmentation (New vs. Returning, Inactive, VIP)

4. **Appointment / Booking Management *(Primary Phase 1 Capability)***
   * Create appointment (business-side)
   * Online customer booking flow (customer-side)
   * Availability slot validation & calendar view
   * Booking confirmation workflow with transparent 5% platform handling fee
   * Rescheduling & cancellation handling with automated fee handling
   * Booking status pipeline (Pending, Confirmed, Completed, Cancelled)

5. **Customer Discovery Portal *(Customer-First Web App)***
   * Home page entry CTA: **"What are you looking for?"**
   * Dedicated Customer Discovery page behaving like a responsive web application
   * Generic keyword & service search (*"gym near me"*, *"badminton near me"*, *"clinic near me"*, *"car service near me"*, etc.)
   * Location discovery: On-demand *"Find businesses near me"* detection (with permission requested only when triggered) + manual city/location entry fallback
   * Live results filtering, business public profiles, live availability inspection, and seamless booking
   * **No mandatory customer login required for discovery or booking initiation.**

6. **Basic Transactions & Ledger**
   * Record payments against bookings or standalone sales
   * Record other miscellaneous business income
   * Payment status tracking (Paid, Unpaid, Partial, Refunded)
   * Detailed transaction audit logs
   * Refund & adjustment records

7. **Expense Management**
   * Manual expense logging by category (Rent, Salary, Utilities, Marketing, Maintenance, Other)
   * Amount, date, description, and payment method
   * Optional bill/receipt reference

8. **Business Dashboard**
   * Today’s bookings & today’s revenue
   * Monthly revenue & month-to-date tracking
   * Active and new customer counts
   * Pending vs. confirmed vs. cancelled bookings
   * Total expenses logged & net operational profit calculation

9. **Business Reports & Performance Analytics**
   * Weekly Report (Revenue, bookings, customers, cancellations, % growth)
   * Monthly Report (Revenue, expenses, net amount, top services/products, MoM growth)
   * Performance Trends (WoW / MoM comparisons, peak hours, customer acquisition)

10. **Data Export (Native Business Utility)**
    * Native Excel (.xlsx) export
    * CSV (.csv) export
    * PDF printable summaries
    * Zero third-party cloud integration required

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

---

## 12. Phase 2 — Connected Business OS

In Phase 2, GetListed connects to external tools already used by the business:

* **Layer A (Google / Presence):** Google Business Profile, Google Calendar, Google Analytics, Google Ads, Google Drive/Sheets.
* **Layer B (Payments):** Razorpay, Cashfree, Stripe, POS machines.
* **Layer C (Communication):** WhatsApp Business API, SMS Gateways, Transactional Email.
* **Layer D (Business Software):** Zoho Suite (Books, CRM, Inventory), Tally ERP.
* **Layer E (Commerce):** Shopify, WooCommerce, Amazon, Flipkart.
* **Layer F (Business Intelligence):** Aggregates connected data for multi-channel revenue, marketing ROI, and cost optimization.

---

## 13. Phase 2 — Optimization Layer

When connected to multiple platforms in Phase 2, GetListed can calculate unified business performance:
$$\text{Revenue} - \text{Expenses} - \text{Platform Fees} - \text{Payment Fees} - \text{Marketing Spend} = \text{True Net Profit}$$

---

## 14. Final Product Architecture

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                          GETLISTED PLATFORM                                 │
├──────────────────────────────────────┬──────────────────────────────────────┤
│          GETLISTED BUSINESS          │          GETLISTED CUSTOMER          │
│       (Business Operating System)    │      (Discovery & Booking Portal)    │
├──────────────────────────────────────┼──────────────────────────────────────┤
│ • Generic Setup & Launch Templates   │ • "What are you looking for?" Entry  │
│ • Business Profile & Settings        │ • Customer Discovery Web App         │
│ • Catalog (Services, Products, Combos│ • Location & "Near Me" Detection     │
│ • Operations & Availability Calendar │ • Business Detail & Reviews          │
│ • Customer Directory & Notes         │ • Live Availability & Slot Picker    │
│ • Team & Role Permissions            │ • Friction-free Booking Flow         │
│ • Transactions & Expense Logging     │ • No Mandatory Login Required        │
│ • Operational Dashboard              │ • Customer Booking History Lookup    │
│ • Weekly, Monthly & Audit Reports    │                                      │
│ • Native Excel, CSV & PDF Export     │                                      │
├──────────────────────────────────────┴──────────────────────────────────────┤
│                         COMMON OPERATIONAL CORE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│               PHASE 2 CONNECTED OS (Post-Core Integrations)                 │
│   [Google APIs] [Payment Gateways] [WhatsApp API] [Zoho / Tally] [Commerce] │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 15. Product Evolution

```text
Phase 1: BUILD THE GENERIC BUSINESS OS  (Manage the business & enable customer discovery)
                   ↓
Phase 2: CONNECT THE BUSINESS           (Connect existing business tools & gateways)
                   ↓
Future:  UNDERSTAND & OPTIMIZE          (Empower better business decisions)
```

---

## 16. Business-Type Configuration & Launch Templates

### 16.1 Generic Business Platform
> **"GetListed is a general business platform that can be used by different types of businesses."**

The platform architecture is fundamentally generic so that any business can configure its own profile, services, products, packages, availability, booking behavior, customers, transactions, expenses, team, and operations. It is never restricted to initial launch categories.

### 16.2 Launch Templates vs. Categories
* **Business Categories:** Flexible taxonomies used for discovery and search (Sports, Fitness, Healthcare, Beauty, Coworking, Events, Retail, Automotive, etc.).
* **Launch Templates:** Ready-to-use starting configurations (e.g. Turf, Photography Studio, Clinic, Retail Boutique) provided to accelerate onboarding and demonstrate the platform. They are starting examples, **not** platform boundaries. Generic setup is always supported.

---

## 17. MVP Philosophy

The MVP must answer one fundamental question:

> ### **"Can a real business run its basic day-to-day operations through GetListed?"**

The primary objective is **immediate operational usefulness** and **friction-free customer discovery**.

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

## 19. Scope Control Rules

These eight rules remain **strictly fixed** during all architectural decisions and engineering implementations:

* **Rule 1: Integration is not the product.** Integrations support GetListed.
* **Rule 2: Accounting is not the product.** Basic income/expense tracking is sufficient initially.
* **Rule 3: Reports are not the product.** Reports explain the business’s activity and performance.
* **Rule 4: Booking is not the product.** Booking is one operational capability.
* **Rule 5: GetListed is the Business OS.** Everything else supports that purpose.
* **Rule 6: Generic architecture with focused launch templates.** Build a generic business OS while using launch templates as starting configurations, never restricting the platform architecture to a fixed list of categories.
* **Rule 7: One module at a time.** Finalize the UX and workflow before moving to the next module.
* **Rule 8: No integration without a real use case.** An integration should be added because a real business needs it, not because an API exists.

---

## 20. Final Product Definition & North Star

> **GetListed is a general Business Operating System that helps businesses set up, manage, operate, and understand their business from one simple system, while enabling customers to easily discover businesses, find local services, check live availability, and book.**

### The Dual-Sided North Star

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                            GETLISTED NORTH STAR                             │
├──────────────────────────────────────┬──────────────────────────────────────┤
│            BUSINESS SIDE             │            CUSTOMER SIDE             │
├──────────────────────────────────────┼──────────────────────────────────────┤
│  Create → Configure → Manage         │  Discover → Find → Check Availability│
│  → Operate → Get Discovered          │  → Book                              │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

---

## 21. Product Scope — Final Freeze

### PHASE 1 — CORE BUSINESS OS & DISCOVERY (Locked)

**GetListed Business**
* Generic Business Setup & Launch Templates
* Business Profile & Public Presence
* Services, Products & Combo Packages
* Memberships & Events Management
* Customer Directory & Operational Notes
* Team Directory & Role Delegation (Owner, Manager, Staff)
* Appointments & Booking Calendar
* Transactions & Income Logging
* Manual Expense Management
* Business Dashboard
* Weekly & Monthly Business Reports
* Business Performance Analytics
* Basic Audit/Accountant Reports
* Native Excel/CSV/PDF Export

**GetListed Customer**
* "What are you looking for?" Search Entry
* Customer Discovery Web App
* Generic Keyword & Service Search
* Location Discovery ("Find Near Me" + Manual Fallback)
* Business Detail & Public Information
* Live Availability & Slot Picker
* Friction-free Online Booking Flow
* No Mandatory Customer Login Required
* Customer Booking History Lookup

**External Integrations:** None in Phase 1  
**Native Export:** Excel (.xlsx) / CSV / PDF

---

### PHASE 2 — CONNECTED BUSINESS OS

**Integrations:**
* Google Business Profile, Google Calendar, Google Analytics, Google Ads, Google Search Console, Google Drive / Sheets
* WhatsApp Business API & SMS Gateways
* Payment Gateways (Razorpay, Cashfree, Stripe)
* Zoho Products & Tally ERP
* E-commerce Platforms (Shopify, Amazon, Flipkart)
* Other officially supported platforms

**Connected Data:**
* Revenue, Expenses, Platform fees, Payment fees, Marketing spend, Orders, Bookings, Customers, Traffic, Leads

**Intelligence:**
* Business trends, Cost analysis, Platform performance, Software cost analysis, Marketing performance, Business optimization, Recommendations

---

## 22. What GetListed Is NOT (Anti-Scope)

GetListed is **NOT**:
* ❌ **Not a category-restricted vertical silo:** It is a generic business platform adaptable to any service, retail, appointment, or membership business.
* ❌ **Not a closed-wall marketplace with forced login:** Customer discovery and availability checking do not require user account registration.
* ❌ **Not a Tally / QuickBooks replacement:** Does not do double-entry ledgers, depreciation schedules, or trial balances.
* ❌ **Not a Zoho / Salesforce replacement:** Does not do complex multi-tier sales pipelines or automated drip campaigns.
* ❌ **Not a Shopify replacement:** Does not attempt to be a multi-channel headless e-commerce storefront builder.
* ❌ **Not a WhatsApp replacement:** Does not replace customer chat; connects to WhatsApp for transactional messaging in Phase 2.
* ❌ **Not a Google Maps / Web Scraper:** Does not harvest unverified public directory data; all profiles are owner-created and verified.
* ❌ **Not a Tax filing / GST software:** Provides structured export data for CAs, not automated government filing.
* ❌ **Not an aggressive booking aggregator:** B2B-first platform empowering the business, not an aggregator prioritizing consumer choice over merchant loyalty.
* ❌ **Not a Payment Gateway:** Will connect to gateways in Phase 2, but does not custody merchant funds.
* ❌ **Not an integration automation platform (Zapier/Make):** Does not offer arbitrary visual workflow triggers.

> *GetListed sits above these systems in the future, while remaining immediately useful even without them in Phase 1.*

---

## 23. Final Strategic Direction

```text
Phase 1: BUILD THE GENERIC BUSINESS OS  (Manage the business & enable customer discovery)
                   ↓
Phase 2: CONNECT THE BUSINESS           (Connect existing business tools & gateways)
                   ↓
Future:  UNDERSTAND & OPTIMIZE          (Empower better business decisions)
```
