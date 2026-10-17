# FarmDirect — Business Rules & Invariants

## 1. Financial Integrity (Integer Paise)
- All monetary amounts (prices, subtotals, delivery fees, taxes, discounts, totals) MUST be calculated and stored as **integer paise** (`1 Rupee = 100 Paise`).
- Floating-point arithmetic for currency is strictly prohibited.
- Conversions between Rupees and Paise must use `rupeesToPaise` and `paiseToRupees`.

## 2. Multi-Farmer Order Partitioning
- A customer cart may include products originating from multiple independent farmers.
- Upon checkout, the system generates:
  1. A parent `checkout_group_id` tying the customer's checkout session.
  2. Distinct, isolated sub-orders in the `orders` table—one sub-order per unique farmer.
- **Data Isolation**: A farmer dashboard displays ONLY the sub-orders assigned to that farmer. A farmer cannot view items, revenues, or customer details belonging to another farmer.

## 3. Order Lifecycle State Machine
Valid order status transitions are strictly unidirectional:
```
pending_confirmation
  ├──> rejected (Farmer declines due to stock/weather)
  ├──> cancelled (Customer cancels prior to packaging)
  └──> confirmed
         └──> preparing (Harvesting / sorting)
                ├──> ready_for_pickup (If farmgate pickup chosen)
                └──> out_for_delivery (If local delivery chosen)
                       └──> delivered ──> completed
```
- Only pending confirmation orders may be cancelled by the customer.
- Only the assigned farmer can accept, prepare, or dispatch an order.

## 4. Delivery Fee & Free Delivery Threshold
- Configured dynamically per service area in `service_areas`.
- **Default Rule**: Orders of ₹500 or more (50,000 paise) from a farm receive **FREE delivery**.
- Orders under ₹500 incur a standard ₹40 delivery fee (4,000 paise).
- Farmgate pickup incurs ₹0 fee.

## 5. Organic & Quality Claims
- Products may ONLY be flagged as `is_certified_organic = true` if supported by uploaded and verified NPOP or PGS-India certification documents.
- Farmers practicing natural or residue-free farming are labeled "Natural Farmgate" to preserve complete transparency.
