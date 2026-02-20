# Specification

## Summary
**Goal:** Add a comprehensive admin settings panel to allow store administrators to configure store information, payment methods, shipping rates, tax settings, admin roles, logo, and theme colors.

**Planned changes:**
- Create new admin settings page at `/admin/settings` with dark luxury theme (matte black background with soft pink accents)
- Add store information section to update store name, contact email, phone number, and business address
- Implement payment methods configuration section to enable/disable Stripe payment options and manage payment gateway settings
- Create shipping rates configuration allowing admin to set flat rate, free shipping threshold, and region-specific shipping costs
- Add tax settings section to configure sales tax percentage and tax-exempt regions
- Implement admin roles management section to view and update role assignments (Super Admin, Product Manager, Order Manager, Customer Support)
- Create logo upload feature with preview and file validation to replace store logo image
- Add theme color customization with color pickers for primary brand colors (matte black, soft pink, silver) and secondary colors (lavender, icy blue)
- Implement backend storage and retrieval methods in Motoko actor for all settings configuration including store info, payment methods, shipping rates, tax settings, admin roles, logo blob, and theme colors
- Add access control to restrict settings updates to admin users only

**User-visible outcome:** Administrators can access a comprehensive settings panel to fully configure the Noir Penguin Fashion store, including business details, payment and shipping options, tax rules, admin permissions, branding (logo and colors), with all changes persisting to the backend and reflected across the application.
