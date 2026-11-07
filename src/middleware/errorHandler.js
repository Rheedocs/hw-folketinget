// Almindelig fejlhandler med fire parametre
module.exports = (err, req, res, next) => {
    console.error('Fejl:', err.message);
    if (err.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid id' });
    }
    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Noget gik galt på serveren' });
};