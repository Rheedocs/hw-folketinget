# Folketinget API

REST API til ministre og partiformænd i Folketinget, bygget med Node.js, Express og Mongoose. Gruppeopgave i Programmering (Hello World: Nicki, Goncalo og Mattias).

## Kom i gang

1. Kræver Node, Git og MongoDB lokalt på port 27017. MongoDB skal køre, før serveren startes, ellers starter serveren ikke.
2. Hent projektet og installer pakkerne:

```
git clone https://github.com/Rheedocs/hw-folketinget.git
cd hw-folketinget
npm install
```

3. Læg data ind med `node seed.js` (21 ministre og 11 partiformænd). Det sletter alle ministre og formænd i din lokale database først, så scriptet kan køres igen uden dubletter.
4. Start serveren med `npm start`. Den kører på http://localhost:3000. Der må kun køre én server ad gangen på port 3000.
5. Importér `postman/folketinget.json` i Postman for at teste endpoints.

## Struktur og hvorfor

```
src/
  app.js            samler Express, routes og fejlhåndtering
  routes/           vælger hvilken controller en request skal til
  controllers/      håndterer request og response og vælger statuskode
  models/           Mongoose schema for en person
  middleware/       central fejlhåndtering
seed.js             lægger 21 ministre og 11 partiformænd ind
postman/            Postman collection til test
```

**Hvorfor denne opdeling?** Hver mappe har ét ansvar, så det er let at finde, hvor noget sker, og ændre det uden at røre resten. Opgavens forslag er models, routes og controllers, og det har vi fulgt.

**Hvorfor ligger koden i `src`?** For at holde projektets rod overskuelig.

**Hvorfor har vi ikke et servicelag?** Controllerne kalder modellen direkte, fordi der endnu ikke er forretningsregler, som skal gælde uanset klient. Et servicelag, der bare videresender kald, ville være unødvendig kompleksitet. Hvis projektet voksede med regler, ville vi tilføje det.

## Datamodel

1. `name`: tekst, påkrævet, trimmes
2. `party`: tekst, påkrævet, trimmes
3. `position`: kun `minister` eller `formand`, påkrævet
4. `title`: tekst, valgfri (fx "Finansminister")
5. `startDate`: dato, valgfri. Vi har ikke udfyldt den i seed data. Datoerne står på hver persons CV side på ft.dk, men opgaven siger "hvis muligt", og vi prioriterede CRUD, tests og at kunne forklare koden. Feltet kan sættes med POST og PUT.

Tre personer er både minister og formand (Mette Frederiksen, Pia Olsen Dyhr og Lars Løkke Rasmussen). De findes to gange i databasen med hver sin position, fordi en person kun har én position i modellen, og det holder opgaven enkel.
Vi bruger ikke et eksternt API. Data ligger i vores egen MongoDB og lægges ind med `node seed.js` fra ministerlisten og partiformændene på ft.dk. Opgaven kræver ikke et bestemt API, og Mikkel har bekræftet, at man selv vælger.

## Endpoints

1. `GET /api/persons` henter alle (200)
2. `GET /api/persons/:id` henter én (200, 400 ved ugyldigt id, 404 hvis den ikke findes)
3. `POST /api/persons` opretter (201, 400 ved manglende eller ugyldige felter)
4. `PUT /api/persons/:id` opdaterer kun de felter, der sendes (delvis opdatering), og de øvrige beholder deres værdi (200, 400, 404)
5. `DELETE /api/persons/:id` sletter (200, 400 ved ugyldigt id, 404)

## Fejlhåndtering

Fejl sendes med `next(err)` til `src/middleware/errorHandler.js`, som har fire parametre og logger den rigtige fejl på serveren. Ugyldige felter og ugyldigt id giver 400, ukendt id og ukendt endpoint giver 404, og alt andet giver 500.

## Test

Vi tester med en Postman collection (`postman/folketinget.json`). Den dækker: oprette og hente bagefter, at mellemrum trimmes, manglende navn, ugyldig position, ugyldigt id, ukendt id, opdatering, sletning og gentagen sletning.
Under test fandt vi, at PUT kun ændrer de felter, der sendes, så den er en delvis opdatering, og at runValidators er nødvendig, ellers kan en ugyldig position gemmes ved opdatering. Vi oplevede også falske 404 fejl, fordi en anden server stadig kørte på port 3000, derfor må der kun køre én ad gangen.

## Hvem har lavet hvad

1. Create og read: Mattias [skriv din del]
2. Update og delete: Goncalo [skriv din del]
3. Skelet, seed, Postman og README: Nicki. Opsatte repo, issues, regler og PR skabelon, lavede model, routes og seed, reviewede Gons og Mattias' PR'er og testede dem i Postman.

## Brug af AI

[Hver person skriver: hvad bad du agenten om, hvad foreslog den, og hvad ændrede du?]
Nicki: Jeg brugte Claude til at tilpasse ministerlisten og lave formandslisten i seed.js, til AGENTS.md, PR skabelonen og README udkastet, og til at få en Postman collection til at teste Gons update og delete. 
Jeg læste alt igennem, testede selv i Postman og rettede det, der ikke passede, fx at seed.js kun må slette ministre og formænd.

Gon: [skriv din del]

Mattias: [skriv din del]