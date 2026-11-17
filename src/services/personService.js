const Person = require('../models/person');

const conflict = (message) => {
    const err = new Error(message);
    err.status = 409;
    return err;
};

// Regel: to personer må ikke have samme navn, fordi navnet bruges som nøgle i synkroniseringen.
// ignoreId bruges ved opdatering, så en person ikke støder ind i sig selv.
const ensureNameIsFree = async (name, ignoreId) => {
    if (typeof name !== 'string' || name.trim() === '') return;

    const filter = { name: name.trim() };
    if (ignoreId) filter._id = { $ne: ignoreId };

    if (await Person.findOne(filter)) {
        throw conflict('A person with this name already exists');
    }
};

exports.getAll = () => Person.find();

exports.getById = (id) => Person.findById(id);

exports.create = async (data) => {
    await ensureNameIsFree(data?.name);
    return Person.create(data);
};

// returnDocument: 'after' giver det opdaterede dokument tilbage (new: true er deprecated)
exports.update = async (id, data) => {
    await ensureNameIsFree(data?.name, id);
    return Person.findByIdAndUpdate(id, data, {
        returnDocument: 'after',
        runValidators: true
    });
};

exports.remove = (id) => Person.findByIdAndDelete(id);