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

3. Læg data ind med `node seed.js` (29 personer). Scriptet sletter ikke noget. Det opretter de personer, der mangler, og opdaterer dem, der allerede findes (på navn og position), så det kan køres igen uden dubletter, og personer, du selv har oprettet, bliver ikke rørt.
4. Start serveren med `npm start`. Den kører på http://localhost:3000. Der må kun køre én server ad gangen på port 3000.
5. Importér `postman/folketinget.json` i Postman for at teste endpoints.

## Struktur og hvorfor

```
src/
  app.js            samler Express, routes og fejlhåndtering
  server.js         forbinder til MongoDB og starter serveren
  routes/           vælger hvilken controller en request skal til
  controllers/      håndterer request og response og vælger statuskode
  models/           Mongoose schema for en person
  middleware/       central fejlhåndtering
  services/         logik uden for controllerne, her synkronisering
  clients/          henter data fra eksterne API'er og oversætter dem
  jobs/             scripts, der kan køres efter en tidsplan
test/               automatiske tests (npm test)
seed.js             lægger 28 personer ind (ministre og partiformænd)
postman/            Postman collection til test
```

**Hvorfor denne opdeling?** Hver mappe har ét ansvar, så det er let at finde, hvor noget sker, og ændre det uden at røre resten. Opgavens forslag er models, routes og controllers, og det har vi fulgt.

**Hvorfor ligger koden i `src`?** For at holde projektets rod overskuelig.

**Hvorfor har vi et servicelag, men kun til synkronisering?** Controllerne kalder stadig modellen direkte, fordi CRUD ikke har egne regler, og et lag, der bare videresender kald, ville være unødvendig kompleksitet. Synkroniseringen med Folketingets API har derimod rigtig logik og to indgange (`seed.js` og et natligt job), så den ligger i `src/services/syncService.js`. Controlleren er uændret.

## Datamodel

En person har et navn, et parti og en liste af roller.

1. `name`: tekst, påkrævet, trimmes
2. `party`: tekst, påkrævet, trimmes
3. `roles`: liste med mindst én rolle. Hver rolle har:
    1. `position`: kun `minister` eller `formand`, påkrævet
    2. `title`: tekst, valgfri (fx "Finansminister")
    3. `startDate`: dato, valgfri. Vi har ikke udfyldt den i seed data. Datoerne står på hver persons CV side på ft.dk, men opgaven siger "hvis muligt", og vi prioriterede CRUD, tests og at kunne forklare koden.

Tre personer er både minister og formand (Mette Frederiksen, Pia Olsen Dyhr og Lars Løkke Rasmussen). De findes kun én gang i databasen med to roller, så navn og parti kun skal rettes ét sted.

Konsekvens: roller ligger inde i personen, så en PATCH med `roles` erstatter hele listen og ikke kun én rolle. Det er en afvejning ved at gemme roller i en liste i stedet for som egne dokumenter.

Vi bruger ikke et eksternt API. Data ligger i vores egen MongoDB og lægges ind med `node seed.js` fra ministerlisten og partiformændene på ft.dk. Opgaven kræver ikke et bestemt API, og Mikkel har bekræftet, at man selv vælger.

## Endpoints

1. `GET /api/persons` henter alle (200)
2. `GET /api/persons/:id` henter én (200, 400 ved ugyldigt id, 404 hvis den ikke findes)
3. `POST /api/persons` opretter (201, 400 ved manglende eller ugyldige felter)
4. `PATCH /api/persons/:id` opdaterer kun de felter, der sendes (delvis opdatering), og de øvrige beholder deres værdi (200, 400, 404)
5. `DELETE /api/persons/:id` sletter (200, 400 ved ugyldigt id, 404)

## Fejlhåndtering

Fejl sendes med `next(err)` til `src/middleware/errorHandler.js`, som har fire parametre og logger den rigtige fejl på serveren. Ugyldige felter og ugyldigt id giver 400, ukendt id og ukendt endpoint giver 404, og alt andet giver 500.
Forskel på 400 og 404 (Mattias): 400 betyder "Bad Request" og opstår, når klienten sender ugyldige data. 404 betyder "Not Found" og opstår, når en ressource ikke findes.

## Test

