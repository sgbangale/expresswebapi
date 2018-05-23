var mongoose = require('mongoose'),
    bcrypt = require('bcrypt');
var UserSchema = mongoose.Schema({
    emailAddress: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    role: {
        type: String,
        required: true
    }
});

UserSchema.pre('save', function (next) {
    var user = this;

    bcrypt.hash(user.password, 10).then(function (hash) {
        user.password = hash;
        next();
    });
});

UserSchema.methods.comparePassword = function (attemptedPassword, callback) {
    bcrypt.compare(attemptedPassword, this.password, function (err, isMatch) {
        if(err) 
        isMatch =false;
        callback(isMatch);
    });
};

mongoose.model('User', UserSchema);
module.exports = mongoose.model('User');