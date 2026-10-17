# FarmDirect — Changelog

## [1.0.0] - 2026-10-17
### Added
- Complete 20-table PostgreSQL relational schema in `supabase/migrations/001_initial_schema.sql` with full Row Level Security (RLS).
- Exact integer paise currency calculation system avoiding floating point rounding errors.
- Multi-farmer cart grouping and atomic sub-order partitioning at checkout.
- Bilingual localization engine (English and हिन्दी / मराठी) with Devanagari slug sanitization.
- Clean feature-based architecture adhering to strict plain CSS and CSS variables.
- Pure CSS design tokens (`styles/variables.css`, `styles/global.css`, `styles/typography.css`, `styles/utilities.css`).
- Full unit and integration test coverage with Vitest.
