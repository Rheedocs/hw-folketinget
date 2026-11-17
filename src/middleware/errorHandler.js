// Almindelig fejlhandler med fire parametre
module.exports = (err, req, res, next) => {
    console.error('Fejl:', err.message);
    if (err.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid id' });
    }
    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message });
    }
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Invalid JSON' });
    }
    if (err.status === 409) {
        return res.status(409).json({ error: err.message });
    }
    res.status(500).json({ error: 'Something went wrong on the server' });
};