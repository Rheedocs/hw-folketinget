process.env.NODE_ENV = 'test';

const { describe, it, before, beforeEach, after } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const Person = require('../src/models/person');
const { syncPeople, syncParties } = require('../src/services/syncService');

const TEST_DB = 'folketingSyncTestDB';

// Falsk klient: slår partiet op i et objekt i stedet for at kalde internettet
const fakeClient = (parties) => ({
    fetchParty: async (name) => (parties[name] ? { party: parties[name] } : null)
});

const createPerson = (name, party) =>
    Person.create({ name, party, roles: [{ position: 'minister' }] });

describe('syncService', () => {
    before(async () => {
        await mongoose.connect(`mongodb://127.0.0.1:27017/${TEST_DB}`);
        // Sikkerhed: aldrig slet i den rigtige database
        assert.strictEqual(mongoose.connection.name, TEST_DB);
    });

    beforeEach(async () => {
        await Person.deleteMany({});
    });

    after(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.disconnect();
    });

    it('syncParties_partiErAendret_opdatererPartiIDatabasen', async () => {
        // Arrange
        await createPerson('Test Person', 'S');
        const client = fakeClient({ 'Test Person': 'SF' });

        // Act
        const result = await syncParties(client);

        // Assert
        const saved = await Person.findOne({ name: 'Test Person' });
        assert.strictEqual(result.updated, 1);
        assert.strictEqual(saved.party, 'SF');
    });

    it('syncParties_partiErUaendret_opdatererIngenting', async () => {
        // Arrange
        await createPerson('Test Person', 'S');
        const client = fakeClient({ 'Test Person': 'S' });

        // Act
        const result = await syncParties(client);

        // Assert
        assert.strictEqual(result.updated, 0);
    });

    it('syncParties_personFindesIkkeIApiet_taellerSomNotFoundOgBeholderParti', async () => {
        // Arrange
        await createPerson('Test Person', 'S');
        const client = fakeClient({});

        // Act
        const result = await syncParties(client);

        // Assert
        const saved = await Person.findOne({ name: 'Test Person' });
        assert.strictEqual(result.notFound, 1);
        assert.strictEqual(saved.party, 'S');
    });

    it('syncPeople_toGangeMedSammeData_giverIngenDubletter', async () => {
        // Arrange
        const people = [{ name: 'Test Person', party: 'S', roles: [{ position: 'minister' }] }];

        // Act
        const first = await syncPeople(people);
        const second = await syncPeople(people);

        // Assert
        assert.strictEqual(first.created, 1);
        assert.strictEqual(second.created, 0);
        assert.strictEqual(await Person.countDocuments(), 1);
    });
});