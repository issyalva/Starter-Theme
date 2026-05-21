# Design Tokens

The Style Dictionary token pipeline has been intentionally removed for now.

The theme is being reset to a simpler CSS-first foundation so a future styleguide can define tokens directly in CSS variables, rather than generating them from Figma tooling on day one.

If you bring tokens back later, the likely path is:

1. Define a small semantic variable set in CSS first
2. Map Figma output to those variables only after the styleguide is stable
3. Add build tooling back only if it still solves a real problem
