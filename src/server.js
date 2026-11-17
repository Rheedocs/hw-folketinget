const mongoose = require('mongoose');
const app = require('./app');

const PORT = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/folketingDB')
    .then(() => {
        console.log('MongoDB tilsluttet');
        app.listen(PORT, () => console.log(`Server klar på http://localhost:${PORT}`));
    })
    .catch((err) => console.error('MongoDB fejl:', err.message));