const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    name: String
})

UserSchema.virtual('firstName').get(() => {
    return this.name.split(' ')[0];
})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema)