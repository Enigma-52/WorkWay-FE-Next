# WorkWay Design System

This document defines colours, theme, typography, and page patterns for the WorkWay frontend. Use it to keep pages consistent and to build new features that feel native to the product.

---

## 1. Colour & Theme

### Palette (HSL, defined in `globals.css`)

| Token | Value | Usage |
|-------|--------|--------|
| **Background** | `220 20% 4%` | Page and app background (dark blue‑grey). |
| **Foreground** | `60 10% 96%` | Primary text. |
| **Card** | `220 18% 8%` | Cards, elevated surfaces, hero cards. |
| **Primary** | `82 100% 55%` | Brand lime/green — CTAs, highlights, links, focus rings. |
| **Primary foreground** | `220 20% 4%` | Text on primary (dark). |
| **Secondary** | `220 15% 12%` | Secondary surfaces, inputs, chips. |
| **Muted** | `220 15% 15%` | Muted surfaces. |
| **Muted foreground** | `220 10% 55%` | Secondary text, captions, meta. |
| **Border** | `220 15% 18%` | Borders, dividers. |
| **Accent** | Same as primary | Hover/accent states. |
| **Destructive** | `0 84% 60%` | Errors, destructive actions. |
| **Ring** | `82 100% 55%` | Focus ring (matches primary). |

### Custom tokens

- **`--glow-primary`**: Strong primary glow for hero CTAs and key buttons.
- **`--glow-subtle`**: Soft primary glow for hover states (e.g. job cards).
- **`--gradient-hero`**: `linear-gradient(135deg, background → card)` for hero sections.
- **`--gradient-card`**: Vertical gradient for card backgrounds.
- **`--gradient-text`**: Foreground → primary gradient for headline highlights.

### Usage rules

- Use **primary** sparingly: one main CTA per section, key labels, and active filter states.
- Prefer **muted-foreground** for secondary text; **foreground** for primary copy.
- Cards and list items: **bg-card**, **border-border**, hover: **border-primary/30** and **glow-subtle**.
- Buttons: **primary** for main actions; **outline** or **secondary** for secondary actions.

---

## 2. Typography

- **Display / headings**: `Space Grotesk` (`--font-display`). Use for all `h1`–`h6`; **bold**, **tracking-tight**.
- **Body**: Same font by default; avoid mixing in body unless intentional.
- **Mono**: `JetBrains Mono` (`--font-mono`). Use for: labels, filters, counts, “meta” text, chips.

### Scale and patterns

- **Hero title**: `text-4xl md:text-5xl lg:text-6xl`, **font-display**, **font-bold**, **tracking-tight**. Optional **text-gradient** or **text-primary** for one or two words.
- **Section title**: `text-2xl`–`text-3xl`, **font-display**, **font-semibold**.
- **Card title**: `text-lg`–`text-xl`, **font-display**, **font-semibold**.
- **Body**: `text-base` or `text-lg`; **leading-relaxed** for long copy.
- **Small / meta**: `text-sm` or `text-xs`, **text-muted-foreground**, **font-mono** where appropriate.

---

## 3. Spacing & Layout

- **Container**: `container` + `mx-auto`; use `max-w-7xl` or `max-w-6xl` where needed.
- **Section padding**: `py-12`–`py-24` for main content; `py-16 md:py-24` for hero sections.
- **Gaps**: `gap-4` for tight lists; `gap-6`–`gap-8` for sections; `gap-2`–`gap-3` for inline chips/filters.

---

## 4. Component Patterns

### Hero (page header)

- **Section**: `relative overflow-hidden border-b border-border bg-gradient-hero` (or equivalent using `--gradient-hero`).
- **Blur orb**: `absolute` centred blob, e.g. `h-[400px] w-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none`.
- **Badge/chip**: `inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5`; icon + `font-mono text-sm text-primary`.
- **Title**: One line with a highlighted word in **text-primary** or **text-gradient**.
- **Subtitle**: `text-lg text-muted-foreground`, `max-w-2xl` or `max-w-3xl`.

### Cards (e.g. job, company)

- **Base**: `rounded-xl` (or `rounded-lg`), `border border-border`, `bg-card`, `p-6`, **transition-all duration-300**.
- **Hover**: `hover:border-primary/30` (or `/40`), **glow-subtle**; optional `bg-primary/5` overlay.
- **Class**: Use `.job-card` from globals when it matches (card + hover).

### Chips / badges

- **Neutral**: `chip` class, or `inline-flex items-center px-3 py-1.5 text-xs font-medium tracking-wide uppercase border border-border rounded-full text-muted-foreground bg-secondary/50`; hover: `border-primary/30 text-foreground`.
- **Primary accent**: `border-primary/30 text-primary` for selected/active filters.

### Buttons

- **Primary CTA**: `variant="hero"` or `variant="default"`; **primary** background, optional **glow-primary** for hero.
- **Secondary**: `variant="outline"` or `variant="ghost"`; **border-border** for outline.
- **Sizes**: `size="sm"` for filters; `size="default"` or `size="lg"` for main CTAs.

### Inputs & selects

- **Style**: `bg-secondary border-border`, **focus:border-primary focus:ring-2 focus:ring-primary/20**.
- **Icons**: Absolute position (e.g. left-3), **text-muted-foreground**.

---

## 5. Page Patterns

### List/search pages (e.g. Jobs, Companies)

1. **Hero**: Short title + subtitle + optional stats (e.g. “X open positions”, “Updated daily”).
2. **Toolbar**: Search + filters in one row (or stacked on small screens). Use **font-mono** for filter labels.
3. **Content**: Grid or stack of cards; consistent gap (`gap-4`).
4. **Empty state**: Centred icon (muted), short heading, supporting text, “Clear filters” or primary action.
5. **Pagination**: Centred row; current page **bg-primary text-primary-foreground**; others **ghost** or **outline**.

### Detail pages (e.g. Job, Company)

- **Header**: Breadcrumb or context, title, key meta (company, location, type).
- **Body**: Clear sections; **section-heading** for labels where defined in globals.

---

## 6. Motion & Polish

- **Stagger**: Use `animate-fade-up` with `stagger-1` … `stagger-6` for hero and list items.
- **Cards**: `animate-fade-in` or `transition-all duration-300` for hover.
- **Lists**: Optional stagger delay per item (e.g. `animationDelay: index * 50ms`) for a subtle cascade.
- Prefer **short** (200–300ms) transitions; reserve **pulse-glow** for hero or special CTAs.

---

## 7. Accessibility & Consistency

- **Focus**: All interactive elements must show a visible focus ring (**ring**, **ring-primary**).
- **Contrast**: Keep primary text on primary background (primary-foreground on primary).
- **Links**: Use **text-primary** and **hover:underline** (or Button asChild) for in-content links.

Use this doc as the single source of truth for colours, type, spacing, and page structure when building or refactoring pages.
