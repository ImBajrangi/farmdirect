# 05 — Graphics and Image Placeholder Audit

Visual impact is a foundational pillar of modern SaaS design. This document audits every location across FarmDirect where intentional visual media improves orientation, storytelling, and trust.

**Strict Rule Reminder**: Marketplace product-card imagery and image treatments (`ProductCard.tsx`) are protected. Do NOT alter product card images, crops, or dimensions.

---

## 1. Reusable Placeholder Architecture: `ImagePlaceholder.tsx`

The application utilizes [`src/components/common/ImagePlaceholder.tsx`](file:///Users/sakhi/Code/farmdirect/src/components/common/ImagePlaceholder.tsx) to provide stable, accessible, neutral-grey surfaces.

### Technical Characteristics
- **Surface**: Neutral muted slate tones (`#f1f5f9` to `#e2e8f0`).
- **Border**: 1px subtle hairline `rgba(15, 46, 34, 0.08)` or dashed upload indicator.
- **Aspect Ratios**: Responsive CSS aspect-ratio support (`21:9`, `16:9`, `4:3`, `1:1`).
- **Layout Stability**: Zero layout shift (CLS) when swapped for production photography via the `src` prop (`object-fit: cover`).
- **Semantic Developer Label**: Discretely displays recommended pixel dimensions and intended subject matter in light monospace text without intruding on the interface.

---

## 2. Screen-by-Screen Placeholder Inventory & Replacement Guide

### 1. Farmer Dashboard Hero (`/farmer/dashboard`)
- **Component**: `<ImagePlaceholder aspectRatio="21:9" ... />`
- **Purpose**: Establishes farm identity, orchard setting, and agrarian authenticity.
- **Recommended Ratio**: `21:9` ultrawide panorama.
- **Desktop Dimensions**: `100%` width (up to `1240px`), height ~`280px`.
- **Mobile Dimensions**: `100%` width, height ~`140px` (fluid).
- **Object-Fit**: `cover`, centered on horizon.
- **Requirement**: Essential for farm identity.
- **Replacement Asset**: High-resolution drone or landscape photography of Patil Agro Orchards in Dindori, Nashik (1920 × 820px JPEG/WebP, < 350KB).

### 2. Farmer Land Record Dossier (`/farmer/dashboard`)
- **Component**: `<ImagePlaceholder aspectRatio="16:9" ... />`
- **Purpose**: Visual proof of official Maharashtra Government Mahabhulekh 7/12 Land Record verification (Gat No. 142/1A).
- **Recommended Ratio**: `16:9`.
- **Desktop Dimensions**: `100%` width of right rail (~`420px`), height ~`236px`.
- **Mobile Dimensions**: `100%` width, height ~`200px`.
- **Object-Fit**: `contain` or `cover` with subtle paper texture.
- **Requirement**: Essential for farmer trust & accreditation.
- **Replacement Asset**: Official scanned 7/12 land revenue document extract (1200 × 675px, watermark protected).

### 3. Admin Regional Telemetry Cluster Map (`/admin/dashboard`)
- **Component**: `<ImagePlaceholder aspectRatio="16:9" ... />`
- **Purpose**: Operational visual overview of Maharashtra agricultural corridors (Nashik gateway hub, Pune direct routes).
- **Recommended Ratio**: `16:9`.
- **Desktop Dimensions**: `380px` width, `214px` height in top control header.
- **Mobile Dimensions**: Fluid full width (~`340px`), height ~`190px`.
- **Object-Fit**: `cover`.
- **Requirement**: Strongly recommended for platform command ambiance.
- **Replacement Asset**: Stylized SVG/vector GIS heat-map showing active farm cluster nodes and logistics dispatch corridors (1200 × 675px).

### 4. Authentication Showcase Panel (`/login`)
- **Component**: `<ImagePlaceholder aspectRatio="16:9" ... />`
- **Purpose**: Welcomes farmers and buyers with authentic field-to-door harvest photography and trust messaging.
- **Recommended Ratio**: `16:9`.
- **Desktop Dimensions**: Full width of right column (~`460px`), height ~`260px`.
- **Mobile Dimensions**: Hidden or collapsed on mobile viewports `< 768px` to prioritize immediate form entry.
- **Object-Fit**: `cover`.
- **Requirement**: Essential for desktop split-screen visual balance.
- **Replacement Asset**: Authentic photo of farmers sorting and crating fresh produce at dawn (1200 × 675px).

### 5. Farmer Registration 7/12 Upload Preview (`/farmer/register`)
- **Component**: `<ImagePlaceholder aspectRatio="21:9" ... />`
- **Purpose**: Upload preview zone where farmer verifies their uploaded land deed file before submission.
- **Recommended Ratio**: `21:9`.
- **Dimensions**: Full width of form card (~`680px`), height ~`180px`.
- **Object-Fit**: `contain`.
- **Requirement**: Essential form verification feedback.
- **Replacement Asset**: Scanned document preview after local file selection.

### 6. Add Produce Harvest Image Preview (`/farmer/add-product`)
- **Component**: `<ImagePlaceholder aspectRatio="16:9" ... />`
- **Purpose**: Live visual preview of the produce photo as the farmer enters the image URL.
- **Recommended Ratio**: `16:9` (or `4:3`).
- **Dimensions**: `100%` width (~`680px`), height ~`280px`.
- **Object-Fit**: `cover`.
- **Requirement**: Essential for preventing broken image listings on the marketplace.
- **Replacement Asset**: Live crop photo entered by user or neutral fallback icon.

### 7. Empty State Visuals (Cart & Order History)
- **Component**: `<ImagePlaceholder aspectRatio="1:1" ... />` (Compact `96x96px` or `120x120px`)
- **Purpose**: Replaces blank empty states with gentle harvest illustrations.
- **Recommended Ratio**: `1:1` circle or squircle.
- **Requirement**: Highly recommended for user delight and retention.
- **Replacement Asset**: Minimalist line illustration of an empty wooden harvest crate or woven basket.
