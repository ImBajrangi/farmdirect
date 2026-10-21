# 03 — Layout-Level Redesign Specification

This specification outlines concrete, structural layout redesigns for priority screens across FarmDirect. These recommendations avoid cosmetic-only changes and establish high-efficiency, task-oriented page compositions.

---

## Screen 1: Farmer Operations Workdesk (`/farmer/dashboard`)

### 1. Current Composition
- Top Composite Farm Hero Card with 21:9 panoramic landscape placeholder, verified status pills, and public storefront link.
- 4-column Operational KPI strip (Awaiting Harvest, In Packing, Active Produce, Net Farmer Sales).
- Two-Column Workdesk Grid:
  - Left Column (60%): Produce Inventory with search, category filters, crop cards with live stock meters, and `-10` / `+10` kg quick buttons.
  - Right Column (40%): Mahabhulekh 7/12 Land Record Verification Dossier (16:9 placeholder) + Orders for Harvest Deck.

### 2. What Is Working & What Needs Next-Level Elevation
- **Working Well**: The side-by-side workdesk layout successfully eliminates the generic dashboard look and places inventory and dispatch tools in one unified view. The `+10` / `-10` stock adjustment buttons are praised for agricultural ergonomics.
- **Elevation Opportunity**: The right-column Land Record Dossier is static after initial verification. It can be collapsed into a compact verification pill on subsequent visits to give more vertical space to the high-priority **Live Order Dispatch Queue**.

### 3. Visual Hierarchy Priority
1. **Primary**: Orders Awaiting Harvest (time-sensitive morning dispatch).
2. **Secondary**: Crop Inventory & Stock Capacity Meters.
3. **Tertiary**: Farm Metrics & Revenue Summaries.
4. **Quaternary**: Static Land Record Compliance.

### 4. Proposed Layout Structure (Desktop 1440px)
- **Top Bar**: Farmer Hero Strip with live node status, compact 7/12 verified badge, and high-contrast `+ Add Harvest Produce` button.
- **Main 2-Column Split (65% / 35%)**:
  - **Left Workdesk (Inventory Hub)**: Filter chips (All, Low Stock, Active), searchable produce grid with live inventory adjusters.
  - **Right Operational Rail (Harvest & Dispatch Console)**: Sticky dispatch cards showing buyer lot sizes, packing labels, and "Mark Crate Packed" triggers.

### 5. Mobile Transformation (375px - 430px)
- Stacks linearly: Compact Farm Header -> Urgent Orders Carousel -> Quick Stock Adjuster List.
- Sticky bottom mobile action bar: `[+ Add Produce]` and `[View Orders (N)]`.

### 6. Functionality & Reusability
- **Preserved Logic**: Supabase inventory updating, stock decrementing, PGS organic tags.
- **Reused Components**: `ImagePlaceholder` (21:9 cover), stock meters, status pills.

---

## Screen 2: Platform Governance Command Desk (`/admin/dashboard`)

### 1. Current Composition
- Top header with Maharashtra cluster visual (16:9 placeholder) and hub status.
- 4-metric overview (GMV, Buyer Orders, Verified Producers, Listed SKUs).
- Segmented navigation tabs (KYC Audits, Marketplace Orders, Service Areas).
- Table view on desktop; stacked record cards on mobile (`< 768px`).

### 2. What Is Working & What Needs Next-Level Elevation
- **Working Well**: Mobile stacked records eliminate table overflow completely. The split between "Audit Dossier" and "Revoke" is clear.
- **Elevation Opportunity**: The desktop table lacks interactive batch actions (e.g. bulk verify 5 pending farmers) and side-by-side document inspection.

### 3. Visual Hierarchy Priority
1. **Primary**: Pending Farmer KYC & 7/12 Land Record Verification Queue.
2. **Secondary**: Active Service Area Dispatch Health (Nashik & Pune logistics hubs).
3. **Tertiary**: Platform GMV & Order Velocity Telemetry.

### 4. Proposed Layout Structure (Desktop 1440px)
- **Split Workspace**:
  - **Left Master List (40%)**: Producer verification queue with search, taluka filter, and status pills.
  - **Right Inspection Dossier (60%)**: Interactive document preview showing scanned 7/12 land deed, verified survey number (Gat No. 142/1A), owner identity, and one-click "Approve Accreditation" / "Request Correction" buttons.

### 5. Mobile Transformation (375px - 430px)
- Stacked verification cards with expandable document drawers. Action buttons fixed at bottom of expanded drawers.

