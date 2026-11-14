const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    party: { type: String, required: true, trim: true },
    position: { type: String, required: true, enum: ['minister', 'formand'] },
    title: { type: String, trim: true },
    startDate: Date
});

module.exports = mongoose.model('Person', personSchema);