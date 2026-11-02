# BSCLY — Maison for Pets

An editorial storefront redesign for **bsclyforpets.com** — all-white ground, Didone headlines,
real product photography from the live BSCLY catalogue, built to drop into Shopify.

**Live preview:** https://github.com/ — see the Pages URL in the repo settings (Actions/Pages).

---

## Pages

| File | What it is |
|---|---|
| `index.html` | Home — hero, house standard, shop by concern, bestsellers, Meow range, bath-day ritual, formulary, full shelf, promise, newsletter |
| `collection.html` | All 14 products, working filters (pet / concern / format) + price & name sort |
| `product.html` | PDP — gallery, 1L / 200ml variants, qty, add to bag, accordions, cross-sell |
| `ingredients.html` | The formulary — 10-point pack checklist, 8 actives, sourcing, FAQ |
| `wholesale.html` | Trade page — stats, six reasons, three tiers, enquiry form |
| `assets/theme.css` | The design system (white ground, hairline grid, one accent) |
| `assets/theme.js` | Cart, filters, gallery, variants, accordions, reveals, toasts |
| `build.py` | Page generator — edit copy / products / images here, run `python3 build.py`, all pages rebuild |

## Run it locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Add `?static` to any URL (`index.html?static`) to fire every scroll-reveal immediately — handy for
screenshots and client walkthroughs.

## What works

- **Cart drawer** with localStorage, qty +/−, remove, free-shipping bar (₹499), subtotal
- **Quick add** on hover from any card
- **Collection filters** — pet, concern, format, all combinable, live count, sort by price/name
- **PDP** — thumbnail gallery, size variant switching that updates price, quantity stepper, accordions
- **Mobile menu**, toast confirmations, scroll reveals

Cart and checkout are front-end only. Wire `data-checkout` to Shopify's cart permalink or the
Storefront API when the theme goes live.

## Design notes

| Token | Value | Use |
|---|---|---|
| White | `#FFFFFF` | The whole ground — no grey bands, no dark sections |
| Ink | `#0F0E0C` | Type, hairlines, filled buttons |
| Clay | `#8C3B2E` | The single accent: eyebrows, seal, progress bar |
| Line | `rgba(15,14,12,.12)` | Every border and divider |

Display type is **Bodoni Moda** (Didone), text is **Jost** at 300 with `.28em` tracked small caps.
Product shots sit on pure white with `mix-blend-mode: multiply`, so the transparent pack PNGs and the
white-background JPGs both sit correctly without retouching.

## Products

Fourteen SKUs with real names, real prices (₹199–₹799) and the live CDN pack shots:
Neem Pet Herbal Shampoo, Total Care, Pawfect 5, Meow Strawberry, Dry Bath (Peach), Pet Dry Shampoo,
three Paw Cleaners, Natural Paw Balm, Pet Perfume Mist, Anti Chew Spray, Neem Flea & Tick Powder,
Dog Bath Brush.

To add more: append a row to the `P` list in `build.py` (title, price, image URL, pet, concern,
format, notes, tag) and re-run it.

## Porting to Shopify

| This file | Shopify |
|---|---|
| `index.html` hero | `sections/hero-editorial.liquid` + `templates/index.json` |
| concern chips | `sections/concern-rail.liquid` (blocks) |
| product grids | `sections/featured-collection.liquid` (loops `collection.products`) |
| ritual split / formulary / promise | `sections/ritual-split.liquid`, `ingredient-strip.liquid`, `promise-grid.liquid` |
| `collection.html` | `templates/collection.json` + `main-collection-product-grid.liquid` |
| `product.html` | `templates/product.json` + `main-product.liquid` (`{% form 'product' %}`, `product.variants`) |
| cart drawer | `snippets/cart-drawer.liquid` + `/cart/add.js`, `/cart/change.js` |
| `<img src="cdn.shopify.com/...">` | `{{ product.featured_image \| image_url: width: 900 \| image_tag }}` |

Colours and type go into `config/settings_schema.json` so the client can edit them in the theme editor.
