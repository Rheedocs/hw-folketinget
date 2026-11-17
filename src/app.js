const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');
const personRoutes = require('./routes/personRoutes');

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use('/api/persons', personRoutes);

// TODO: routes tilføjes i næste trin

app.use((req, res) => res.status(404).json({ error: 'Endpoint not found' }));

app.use(errorHandler);

mongoose.connect('mongodb://127.0.0.1:27017/folketingDB')
    .then(() => {
        console.log('MongoDB tilsluttet');
        app.listen(3000, () => console.log('Server klar på http://localhost:3000'));
    })
    .catch((err) => console.error('MongoDB fejl:', err.message));