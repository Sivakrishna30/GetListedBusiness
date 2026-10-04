# GetListed — MVP Product & Engineering Implementation Guide

> Source of Truth for GetListed MVP Architecture and Implementation.

## 1. Product Overview
Build the first functional MVP of GetListed, a business-focused local discovery and business management platform.
GetListed helps businesses create and manage their business information, configure what they offer, manage bookings and memberships, engage with customers, and access business reports and insights.
Customers can use GetListed to discover businesses, explore their services and products, check availability, make bookings/orders where applicable, view their bookings, and connect with businesses.
The product is B2B-first. The business management platform is the core product. Customer discovery is the customer-facing side of the same platform.
The MVP must be designed as a generic business platform, not as a turf-only, gym-only, hospital-only, or any other vertical-specific application.
The architecture must allow additional business categories and capabilities to be added later without rewriting the core system.

## 2. Brand
- Product Name: **GetListed** (Do not use: GetListed Hub, GetListed India, GetListed Local, GetListd, etc.)
- Logo: Simple professional **GLB** monogram/logo concept.
  - Requirements: Letters GLB, Square-based visual form, Modern and professional, Minimal, Suitable for favicon, app icon, dashboard sidebar and website header.

## 3. Visual Design
- Primary Brand Colour: Turquoise (e.g. #0d9488 / #14b8a6) used judiciously for CTAs, active navigation, highlights, selected states, brand accents, verification indicators.
- Clean neutral background, professional typography, trustworthy, business-focused, suitable for Indian local businesses.

## 4. Product Architecture
Full-stack modular monolith:
- Frontend: Public pages, Customer discovery & booking pages, Business management dashboard.
- Backend: REST API handlers in Express, Business services, Validation, Authorization-ready service boundaries.
- Data Layer: File-backed persistent storage with explicit schemas for Business, Services, Products, Packages, Bookings, Memberships, Events, Customers, Team Members, Reviews, Notifications, Transactions, Reports.
- Shared: Types, Validation schemas, Constants, Platform fee calculation (5%).

## 5. Authentication
Out of scope for MVP. Use clearly defined business and customer context without fake login or auth screens.

## 6. Core Modules & CRUD
1. Business Profile (CRUD, verification status, contact, amenities, hours, photos)
2. Business Configuration (Services, Products, Packages, Booking & Availability, Memberships, Events)
3. Customer Discovery & Engagement (Search, category & location filters, business detail, customer booking flow with 5% platform fee calculation, reviews & ratings 1-5 stars)
4. Reports & Insights (Revenue, Performance, Customers, Overview computed from real transactions/bookings)
5. Team Management (CRUD team members)
6. Notifications Architecture (Booking confirmations, updates, cancellations, membership, event alerts - WhatsApp/SMS status marked as pending/config-required)
7. Verification & Sponsored Listing (Verification badges, sponsored listing preference)
8. Pricing & Plans (Free vs Pro comparison, 5% platform fee per eligible booking/order)
9. Landing Page (Hero, Core capabilities, Who it's built for, Customer side, Pricing, FAQ, Final CTA)

---
All 16 development phases are implemented strictly according to this specification.
