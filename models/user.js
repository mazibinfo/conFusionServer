const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passprtLocalMongoose = require('passport-local-mongoose');

const User = new Schema ({
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    admin: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
});

User.plugin(passprtLocalMongoose);

module.exports = mongoose.model('User', User);