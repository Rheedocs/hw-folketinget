const Person = require('../models/person');

// Opretter nye personer og opdaterer eksisterende (på navn). Sletter aldrig noget.
exports.syncPeople = async (people) => {
    if (people.length === 0) {
        return { created: 0, updated: 0 };
    }

    const operations = people.map((person) => ({
        updateOne: {
            filter: { name: person.name },
            update: { $set: person },
            upsert: true
        }
    }));

    const result = await Person.bulkWrite(operations);
    return { created: result.upsertedCount, updated: result.modifiedCount };
};

// Spørger klienten om partiet for hver person og opdaterer, hvis det er ændret.
// Klienten gives udefra, så vi kan bruge en falsk i tests.
exports.syncParties = async (client) => {
    const persons = await Person.find();
    let updated = 0;
    let notFound = 0;

    // Ét kald ad gangen, så vi ikke overbelaster Folketingets API
    for (const person of persons) {
        const info = await client.fetchParty(person.name);
        if (!info) {
            notFound++;
            continue;
        }
        if (info.party !== person.party) {
            person.party = info.party;
            await person.save();
            updated++;
        }
    }

    return { updated, notFound };
};