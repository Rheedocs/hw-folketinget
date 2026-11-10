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