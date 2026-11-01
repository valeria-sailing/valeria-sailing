# VALERIA – Webseite Version 2

Dreisprachiger (Deutsch / English / Русский) Prototyp für den privaten Segelkatamaran Valeria.

## Ansehen ohne Installation
`index.html` doppelklicken. Galerie, Sprachen und Layout funktionieren ohne Server.

## Fotos
Bilder in `images/` stammen aus den vom Eigner gelieferten Archiven. Bild `000062` zeigt die vom Eigner bestätigte Valeria mit Namensschriftzug. Die weiteren Fotos zeigen Erlebnisse auf den eigenen Törns und Landschaften. Keine externen Bootsfotos oder Unsplash-Fotos.
Bildnummern entsprechen den Vorschaunummern; für den finalen Launch können ausgewählte hochauflösende Originale eingesetzt werden.

## Deployment Cloudflare Pages
Projekt mit Git-Repository verbinden; dieses Verzeichnis als Basis verwenden. Für Cloudflare Pages Functions siehe `functions/`; die Datenbank wird über die D1-Bindung `DB` und `schema.sql` eingerichtet.

## Noch nicht produktionsbereit
- Kein Admin-Login und keine Live-Verfügbarkeit.
- Keine echten Buchungen, kein Online-Payment und keine Zahlungserinnerungen.
- Das Formular speichert erst dann Anfragen, wenn Cloudflare Pages Functions und D1 eingerichtet sind. Beim lokalen Öffnen ist der Versand nicht möglich.
- Vor Veröffentlichung: Impressum, Datenschutz, verbindliche Buchungsbedingungen und geprüfte Gästebewertungen ergänzen.
- Es wurden keine Törntermine oder Gästebewertungen erfunden.
