const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    position: { type: String, required: true, enum: ['minister', 'formand'] },
    title: { type: String, trim: true },
    startDate: Date
}, { _id: false });

const personSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    party: { type: String, required: true, trim: true },
    roles: {
        type: [roleSchema],
        validate: [(roles) => roles.length > 0, 'A person needs at least one role']
    }
});

module.exports = mongoose.model('Person', personSchema);