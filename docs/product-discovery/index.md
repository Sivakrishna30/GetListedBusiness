# GetListed — Product Discovery Document (Index)

> **Document Type:** Product Discovery Document  
> **Product:** GetListed  
> **Positioning:** Generic Business Operating System & Customer Discovery Platform  
> **Primary Users:** Business Owners / Business Teams / Customers  
> **Product Sides:** GetListed Business + GetListed Customer  
> **Development Strategy:** Phase 1 → Phase 2  
> **Source of Truth:** `/docs/product-discovery/full-discovery-document.md`

---

## Navigation & Sections Directory

This document has been decomposed into modular sections with relative routes for rapid reference and context loading.

| Section # | Module Name | Document Route | Core Focus |
|---|---|---|---|
| **01** | **Vision & Philosophy** | [01-vision-and-philosophy.md](./01-vision-and-philosophy.md) | Generic Business OS vision, dual North Star, and anti-slop rules |
| **02** | **Product Structure & Sides** | [02-product-structure-and-sides.md](./02-product-structure-and-sides.md) | Customer-first discovery flow, "What are you looking for?" entry, business portal |
| **03** | **Core Product Layers** | [03-core-product-layers.md](./03-core-product-layers.md) | Layer 1 (Foundation) through Layer 5 (Reports), generic architecture vs templates |
| **04** | **Growth Intelligence & Financials** | [04-growth-intelligence-and-financials.md](./04-growth-intelligence-and-financials.md) | Lightweight insights, income/expenses, audit reports, native Excel |
| **05** | **Phase 1 Core Scope** | [05-phase-1-core-scope.md](./05-phase-1-core-scope.md) | 10 Core Modules, Customer Discovery Portal, and explicitly deferred items |
| **06** | **Phase 2 Connected OS** | [06-phase-2-connected-os.md](./06-phase-2-connected-os.md) | Layers A-F integrations (Google, Payments, WhatsApp, Zoho, Commerce) |
| **07** | **Architecture & Evolution** | [07-architecture-and-evolution.md](./07-architecture-and-evolution.md) | System architecture diagram & three-stage evolution roadmap |
| **08** | **Business Types & Templates** | [08-business-types-and-mvp.md](./08-business-types-and-mvp.md) | Generic platform core, launch templates as starter examples, 11 success criteria |
| **09** | **Scope Control & Definition** | [09-scope-control-and-definition.md](./09-scope-control-and-definition.md) | 8 Scope rules, final product definition, scope freeze, anti-scope |
| **Full** | **Unabridged Document** | [full-discovery-document.md](./full-discovery-document.md) | Complete single-file discovery transcript |

---

## Executive Summary & Core Rules

### 1. The Core Principles
> **"GetListed is a general business platform that can be used by different types of businesses."**  
> **"Build the business operating system first. Connect the outside world later."**

### 2. The Dual-Sided North Star
* **Customer Side:** $\text{Discover} \longrightarrow \text{Find} \longrightarrow \text{Check Availability} \longrightarrow \text{Book}$
* **Business Side:** $\text{Create} \longrightarrow \text{Configure} \longrightarrow \text{Manage} \longrightarrow \text{Operate} \longrightarrow \text{Get Discovered}$

### 3. The Unchanging Foundation
$$\text{Business Management} + \text{Customer Management} + \text{Operations} + \text{Business Performance} + \text{Discovery}$$

### 4. Dual Sides of GetListed
1. **GetListed Customer:** Customer-first discovery entry (**"What are you looking for?"**), generic search across services/keywords (*"gym near me"*, *"badminton near me"*, *"clinic near me"*), location detection, live availability, and friction-free booking with **no mandatory customer login**.
2. **GetListed Business:** Used by owners and staff to set up, configure catalog, manage schedules, track bookings, customers, transactions, expenses, team, and reports.

### 5. Categories vs. Launch Templates
* **Platform Architecture:** Fundamentally generic. Any business can create its own profile, services, products, packages, availability, and operations.
* **Launch Templates:** Pre-configured starter configurations for selected verticals (Turf, Studio, Clinic, Retail) to accelerate onboarding. They are starting examples, **not** platform boundaries.

### 6. Phase 1 vs. Phase 2 Scope Boundaries
* **Phase 1 (Active):** Standalone core operating system & customer discovery web app. No third-party API dependencies. Native Excel/CSV/PDF exports.
* **Phase 2 (Sequenced):** Connected Business OS (Google APIs, Payment Gateways, WhatsApp Cloud API, Zoho, Tally, E-commerce connectors).
* **Future:** Optimization & recommendations based on real accumulated business data.

---

## Agent Guidance
When handling any task, architecture change, or feature implementation for GetListed:
1. Refer to [agents.md](../../agents.md) for behavioral rules and context checking.
2. Verify against [05-phase-1-core-scope.md](./05-phase-1-core-scope.md) to prevent out-of-scope feature creep.
3. Review [09-scope-control-and-definition.md](./09-scope-control-and-definition.md) for the 8 fixed scope control rules.
