# GetListed — Product Discovery Document

- **Product:** GetListed
- **Positioning:** Business Operating System
- **Primary Users:** Business Owners / Business Teams / Customers
- **Product Sides:** GetListed Business + GetListed Customer
- **Development Strategy:** Phase 1 → Phase 2

---

## 1. Product Vision

### GetListed — Your Business Operating System

GetListed is a simple business operating system that helps businesses create their business presence, manage customers, manage day-to-day operations, accept appointments/bookings, track business performance, and understand how their business is growing.

The product should not try to replace every software a business already uses.

The initial product should first provide a simple core system for running a business.

External integrations will be added later so that GetListed can connect with the tools and services already used by the business.

### Core Principle

> **Build the business operating system first. Connect the outside world later.**

---

## 2. Product Philosophy

GetListed should solve a simple problem:

> *"I run a business. I need one simple place to manage my business and understand how it is performing."*

The product should avoid becoming:

* an accounting-only application
* an integration platform
* a booking-only application
* an analytics-only application
* a marketplace
* a tax filing application
* an ERP with hundreds of features

These can become supporting capabilities later.

The core remains:

**Business Management + Customer Management + Operations + Business Performance**

---

## 3. Product Structure

GetListed has two primary experiences.

### 3.1 GetListed Business

The business owner/team uses GetListed Business to:

* create and manage the business
* create services/products
* manage customers
* manage appointments/bookings
* manage payments/transactions
* manage team members
* track business activity
* view business performance
* generate reports
* export business data

---

### 3.2 GetListed Customer

Customers use GetListed Customer to:

* discover businesses
* view business information
* view services/products
* view availability
* make appointments/bookings
* view booking information
* receive booking confirmation
* manage their customer relationship with the business

The customer experience should remain simple.

The customer should not need to understand the internal business-management system.

---

## 4. Core Product Layers

GetListed is conceptually divided into the following layers.

### Layer 1 — Business Foundation

The business creates its presence and defines what it offers.

Includes:

* Business Profile
* Business Name
* Logo
* Cover Image
* Description
* Location
* Contact information
* Business hours
* Categories
* Services
* Products
* Packages
* Pricing
* Basic business settings

This is where the original Get Listed concept remains important.

---

### Layer 2 — Customer Management

Businesses need a simple way to understand and manage their customers.

Includes:

* Customer profiles
* Customer contact information
* Customer history
* Booking history
* Purchase/transaction history
* Notes
* Customer status
* New vs returning customers
* Customer activity

Customer data should become the foundation for future CRM capabilities.

---

### Layer 3 — Business Operations

This is the actual operating layer.

Initial capabilities:

* Appointments
* Bookings
* Services
* Products
* Packages
* Payments/transactions
* Business calendar
* Team members
* Availability
* Booking status
* Cancellation
* Rescheduling

The exact operational modules can vary depending on the business type.

For example:

**Turf**
* Turf
* Slots
* Bookings
* Customers
* Memberships
* Payments

**Studio**
* Services
* Packages
* Leads
* Customers
* Bookings
* Projects
* Payments

**Retail**
* Products
* Inventory
* Customers
* Orders
* Payments

GetListed should therefore use a business-type configuration model instead of forcing every business to use every module.

---

### Layer 4 — Business Performance

This is the reporting and understanding layer.

The purpose is not to create a complicated analytics platform.

The purpose is:

**Tell the business owner what happened in simple language.**

Examples:

* Revenue this week
* Revenue this month
* Number of bookings
* Number of customers
* New customers
* Returning customers
* Cancelled bookings
* Average booking value
* Best-performing service
* Best-performing day
* Best-performing month
* Business growth
* Month-over-month growth
* Week-over-week growth

---

### Layer 5 — Business Reports

GetListed should provide simple reports that a business owner can understand without needing accounting or analytics knowledge.

#### Weekly report example:

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

#### Monthly report example:

```text
September Business Report

Revenue: ₹1,82,000
Bookings: 164
New Customers: 46
Returning Customers: 78
Average Transaction: ₹1,110

Revenue increased 18% compared with August.
```

The report should focus on what happened and what changed, not just display charts.

---

## 6. Business Growth Intelligence

This is intentionally a lightweight intelligence layer.

GetListed should answer simple questions such as:

### Growth
* Is the business growing?
* Is revenue increasing?
* Are bookings increasing?
* Are customers increasing?

### Customer behaviour
* Are customers returning?
* Which services bring repeat customers?
* How many new customers came this month?

