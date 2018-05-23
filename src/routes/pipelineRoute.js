var express = require('express');
var router = express.Router();
var pipeline = require('../models/requestPipeline');
var jwt = require('jsonwebtoken'),
auth = require('../middleware/auth'),
share= require('../common/shared');

router.post('/',auth(), function (req, res) {
    var requestdata ={
        request_type:req.query.request_type,
        request_intiator : req.decoded.User.EmailAddress,
        request_data : req.body.request_data,
        request_api_url : req.originalUrl,
        request_created_date : Date.now(),
        request_status:'CREATED',
        request_callback_url :req.originalUrl,
        request_comments:req.headers['request_comments']
        };
    pipeline.create(requestdata,
        function (err, item) {
            if (err) return res.status(500).send("There was a problem adding the information to the database." + JSON.stringify(err));
            share.pipelineResolver(req,res,item);            
        });
});

router.get('/',auth(), function (req, res) {
    pipeline.find({}, function (e, pipelines) {
        if (e) {
            return res.status(200).send('email address is not found in the system.');
        } else {
            if (pipelines) {
                return res.status(200).send(pipelines);
            }
        }
    });
});

module.exports = router;