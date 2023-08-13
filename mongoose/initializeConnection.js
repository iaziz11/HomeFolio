if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const mongoose = require('mongoose');
const DbUrl = process.env.DB_URL;

module.exports.initializeMongooseConnection = () => {
    mongoose.connect(DbUrl);
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', () => {
        console.log('Database Connected');
    });
}