### Business performance
* Which service performs best?
* Which day is busiest?
* Which month performs best?
* Which periods are weak?

### Improvement
Later, GetListed can say:
* *"Your bookings increased 22%, but cancellations also increased 11%."*
* *"Saturday generates the highest number of bookings."*
* *"Your revenue is growing, but average transaction value has decreased."*

This becomes the foundation for the future optimization layer.

---

## 7. Basic Financial Tracking

GetListed should NOT initially become a complete accounting system.

Instead, Phase 1 can support basic business financial tracking.

### Income
Business can record:
* Sales
* Booking revenue
* Service revenue
* Product revenue
* Other income

### Expenses
Business can manually record:
* Rent
* Salary
* Electricity
* Internet
* Marketing
* Maintenance
* Other expenses

This allows GetListed to provide:
* Total income
* Total expenses
* Net business amount
* Monthly comparison
* Basic income/expense summary

### Important Limitation
Because Phase 1 does not connect to external accounting/payment systems:
GetListed cannot automatically know every real-world expense or transaction.
Therefore Phase 1 financial reporting should be based on data entered into GetListed.
Phase 2 integrations can automate this later.

---

## 8. Basic Audit / Accountant-Ready Reports

GetListed should not initially become an auditing or tax application.

Instead, it should provide structured business records that can be useful for the business owner or accountant.

Examples:
* Sales report
* Expense report
* Income report
* Booking report
* Customer report
* Payment report
* Monthly transaction report
* Service-wise revenue report
* Product-wise revenue report

### Export formats:
* Excel
* CSV
* PDF

**The objective is:** Make business data easy to share with an accountant/CA or use for internal review.

---

## 9. Excel / Data Export

Excel should be treated as a native business utility, not an external integration.

Businesses should be able to export:
* Customers
* Bookings
* Transactions
* Services
* Products
* Expenses
* Revenue
* Reports

### Standard export
GetListed provides predefined Excel formats.

Example:
```text
Customer Export
Customer Name | Phone | Email | Total Bookings | Total Spent | Last Visit
```

### Custom export
Later, businesses can select:
* columns
* date range
* filters
* sorting
and generate a custom Excel file.

This is much more useful than forcing every business to use a complicated reporting system.

---

## 10. Phase 1 — GetListed Core

### Objective
Build a standalone Business Operating System without depending on external integrations.

### Phase 1 principle
A business should be able to start using GetListed without connecting another platform.

### Phase 1 Modules

1. **Business Setup**
   * Create Business
   * Business Profile
   * Business Category
   * Location
   * Contact
   * Business Hours
   * Logo
   * Cover
   * Services
   * Products
   * Packages

2. **Business Management**
   * Business settings
   * Services management
   * Products management
   * Pricing
   * Availability
   * Team members
   * Basic permissions

3. **Customer Management**
   * Add customer
   * Customer profile
   * Customer history
   * Booking history
   * Transaction history
   * Notes
   * Customer search
   * Customer segmentation/basic status

4. **Appointment / Booking Management**
   * Create appointment
   * Customer booking
   * Availability
   * Booking calendar
   * Booking confirmation
   * Reschedule
   * Cancellation
   * Booking status
   * Business-side booking management
   * Customer-side booking
   *(Primary Phase 1 capability)*

5. **Basic Transactions**
   * Record payment
   * Record income
   * Payment status
   * Transaction history
   * Refund/adjustment records where applicable

6. **Expense Management**
   Manual expense entry:
   * Expense category
   * Amount
   * Date
   * Description
   * Payment method
   * Optional attachment/reference

7. **Business Dashboard**
   Simple dashboard containing:
   * Today’s bookings
   * Today’s revenue
   * Monthly revenue
   * Customers
   * New customers
   * Pending bookings
   * Cancelled bookings
   * Expenses
   * Basic business health indicators

8. **Reports**
   * Weekly: Revenue, Bookings, Customers, Transactions, Expenses, Growth
   * Monthly: Revenue, Expenses, Net amount, Customers, Bookings, Best services/products, Growth comparison

9. **Business Performance**
   Comparison:
   * Week-over-week
   * Month-over-month
   * Previous month
   * Previous period
   * Best month
   * Best service/product
   * Customer growth

10. **Data Export**
    * Excel
    * CSV
    * PDF reports
    *(No external integration is required)*

---

## 11. Phase 1 — Explicitly NOT Included

To prevent scope explosion, the following are outside Phase 1:

