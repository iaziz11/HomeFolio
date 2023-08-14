const mongoose = require('mongoose');

module.exports.initializeMongooseConnection = (DbUrl) => {
    mongoose.connect(DbUrl);
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', () => {
        console.log('Database Connected');
    });
}
