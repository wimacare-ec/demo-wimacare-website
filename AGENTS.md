# WIMA CARE project instructions

Before making any visual, UI, layout, component, or CSS change, read and follow `DESIGN_SYSTEM.md`.

- Treat the six canonical colors in `DESIGN_SYSTEM.md` as the source of truth for all new design work.
- Use the `--brand-*` semantic CSS variables defined in `src/styles/global.css`; do not add arbitrary hard-coded colors.
- Existing legacy colors may remain while maintaining old components, but do not extend them into new components unless the user explicitly requests it.
- Preserve accessible text contrast, responsive behavior, and the established restrained health-care visual tone.