* Google Business Profile API
* Google Ads
* Google Analytics
* Google Calendar integration
* Google Sheets integration
* WhatsApp API
* Razorpay integration
* Shopify
* WooCommerce
* Amazon
* Flipkart
* Zoho
* Tally
* Meta
* automated accounting
* automated tax calculations
* GST filing
* automated bank reconciliation
* AI business recommendations
* advanced automation
* marketplace management
* advanced CRM
* advanced inventory
* advanced accounting

These are not rejected forever. They are deliberately moved to Phase 2.

---

## 12. Phase 2 — Connected Business OS

Phase 2 starts only after the core GetListed Business OS is stable.

**The objective:** Connect GetListed with the external systems already used by the business.

### Phase 2 Layer A — Google / Business Presence
* Google Business Profile
* Google Calendar
* Google Analytics
* Google Ads
* Google Search Console
* Google Drive
* Google Sheets
*(Priority decided individually; do not build all Google integrations simultaneously)*

### Phase 2 Layer B — Payments
* Razorpay
* Cashfree
* Stripe
* other officially supported payment providers
* **Purpose:** automatically receive transaction data, payment reconciliation, payment status, revenue reporting

### Phase 2 Layer C — Communication
* WhatsApp Business Platform
* Email
* SMS providers
* **Purpose:** booking confirmations, reminders, customer communication, follow-ups

### Phase 2 Layer D — Business Software
* Zoho Books
* Zoho CRM
* Zoho Bookings
* Zoho Inventory
* Tally
* other officially supported systems
*(Connect specific products required; do NOT integrate an entire ecosystem speculatively)*

### Phase 2 Layer E — Commerce
* Shopify
* WooCommerce
* Amazon Seller
* Flipkart
* other officially supported commerce platforms
* **Purpose:** order data, revenue, product performance, inventory, channel performance

### Phase 2 Layer F — Business Intelligence
Once external data becomes available, combine GetListed data + external platform data:

```text
Website visitors → Leads → Bookings → Payments → Revenue

Revenue → Platform fees → Payment fees → Marketing spend → Operating expenses → Business performance
```

---

## 13. Phase 2 — Optimization Layer

GetListed can eventually identify:

* **Cost optimization:** *"Your business is spending ₹18,000/month across software subscriptions."*
* **Platform optimization:** *"Platform A generates 40% of bookings but charges significantly higher fees than Platform B."*
* **Marketing optimization:** *"Ad spend increased 30%, while revenue increased only 8%."*
* **Software optimization:** *"Some connected services have low activity."*
* **Business optimization:** *"Weekend bookings are consistently full. Increasing weekend pricing may improve revenue."*

These are recommendations, not the primary product.

---

## 14. Final Product Architecture

```text
                         GETLISTED
                 BUSINESS OPERATING SYSTEM
                            │
             ┌──────────────┴──────────────┐
             │                             │
     GETLISTED BUSINESS             GETLISTED CUSTOMER
             │                             │
             │                        Discover Business
             │                        View Services
             │                        View Availability
             │                        Book
             │                        Manage Booking
             │
    ┌────────┼────────┬──────────┐
    │        │        │          │
 Business  Customer Operations Financial
 Management Management Management Tracking
    │        │        │          │
 Profile    CRM      Booking    Income
 Services   History  Calendar   Expenses
 Products   Activity Payments   Transactions
 Team                Services
    │
    └─────────────────────┐
                          ↓
                    PERFORMANCE
                          │
              Weekly / Monthly Reports
              Growth Comparison
              Business Metrics
                          │
                          ↓
                    PHASE 2
                  INTEGRATIONS
                          │
       ┌──────────┬───────┼────────┬─────────┐
       ↓          ↓       ↓        ↓         ↓
     Google     Payments WhatsApp Zoho     Commerce
       │
       ↓
                  UNIFIED BUSINESS DATA
                          │
                          ↓
                     INTELLIGENCE
                          │
              Cost Optimization
              Performance Analysis
              Business Recommendations
```

---

## 15. Product Evolution

### Phase 1 — Manage the business
```text
Business → Customers → Bookings → Transactions → Expenses → Reports
```

### Phase 2 — Connect the business
```text
GetListed → [Google, Payments, WhatsApp, Zoho, Commerce, Other Platforms] → Unified Business Data
```

### Future Intelligence — Understand and optimize the business
```text
Business Data → Performance → Costs → Trends → Recommendations → Business Optimization
```

The intelligence layer should be developed only after sufficient real business data exists.

---

## 16. Business-Type Configuration

GetListed has a common core and business-specific modules.

