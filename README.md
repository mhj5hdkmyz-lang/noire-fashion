# NOIRÉ — The Art of Modern Luxury

Kompletter NOIRÉ-Shop mit den bestehenden Artikeln plus neun neuen Damen-Sculpt-Artikeln, eigenen Produktdetailseiten, Größenwahl, Warenkorb, Stripe-Checkout und Informationsseiten.

## Enthaltene Funktionen
- Alle vorhandenen Kleidungsstücke und eingebetteten Produktbilder bleiben erhalten.
- Neu: Sculpt Leggings, Sculpt Flared Pants und Matching Crop Tops, jeweils in Obsidian Black, Ivory Cream und Deep Plum (insgesamt neun neue Produktseiten).
- Neu: Lieferantenbrief als HTML zum Drucken/PDF-Speichern und als Markdown zum Bearbeiten; inklusive Materialvorgaben, Logo-Positionen, Qualitätscheck und Anfrage-Mail.
- Produktbilder, Produktnamen und „Produkt ansehen“ öffnen jeweils eine eigene Produktdetail-URL (`produkt.html?product=...`).
- Größenwahl XS, S, M, L, XL und XXL vor dem Hinzufügen zur Bag.
- Gemeinsamer Warenkorb mit gespeicherten Artikeln, Größen, Mengen und Zwischensumme.
- Stripe Checkout auf dem Server; Preise werden serverseitig festgelegt und nicht aus dem Browser übernommen.
- Stripe Checkout mit Kredit-/Debitkarte, PayPal, Klarna, SEPA-Lastschrift und Link. Apple Pay und Google Pay können als Karten-Wallets erscheinen, wenn Gerät, Browser, Domain und Stripe-Konto die Voraussetzungen erfüllen.
- Die Anzeige jeder Zahlungsart hängt von Freischaltung, Land, Währung, Warenkorb und Risikoprüfung durch Stripe bzw. den jeweiligen Anbieter ab; nicht jede Methode erscheint bei jeder Bestellung.
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
- Stripe-Konto aktivieren und im Stripe-Dashboard PayPal, Klarna, SEPA-Lastschrift und Link freischalten bzw. beantragen; Verfügbarkeit und Konditionen prüfen. Apple Pay/Google Pay in den Wallet-/Domain-Einstellungen aktivieren und Domain verifizieren. Live-Schlüssel sicher beim Hosting hinterlegen und Versandtarif erstellen.
- SEPA-Lastschrift kann zeitverzögert bestätigt oder fehlgeschlagen sein. Vor dem Versand muss der Zahlungseingang im Stripe-Dashboard geprüft werden. Für automatisierte Bestellbestätigung und Versandfreigabe ist zusätzlich ein korrekt eingerichteter Stripe-Webhook mit Bestellverwaltung erforderlich; diese Shop-Version speichert Bestellungen noch nicht dauerhaft.
- Eigene Domain mit HTTPS und Server-Hosting konfigurieren; `PUBLIC_BASE_URL` muss exakt auf die Live-Domain zeigen.
- Steuerbehandlung/Umsatzsteuer, Versandkosten, Lieferzeiten, Rücksendeadresse und Retourenprozess festlegen.
- Tatsächliche Warenverfügbarkeit, Material, Passform, Größentabellen, Pflegehinweise und Lieferzeiten für jedes Produkt bestätigen.
- Bestellbestätigung, Kundenservice, Rechnungsstellung und Versandabwicklung einrichten und vor Livegang Testbestellungen durchführen.

Die Rechtstext-Seiten enthalten bewusst klar markierte Platzhalter, weil Name, Rechtsform, Geschäftsadresse, Steuerstatus und konkrete Shop-Dienste nicht erfunden werden dürfen. **Nicht unverändert veröffentlichen.**

## Sicherheit
- Niemals `.env` oder Stripe-Geheimschlüssel committen.
- Nur `.env.example` gehört in GitHub.
- Zuerst Stripe-Testmodus verwenden und jede aktivierte Zahlungsart testen. SEPA-Testzahlungen können verzögert abgeschlossen werden. Erst nach erfolgreichen Tests und vollständiger rechtlicher/steuerlicher Einrichtung Live-Zahlungen aktivieren.