Vi tester med en Postman collection (`postman/folketinget.json`) med 19 requests. Den dækker: oprette og hente bagefter, at mellemrum trimmes, manglende navn, ugyldig position, ugyldig JSON, ugyldigt id, ukendt id, hel og delvis opdatering, sletning, gentagen sletning og at personen er væk bagefter.
Collectionen kan også køres uden Postman med `npx newman run postman/folketinget.json`. Derudover har vi automatiske tests i `test/person.test.js`, som køres med `npm test`. De bruger en separat testdatabase (`folketingTestDB`), så vores egentlige data ikke bliver rørt, og de kræver, at MongoDB kører.
Under test fandt vi, at PATCH kun ændrer de felter, der sendes, så den er en delvis opdatering, og at runValidators er nødvendig, ellers kan en ugyldig position gemmes ved opdatering. Vi oplevede også falske 404 fejl, fordi en anden server stadig kørte på port 3000, derfor må der kun køre én ad gangen.

## Hvem har lavet hvad

1. Create og read: Mattias. lavede create og read, testede i Postman, lavede PR for create og read også.
2. Update og delete: Goncalo. Lavede update og delete, testede i Postman, lavede PR og reviewede Nicki og Mattias' PR'er. Testede Mattias' create og read i Postman.
3. Skelet, seed, Postman og README: Nicki. Opsatte repo, issues, regler og PR skabelon, lavede model, routes og seed, reviewede Gons og Mattias' PR'er og testede dem i Postman.

## Brug af AI

Nicki: Jeg brugte Claude til at tilpasse ministerlisten og lave formandslisten i seed.js, til AGENTS.md, PR skabelonen og README udkastet, og til at få en Postman collection til at teste Gons update og delete. 
Jeg læste alt igennem, testede selv i Postman og rettede det. Jeg læste alt igennem, testede selv i Postman og rettede det, der ikke passede.

Gon: Jeg brugte copilot til at review min update og delete kode, da jeg selv skrev koden først. Den eneste den foreslog var at bruge returnDocument: true i update, hvilket jeg gjorde. Jeg testede i Postman, og statuskoder virkede som forventet.

Mattias: Jeg bad agenten om at lave en plan for mit issue, derefter tjekket jeg planen som den forslog og sikre at den overholdte issuet.

## Efter Mikkels feedback

1. PUT er ændret til PATCH, fordi opdateringen kun ændrer de felter, der sendes.
2. seed.js sletter ikke længere noget, men opretter eller opdaterer personer. Den gamle regel ramte i praksis alle personer, også dem en bruger selv havde oprettet.
3. Alle fejlbeskeder er nu på engelsk.
4. app.js og server.js er delt, så vi kan have automatiske tests.
5. En person kan nu have flere roller i en liste, så samme person ikke står flere gange. seed.js, tests og Postman er opdateret til den nye form.
6. Der er en klient og en `syncService`, som kan opdatere partier fra Folketingets åbne API, og jobbet køres med `npm run sync`. Controlleren er uændret.
7. Der er nu 15 automatiske tests, bl.a. af synkroniseringen med en falsk klient.

## Synkronisering med Folketingets API

Folketingets åbne API (`https://oda.ft.dk/api`) kræver ingen nøgle. En person ligger som en aktør, hvor partiet står som XML inde i feltet `biografi`. Derfor er der en klient i `src/clients/folketingClient.js`, som henter en person og oversætter til det, vi bruger (partiets forkortelse). Servicen `syncParties` får klienten ind udefra, sammenligner med databasen og opdaterer kun de partier, der er ændret. I tests bruger vi en falsk klient, så testene ikke afhænger af internettet.

Jobbet køres med `npm run sync`. Det kalder API'et én gang pr. person og skriver, hvor mange partier der er opdateret, og hvor mange navne der ikke blev fundet. For at køre det hver nat kan man sætte kommandoen ind i Windows Opgavestyring eller cron. Controlleren behøver ikke ændres.

Afgrænsning: roller (minister og formand) står som fri tekst i API'et, så dem synkroniserer vi ikke. Partiet læses med et lille mønster i XML'en, som kan gå i stykker, hvis Folketinget ændrer formatet. Jobbet afslørede en fejl i vores egne data: Radikale Venstres leder var stavet forkert i `seed.js` og er rettet.