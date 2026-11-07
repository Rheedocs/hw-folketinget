const Person = require('../models/person');

// TODO (Mattias): hent alle med Person.find(). Svar 200. Fejl: next(err)
exports.getAll = async (req, res, next) => {
    res.status(501).json({ error: 'Ikke implementeret endnu' });
};

// TODO (Mattias): hent én med Person.findById. 404 hvis den ikke findes. Fejl: next(err)
exports.getById = async (req, res, next) => {
    res.status(501).json({ error: 'Ikke implementeret endnu' });
};

// TODO (Mattias): opret med Person.create(req.body). Svar 201. Fejl: next(err)
exports.create = async (req, res, next) => {
    res.status(501).json({ error: 'Ikke implementeret endnu' });
};

// TODO (Gon): opdater med findByIdAndUpdate, brug { new: true, runValidators: true }. 404 hvis den ikke findes
exports.update = async (req, res, next) => {
    res.status(501).json({ error: 'Ikke implementeret endnu' });
};

// TODO (Gon): slet med findByIdAndDelete. 404 hvis den ikke findes
exports.remove = async (req, res, next) => {
    res.status(501).json({ error: 'Ikke implementeret endnu' });
};