import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? new Stripe(stripeKey) : null;

// Prices are authoritative on the server. Never accept prices sent by the browser.
const catalog = {
  'NOIRÉ Oversized Hoodie Black': 11900,
  'NOIRÉ Women Set Ivory': 14900,
  'NOIRÉ Women Shorts Black': 6900,
  'NOIRÉ Premium Tee Ivory': 5900,
  'NOIRÉ Women Tee & Shorts Look': 11900,
  'NOIRÉ Essential Sweatwear': 9900,
  'NOIRÉ Dark Plum Set': 14900
};
const validSizes = new Set(['XS','S','M','L','XL','XXL']);

app.use(express.json({limit:'20kb'}));
app.use(express.static(__dirname));

app.post('/api/checkout', async (req, res) => {
  try {
    if (!stripe) return res.status(503).json({error:'Der Checkout ist noch nicht konfiguriert. Stripe-Testzugang fehlt.'});
    if (!process.env.STRIPE_SHIPPING_RATE_ID) return res.status(503).json({error:'Versandtarif fehlt noch in der Shop-Konfiguration.'});
    const items = req.body?.items;
    if (!Array.isArray(items) || items.length < 1 || items.length > 20) {
      return res.status(400).json({error:'Deine Bag enthält keine gültigen Artikel.'});
    }
    const line_items = [];
    for (const item of items) {
      const unitAmount = catalog[item?.name];
      const quantity = Number(item?.quantity);
      const size = String(item?.size || '');
      if (!unitAmount || !validSizes.has(size) || !Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
        return res.status(400).json({error:'Ein Artikel in deiner Bag ist ungültig. Bitte lade die Seite neu.'});
      }
      line_items.push({
        quantity,
        price_data: {
          currency: 'eur',
          unit_amount: unitAmount,
          product_data: {name: item.name, description: `NOIRÉ · Größe ${size}`, metadata: {size}}
        }
      });
    }
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      shipping_address_collection: {allowed_countries: ['DE']},
      shipping_options: [{shipping_rate: process.env.STRIPE_SHIPPING_RATE_ID}],
      billing_address_collection: 'required',
      phone_number_collection: {enabled: true},
      allow_promotion_codes: true,
      success_url: `${process.env.PUBLIC_BASE_URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.PUBLIC_BASE_URL}/index.html#shop`,
      metadata: {store: 'NOIRE'}
    });
    res.json({url: session.url});
  } catch (error) {
    console.error('Checkout error:', error.message);
    res.status(500).json({error:'Die Kasse konnte gerade nicht gestartet werden. Bitte versuche es erneut.'});
  }
});

app.listen(port, () => console.log(`NOIRÉ läuft auf Port ${port}`));