### 6. Functionality & Reusability
- **Preserved Logic**: Role-based admin access, status updating in Supabase, audit logs.
- **Reused Components**: `ImagePlaceholder` for land record previews, status badges.

---

## Screen 3: Authentication & Role Portal (`/login`)

### 1. Current Composition
- Desktop 50/50 Split Layout:
  - Left: Clean authentication card with Customer/Farmer/Admin role switch, phone/password fields, demo quick-fill, and submit CTA.
  - Right: Brand showcase panel with 16:9 platform photography placeholder and verified trust points (7/12 audit, dawn harvest dispatch).
- Mobile: Single-column collapse focused on authentication controls.

### 2. What Is Working & What Needs Next-Level Elevation
- **Working Well**: Split screen gives high SaaS credibility. Role switcher eliminates multi-page confusion.
- **Elevation Opportunity**: OTP-based mobile login flow should be visually integrated alongside standard password authentication, as Indian rural producers primarily authenticate via SMS OTP.

### 3. Visual Hierarchy Priority
1. **Primary**: Role Selector (`Customer` vs `Farmer` vs `Admin`).
2. **Secondary**: Mobile Phone / OTP Entry.
3. **Tertiary**: Trust Badges and Demonstration Links.

### 4. Proposed Layout Structure (Desktop 1440px)
- Maintain 50/50 split. Elevate left panel with clear tabbed toggle: `[WhatsApp / Mobile OTP]` and `[Password Login]`.
- Right panel showcase maintains 16:9 `ImagePlaceholder` with agricultural storytelling copy.

### 5. Mobile Transformation (375px - 430px)
- Single-column card with top logo, segmented role selector, high-contrast inputs, and thumb-friendly submit button.

---

## Screen 4: Customer Checkout & Delivery Desk (`/checkout`)

### 1. Current Composition
- Centered 2-column layout: Left shipping address and delivery slots; right order summary and payment selection.

### 2. What Is Working & What Needs Next-Level Elevation
- **Elevation Opportunity**: Currently lacks clear delivery time slot visualization (e.g. dawn harvest cut-off countdown) and direct farmer payout transparency (showing exactly how much money goes directly to the farmer vs logistics).

### 3. Visual Hierarchy Priority
1. **Primary**: Delivery Time Slot (6:00 AM Dawn Harvest Dispatch).
2. **Secondary**: Direct Farmer Payout Breakdown.
3. **Tertiary**: Delivery Address & UPI Payment Gateway.

### 4. Proposed Layout Structure (Desktop 1440px)
- **Left 65% (Fulfillment Desk)**:
  - Section 1: Delivery Hub & Cluster Selection (Nashik / Pune).
  - Section 2: Dawn Harvest Dispatch Slot Selection (Tomorrow 6:00 AM - 9:00 AM).
  - Section 3: Delivery Address & Contact Phone.
  - Section 4: Payment Method (UPI, Instant Net Banking, Cash on Harvest Delivery).
- **Right 35% (Transparent Order Receipt)**:
  - Line items with origin farm names.
  - Transparent Price Split: "Farmer Receives (88%)", "Logistics & Crate Handling (12%)", "Platform Commission (0%)".
  - Sticky primary button: `[Place Harvest Order · ₹Total]`.

### 5. Mobile Transformation (375px - 430px)
- Linear step card stack with sticky bottom checkout bar displaying total amount and instant "Place Order" trigger.

---

## Screen 5: Farmer Registration & KYC (`/farmer/register`)

### 1. Current Composition
- Grouped 4-stage fieldsets with 2-column input grid and 21:9 Mahabhulekh 7/12 land deed scan placeholder.

### 2. What Is Working & What Needs Next-Level Elevation
- **Elevation Opportunity**: Convert long single-page scroll into a guided 3-step progress stepper:
  - Step 1: Farm & Personal Identity
  - Step 2: Landholding & Location
  - Step 3: 7/12 Land Document & Natural Certification
- This prevents farmer intimidation on mobile devices while maintaining existing state fields.

---

## Screen 6: Add Produce Form (`/farmer/add-product`)

### 1. Current Composition
- 5-stage produce listing form with live crop image preview placeholder and pricing fields.

### 2. Proposed Layout Structure
- Desktop: Two-column layout with form fields on left (60%) and a **Live Product Card Preview** on right (40%) rendering the exact `ProductCard.tsx` in real-time as the farmer types crop name and price. This gives immediate feedback on how the listing will look in the Marketplace.
