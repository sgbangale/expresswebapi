var mongoose = require('mongoose'),
    bcrypt = require('bcrypt');
var RequestPipelineSchema = mongoose.Schema({
    request_type: {
        type: String,
        lowercase: true,
        trim: true,
        required: true
    },
    request_intiator: {
        type: String,
        lowercase: true,
        trim: true
    },
    request_data: {
        type: Object

    },
    request_api_url: {
        type: String
    },
    request_created_date: {
        type: Date
    },
    request_completion_date: {
        type: Date
    },
    request_status: {
        type: String
    },
    request_callback_url: {
        type: String
    },
    request_output_data: {
        type: Object
    },
    request_comments: {
        type: String
    }
});

mongoose.model('RequestPipeline', RequestPipelineSchema);
module.exports = mongoose.model('RequestPipeline');