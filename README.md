# NOIRÉ — The Art of Modern Luxury

Kompletter NOIRÉ-Shop mit sieben vorhandenen Artikeln, eigenen Produktdetailseiten, Größenwahl, Warenkorb, Stripe-Checkout und Informationsseiten.

## Enthaltene Funktionen
- Alle sieben vorhandenen Kleidungsstücke und eingebetteten Produktbilder bleiben erhalten.
- Produktbilder, Produktnamen und „Produkt ansehen“ öffnen jeweils eine eigene Produktdetail-URL (`produkt.html?product=...`).
- Größenwahl XS, S, M, L, XL und XXL vor dem Hinzufügen zur Bag.
- Gemeinsamer Warenkorb mit gespeicherten Artikeln, Größen, Mengen und Zwischensumme.
- Stripe Checkout auf dem Server; Preise werden serverseitig festgelegt und nicht aus dem Browser übernommen.
- Kartenzahlung und Klarna als Checkout-Zahlungsarten (Klarna muss im Stripe-Konto aktiviert und verfügbar sein).
- Seiten für Impressum, Datenschutz, AGB, Widerruf und Versand/Zahlung.

## Lokal starten
1. Node.js 20 oder neuer installieren.
2. Im Projektordner `npm install` ausführen.
3. `.env.example` in `.env` kopieren.
4. Stripe-Testschlüssel, eine in Stripe angelegte Versandtarif-ID und die Shop-URL in `.env` eintragen.
5. `npm start` ausführen und `http://localhost:3000` öffnen.

## Vor echtem Verkauf zwingend erledigen
**Diese Version ist eine vollständige Shop-Grundlage, aber noch nicht live-verkaufsbereit.** Es fehlen Angaben und Kontoeinstellungen, die nur der Shopbetreiber bereitstellen kann:
- Echte Verkäuferdaten in allen Rechtstexten (alle eckigen Klammern/Platzhalter ersetzen); Texte rechtlich prüfen lassen.
- Stripe-Konto aktivieren, Live-Schlüssel sicher beim Hosting hinterlegen, Klarna-Verfügbarkeit prüfen und Versandtarif erstellen.
- Eigene Domain mit HTTPS und Server-Hosting konfigurieren; `PUBLIC_BASE_URL` muss exakt auf die Live-Domain zeigen.
- Steuerbehandlung/Umsatzsteuer, Versandkosten, Lieferzeiten, Rücksendeadresse und Retourenprozess festlegen.
- Tatsächliche Warenverfügbarkeit, Material, Passform, Größentabellen, Pflegehinweise und Lieferzeiten für jedes Produkt bestätigen.
- Bestellbestätigung, Kundenservice, Rechnungsstellung und Versandabwicklung einrichten und vor Livegang Testbestellungen durchführen.

Die Rechtstext-Seiten enthalten bewusst klar markierte Platzhalter, weil Name, Rechtsform, Geschäftsadresse, Steuerstatus und konkrete Shop-Dienste nicht erfunden werden dürfen. **Nicht unverändert veröffentlichen.**

## Sicherheit
- Niemals `.env` oder Stripe-Geheimschlüssel committen.
- Nur `.env.example` gehört in GitHub.
- Zuerst Stripe-Testmodus verwenden. Erst nach erfolgreichen Tests und vollständiger rechtlicher/steuerlicher Einrichtung Live-Zahlungen aktivieren.
