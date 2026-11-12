const Person = require('../models/person');

exports.getAll = async (req, res, next) => {
    try {
        const persons = await Person.find();
        res.status(200).json(persons);
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const person = await Person.findById(req.params.id);
        if (!person) return res.status(404).json({ error: 'Person ikke fundet' });
        res.status(200).json(person);
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const person = await Person.create(req.body);
        res.status(201).json(person);
    } catch (err) {
        next(err);
    }
};

// Update /person/:id
// returnDocument: 'after' og new: true gør præcis det samme, men new:true er deprecated i den nyere version af mongoose som giver en warning i consollen. Derfor brugt vi returnDocument: 'after' i stedet for new:true
exports.update = async (req, res, next) => {
    try {
        const person = await Person.findByIdAndUpdate(req.params.id, req.body, {
            returnDocument: 'after',
            runValidators: true
        });
        if (!person) return res.status(404).json({ error: 'Person ikke fundet' });
        res.status(200).json(person);
    } catch (err) {next(err);}
};

// Delete /person/:id
exports.remove = async (req, res, next) => {
    try {
        const person = await Person.findByIdAndDelete(req.params.id);
        if (!person) return res.status(404).json({ error: 'Person ikke fundet' });
        res.status(200).json(person);
    } catch (err) {next(err);}
};