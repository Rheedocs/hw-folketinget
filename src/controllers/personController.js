const personService = require('../services/personService');

exports.getAll = async (req, res, next) => {
    try {
        const persons = await personService.getAll();
        res.status(200).json(persons);
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const person = await personService.getById(req.params.id);
        if (!person) return res.status(404).json({ error: 'Person not found' });
        res.status(200).json(person);
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const person = await personService.create(req.body);
        res.status(201).json(person);
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const person = await personService.update(req.params.id, req.body);
        if (!person) return res.status(404).json({ error: 'Person not found' });
        res.status(200).json(person);
    } catch (err) {
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const person = await personService.remove(req.params.id);
        if (!person) return res.status(404).json({ error: 'Person not found' });
        res.status(200).json(person);
    } catch (err) {
        next(err);
    }
};