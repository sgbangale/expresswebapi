var mongoose = require('mongoose');
    
var EntitySchema = mongoose.Schema({
    entity_code: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    entity_name: {
        type: String,
        trim: true
    },
    entity_access: {
        type: [String]
    },
    entity_active:{
        type : Boolean
    }
});


mongoose.model('Entity', EntitySchema);
module.exports = mongoose.model('Entity');