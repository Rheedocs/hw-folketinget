# Folketinget API

REST API til ministre og partiformænd i Folketinget, bygget med Node.js, Express og Mongoose. Gruppeopgave i Programmering (Hello World: Nicki, Goncalo og Mattias).

## Kom i gang

1. Kræver Node, Git og MongoDB lokalt på port 27017.
2. Hent projektet og installer pakkerne:

```
git clone https://github.com/Rheedocs/hw-folketinget.git
cd hw-folketinget
npm install
npm start
```

3. Serveren kører på http://localhost:3000. Der må kun køre én server ad gangen på port 3000.
4. Importér `postman/folketinget.json` i Postman for at teste endpoints.
5. Data lægges ind med `node seed.js` (når seed scriptet er færdigt).

## Struktur og hvorfor

```
src/
  app.js            samler Express, routes og fejlhåndtering
  routes/           vælger hvilken controller en request skal til
  controllers/      håndterer request og response og vælger statuskode
  models/           Mongoose schema for en person
  middleware/       central fejlhåndtering
```

**Hvorfor denne opdeling?** Hver mappe har ét ansvar, så det er let at finde, hvor noget sker, og ændre det uden at røre resten. Opgavens forslag er models, routes og controllers, og det har vi fulgt.

**Hvorfor ligger koden i `src`?** For at holde projektets rod overskuelig.

**Hvorfor har vi ikke et servicelag?** Controllerne kalder modellen direkte, fordi der endnu ikke er forretningsregler, som skal gælde uanset klient. Et servicelag, der bare videresender kald, ville være unødvendig kompleksitet. Hvis projektet voksede med regler, ville vi tilføje det.

## Datamodel

1. `name`: tekst, påkrævet, trimmes
2. `party`: tekst, påkrævet, trimmes
3. `position`: kun `minister` eller `formand`, påkrævet
4. `title`: tekst, valgfri (fx "Finansminister")
5. `startDate`: dato, valgfri

## Endpoints

1. `GET /api/persons` henter alle (200)
2. `GET /api/persons/:id` henter én (200, 400 ved ugyldigt id, 404 hvis den ikke findes)
3. `POST /api/persons` opretter (201, 400 ved manglende eller ugyldige felter)
4. `PUT /api/persons/:id` opdaterer (200, 400, 404)
5. `DELETE /api/persons/:id` sletter (200, 404)

## Fejlhåndtering

Fejl sendes med `next(err)` til `src/middleware/errorHandler.js`, som har fire parametre og logger den rigtige fejl på serveren. Ugyldige felter og ugyldigt id giver 400, ukendt id og ukendt endpoint giver 404, og alt andet giver 500.

## Test

Vi tester med en Postman collection (`postman/folketinget.json`). Den dækker: oprette og hente bagefter, at mellemrum trimmes, manglende navn, ugyldig position, ugyldigt id, ukendt id, opdatering, sletning og gentagen sletning. [Beskriv, hvad I fandt under test.]

## Hvem har lavet hvad

1. Create og read: Mattias [skriv din del]
2. Update og delete: Goncalo [skriv din del]
3. Skelet, seed, Postman og README: Nicki [skriv din del]

## Brug af AI

[Hver person skriver: hvad bad du agenten om, hvad foreslog den, og hvad ændrede du?]