---
title: Math
description: Typeset LaTeX with KaTeX, and step through formulas with clicks.
---

# Math

`$...$` is inline math and `$$ ... $$` is a block. *KaTeX draws them while the deck is generated, and its CSS and fonts are only part of the build when a deck uses math.

```md
Inline $\sqrt{3x-1}+(1+x)^2$

$$ {1|2|all}
\begin{aligned}
\nabla \cdot \vec{E} &= \frac{\rho}{\varepsilon_0} \\
\nabla \cdot \vec{B} &= 0
\end{aligned}
$$
```

- `{1|2|all}` after the opening `$$` steps through the formula's lines with clicks, with the same range syntax as code.
- Inline math follows Slidev's rule, so `$5 and $10` stays text.
- Inside math, `{{` is math, never an Angular interpolation.
- `mhchem` is not loaded.

A `setup/katex.ts` file returns KaTeX options such as `macros`. See [Setup hooks](../customize/setup-hooks.md).