### Common Core (Every business gets this)
* Business Profile
* Customers
* Team
* Services/Products
* Bookings/Orders
* Payments
* Dashboard
* Reports

### Business-specific modules
* **Turf:** Turf management, Slot management, Memberships
* **Studio:** Packages, Projects, Events, Client management
* **Retail:** Inventory, Orders, Product management
* **Clinic:** Appointments, Patients, Medical/service records

Verticals should be added gradually.

---

## 17. MVP Philosophy

The MVP should answer one question:

> **Can a real business run its basic day-to-day business through GetListed?**

Not:
* *"Can GetListed connect to every platform?"*
* *"Can GetListed perform accounting?"*
* *"Can GetListed replace every SaaS product?"*

The first objective is operational usefulness.

---

## 18. Phase 1 Success Criteria

Phase 1 can be considered successful when a business can:

1. Create its business profile.
2. Add its services/products.
3. Add customers.
4. Accept/manage appointments or bookings.
5. Record transactions.
6. Record expenses.
7. View its business dashboard.
8. Compare performance across periods.
9. Generate weekly/monthly reports.
10. Export useful business data to Excel/CSV/PDF.
11. Customers can discover the business and make/manage bookings.

If these work well, the foundation is ready for Phase 2.

---

## 19. Scope Control Rules

These rules remain fixed during development:

* **Rule 1: Integration is not the product.** Integrations support GetListed.
* **Rule 2: Accounting is not the product.** Basic income/expense tracking is sufficient initially.
* **Rule 3: Reports are not the product.** Reports explain the business’s activity and performance.
* **Rule 4: Booking is not the product.** Booking is one operational capability.
* **Rule 5: GetListed is the Business OS.** Everything else supports that purpose.
* **Rule 6: One business type at a time.** Do not build every industry simultaneously.
* **Rule 7: One module at a time.** Finalize the UX and workflow before moving to the next module.
* **Rule 8: No integration without a real use case.** An integration should be added because a real business needs it, not because an API exists.

---

## 20. Final Product Definition

> **GetListed is a simple Business Operating System that helps businesses create their business presence, manage customers, run day-to-day operations, handle appointments and transactions, track expenses, and understand business performance through simple reports.**

* Phase 1 focuses on building this core system independently.
* Phase 2 connects GetListed with the external tools businesses already use, bringing their data into one place and enabling deeper business insights and optimization.

**In one sentence:**

> **GetListed helps businesses get listed, get organized, run their business, and understand how they are growing.**

---

## 21. Product Scope — Final Freeze

### PHASE 1 — CORE BUSINESS OS

**GetListed Business**
* Business Profile
* Services
* Products
* Packages
* Customers
* Team
* Appointments
* Bookings
* Transactions
* Income
* Expenses
* Dashboard
* Weekly Reports
* Monthly Reports
* Business Performance
* Basic Audit/Accountant Reports
* Excel/CSV/PDF Export

**GetListed Customer**
* Discover Business
* Business Profile
* Services/Products
* Availability
* Booking
* Booking Management
* Customer History

**External Integrations:** None  
**Native Export:** Excel / CSV / PDF

---

### PHASE 2 — CONNECTED BUSINESS OS

**Integrations:**
* Google Business Profile, Google Calendar, Google Analytics, Google Ads, Google Search Console, Google Drive / Sheets
* WhatsApp Business
* Payment Gateways
* Zoho products
* E-commerce platforms
* Other officially supported platforms

**Connected Data:**
* Revenue, Expenses, Platform fees, Payment fees, Marketing spend, Orders, Bookings, Customers, Traffic, Leads

**Intelligence:**
* Business trends, Cost analysis, Platform performance, Software cost analysis, Marketing performance, Business optimization, Recommendations

---

## 22. What GetListed Is NOT

GetListed is not initially:
* Tally replacement
* Zoho replacement
* Shopify replacement
* WhatsApp replacement
* Google replacement
* Tax filing software
* CA/audit software
* Booking marketplace
* Payment gateway
* Integration automation platform

GetListed sits above these systems in the future, while remaining useful even without them in Phase 1.

---

## 23. Final Strategic Direction

The product journey is intentionally simple:

* **Phase 1: BUILD THE BUSINESS OS** — Manage the business.
* **Phase 2: CONNECT THE BUSINESS** — Connect the tools the business already uses.
* **Future: UNDERSTAND & OPTIMIZE THE BUSINESS** — Help the owner make better business decisions.

This keeps GetListed focused while preserving the larger long-term vision.
