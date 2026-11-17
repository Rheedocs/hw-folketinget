const express = require('express');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');
const personRoutes = require('./routes/personRoutes');

const app = express();

if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
}
app.use(express.json());
app.use('/api/persons', personRoutes);

app.use((req, res) => res.status(404).json({ error: 'Endpoint not found' }));

app.use(errorHandler);

module.exports = app;