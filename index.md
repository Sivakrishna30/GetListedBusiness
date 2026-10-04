# GetListed — Repository Context & Documentation Index

Welcome to the **GetListed** repository. This file serves as the root context directory for developers and AI agents working on the codebase.

---

## 🧭 Master Navigation

* **Agent Instructions & Directives:** [agents.md](./agents.md)
* **Master Build Operations & Execution Checklist:** [docs/project-state/current-operations.md](./docs/project-state/current-operations.md)
* **Product Discovery Document:** [docs/product-discovery/index.md](./docs/product-discovery/index.md)
* **Technical Implementation Guide:** [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
* **Persistent Project State & Tasks:**
  * [Current Operations & Checklist](./docs/project-state/current-operations.md)
  * [Current State](./docs/project-state/current-state.md)
  * [Task Board](./docs/project-state/task-board.md)
  * [Architecture Decisions (ADRs)](./docs/project-state/architecture-decisions.md)
  * [Validation Log](./docs/project-state/validation-log.md)
  * [Known Issues & Gaps](./docs/project-state/known-issues.md)

---

## 📖 Product Discovery Document — Section Breakdown

The Product Discovery Document defines the product positioning, architecture, boundaries, and roadmap for GetListed.

| Section | Topic | Relative Path |
|---|---|---|
| **Index** | Discovery Overview & Table of Contents | [docs/product-discovery/index.md](./docs/product-discovery/index.md) |
| **01** | Vision & Product Philosophy | [docs/product-discovery/01-vision-and-philosophy.md](./docs/product-discovery/01-vision-and-philosophy.md) |
| **02** | Product Structure & Dual Sides (Business vs Customer) | [docs/product-discovery/02-product-structure-and-sides.md](./docs/product-discovery/02-product-structure-and-sides.md) |
| **03** | Core Product Layers (Layers 1 to 5) | [docs/product-discovery/03-core-product-layers.md](./docs/product-discovery/03-core-product-layers.md) |
| **04** | Growth Intelligence, Financials & Native Excel Export | [docs/product-discovery/04-growth-intelligence-and-financials.md](./docs/product-discovery/04-growth-intelligence-and-financials.md) |
| **05** | Phase 1 Core Scope & 10 Modules (Included vs Excluded) | [docs/product-discovery/05-phase-1-core-scope.md](./docs/product-discovery/05-phase-1-core-scope.md) |
| **06** | Phase 2 Connected OS (Integrations & Optimization) | [docs/product-discovery/06-phase-2-connected-os.md](./docs/product-discovery/06-phase-2-connected-os.md) |
| **07** | Product Architecture & Evolution Roadmap | [docs/product-discovery/07-architecture-and-evolution.md](./docs/product-discovery/07-architecture-and-evolution.md) |
| **08** | Business-Type Configuration, MVP & Success Criteria | [docs/product-discovery/08-business-types-and-mvp.md](./docs/product-discovery/08-business-types-and-mvp.md) |
| **09** | Scope Control Rules, Scope Freeze & Anti-Scope | [docs/product-discovery/09-scope-control-and-definition.md](./docs/product-discovery/09-scope-control-and-definition.md) |
| **Full** | Complete Unabridged Discovery Document | [docs/product-discovery/full-discovery-document.md](./docs/product-discovery/full-discovery-document.md) |

---

## ⚡ Core Rules At A Glance

1. **Core Principle:** Build the business operating system first. Connect the outside world later.
2. **Two Sides:** GetListed Business (management, operations, financials, reports) + GetListed Customer (simple discovery, booking, status).
3. **Phase 1 Independence:** No mandatory external third-party API dependencies (Google, WhatsApp, Payment Gateways, Zoho, etc. are Phase 2).
4. **Excel is Native:** Spreadsheets and tabular exports (Excel, CSV, PDF) are a native utility, not an external integration.
5. **Operational Usefulness:** The metric for success is whether a real business can manage its day-to-day operations with GetListed.

---

For agent execution rules and prompt workflows, see [agents.md](./agents.md).
