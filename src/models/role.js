var mongoose = require('mongoose');
    
var RoleSchema = mongoose.Schema({
    roleCode: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    roleName: {
        type: String,
        trim: true
    },
    roleAccess: {
        type: [String]
    },
    roleActive:{
        type : Boolean
    }
});


mongoose.model('Role', RoleSchema);
module.exports = mongoose.model('Role');