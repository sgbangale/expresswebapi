// var dotenv = require('dotenv');
// dotenv.load();

var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var accoountRoutes = require('./routes/accountRoute'),
pipelineRoute = require('./routes/pipelineRoute'),
shared = require('../src/common/shared'),
auth = require('../src/middleware/auth');

var app = express();
//mongoose.connect(process.env.mongocs);
mongoose.connect('mongodb://dbuser:dbuser@ds119081.mlab.com:19081/graphql-compose-mongoose');
app.disable('x-powered-by');
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,token");
    next();
  });
  
app.post('/master',shared.initMasterData);
app.get('/master',auth(),shared.prepareMasterData);
app.post('/role', shared.createRole);
app.use('/account', accoountRoutes);
 app.use('/request', pipelineRoute);
app.get('/', function (req, res) {
    res.send('Hello World!');
});

var port =  8080;
ip   =    "0.0.0.0";

app.listen(port, ip,function(){
    console.log('Server running (***) on http://%s:%s', ip, port);
});

