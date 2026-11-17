process.env.NODE_ENV = 'test';

const { describe, it, before, beforeEach, after } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../src/app');
const Person = require('../src/models/person');

const TEST_DB = 'folketingTestDB';

describe('Person API', () => {
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

    it('getAll_tomDatabase_returnerer200OgTomListe', async () => {
        // Arrange (databasen er tom efter beforeEach)

        // Act
        const res = await request(app).get('/api/persons');

        // Assert
        assert.strictEqual(res.status, 200);
        assert.deepStrictEqual(res.body, []);
    });

    it('create_gyldigPersonMedMellemrum_returnerer201OgTrimmerNavn', async () => {
        // Arrange
        const body = { name: '   Trim Test   ', party: 'Testpartiet', position: 'formand' };

        // Act
        const res = await request(app).post('/api/persons').send(body);

        // Assert
        assert.strictEqual(res.status, 201);
        assert.strictEqual(res.body.name, 'Trim Test');
        assert.strictEqual(await Person.countDocuments(), 1);
    });

    it('create_manglerName_returnerer400', async () => {
        // Arrange
        const body = { party: 'Testpartiet', position: 'minister' };

        // Act
        const res = await request(app).post('/api/persons').send(body);

        // Assert
        assert.strictEqual(res.status, 400);
        assert.ok(res.body.error);
    });

    it('getById_ukendtId_returnerer404', async () => {
        // Arrange
        const unknownId = '000000000000000000000000';

        // Act
        const res = await request(app).get(`/api/persons/${unknownId}`);

        // Assert
        assert.strictEqual(res.status, 404);
        assert.strictEqual(res.body.error, 'Person not found');
    });

    it('getById_ugyldigtId_returnerer400', async () => {
        // Arrange
        const invalidId = 'abc';

        // Act
        const res = await request(app).get(`/api/persons/${invalidId}`);

        // Assert
        assert.strictEqual(res.status, 400);
        assert.strictEqual(res.body.error, 'Invalid id');
    });

    it('update_kunParty_aendrerKunParty', async () => {
        // Arrange
        const person = await Person.create({
            name: 'Test Person',
            party: 'Testpartiet',
            position: 'minister'
        });

        // Act
        const res = await request(app)
            .patch(`/api/persons/${person._id}`)
            .send({ party: 'Nyt Parti' });

        // Assert
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.party, 'Nyt Parti');
        assert.strictEqual(res.body.name, 'Test Person');
    });

    it('create_ugyldigPosition_returnerer400', async () => {
        // Arrange
        const body = { name: 'Test', party: 'Testpartiet', position: 'kokken' };

        // Act
        const res = await request(app).post('/api/persons').send(body);

        // Assert
        assert.strictEqual(res.status, 400);
        assert.ok(res.body.error);
    });

    it('create_ugyldigJson_returnerer400OgInvalidJson', async () => {
        // Arrange
        const brokenJson = '{ikke json';

        // Act
        const res = await request(app)
            .post('/api/persons')
            .set('Content-Type', 'application/json')
            .send(brokenJson);

        // Assert
        assert.strictEqual(res.status, 400);
        assert.strictEqual(res.body.error, 'Invalid JSON');
    });

    it('remove_eksisterendePerson_returnerer200OgFjernerPerson', async () => {
        // Arrange
        const person = await Person.create({
            name: 'Test Person',
            party: 'Testpartiet',
            position: 'minister'
        });

        // Act
        const res = await request(app).delete(`/api/persons/${person._id}`);

        // Assert
        assert.strictEqual(res.status, 200);
        assert.strictEqual(await Person.findById(person._id), null);
    });
});