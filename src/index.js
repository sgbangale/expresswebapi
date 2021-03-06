var dotenv = require('dotenv');
dotenv.load();

var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var pm2 = require('pm2');
var accoountRoutes = require('./routes/accountRoute'),
pipelineRoute = require('./routes/pipelineRoute'),
shared = require('../src/common/shared'),
auth = require('../src/middleware/auth');

var app = express();
mongoose.connect(process.env.MONGOCS);

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
    res.send('hellow worldxx');
});


app.get('/x', function (req, res) {
    pm2.restart('src/index.js', function(err, app) {
        if (err) {
          console.error(err);
          return pm2.disconnect();
        }});

    res.send('hellow world');
});




var port =process.env.OPENSHIFT_NODEJS_PORT || 8080;
ip   =  process.env.OPENSHIFT_NODEJS_IP ||  "0.0.0.0";

app.listen(port, ip,function(){
    console.log('env:');
    console.log(process.env.ENVNAME);
    console.log('Server running (***) on http://%s:%s', ip, port);
});

