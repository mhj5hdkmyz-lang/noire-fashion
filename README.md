# NOIRÉ — The Art of Modern Luxury

NOIRÉ storefront prototype with a Stripe Checkout integration scaffold.

## Included
- All seven existing product concepts and embedded product images retained.
- Product detail overlay, sizes XS–XXL, persistent shopping bag and quantity controls.
- Checkout button wired to a server-side `/api/checkout` endpoint.
- Server-side product price validation (browser-submitted prices are never trusted).
- Stripe-hosted Checkout, Germany-only shipping address collection, required billing address and phone number.
- Branded payment success page.

## Run locally
1. Install Node.js 20 or later.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and fill in Stripe TEST credentials and a shipping rate ID created in Stripe Dashboard.
4. Set `PUBLIC_BASE_URL=http://localhost:3000` for local testing.
5. Run `npm start` and open `http://localhost:3000`.

## Important — not live yet
The checkout is not ready to accept real orders until a Stripe account, test/live API keys, shipping rate, deployed HTTPS backend, verified product/stock data, tax treatment, and the legal pages and policies are configured. Start with Stripe test keys and test cards. Do not put secret keys in `index.html`, `script.js`, GitHub, or any public repository. Keep `.env` private; only `.env.example` belongs in the repository.

This project still contains concept products and example prices. Confirm that the products can actually be manufactured and sold before switching to live payments. Have the German legal, tax, privacy, shipping and returns setup reviewed before launch.
