const mongoose = require('mongoose');
const client = require('../clients/folketingClient');
const { syncParties } = require('../services/syncService');

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/folketingDB');

    const result = await syncParties(client);
    console.log(`${result.updated} partier opdateret, ${result.notFound} ikke fundet`);
    if (result.changes.length > 0) {
        console.table(result.changes);
    }

    await mongoose.disconnect();
}

main().catch((err) => {
    console.error('Fejl:', err.message);
    process.exit(1);
});