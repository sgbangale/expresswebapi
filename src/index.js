var dotenv = require('dotenv');
dotenv.load();

var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var accoountRoutes = require('./routes/accountRoute'),
pipelineRoute = require('./routes/pipelineRoute'),
shared = require('../src/common/shared'),
auth = require('../src/middleware/auth');

var app = express();
mongoose.connect(process.env.mongocs);
app.disable('x-powered-by');
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.post('/master',shared.initMasterData);
app.get('/master',auth(),shared.prepareMasterData);
app.post('/role', shared.createRole);
app.use('/account', accoountRoutes);
 app.use('/request', pipelineRoute);
app.get('/', function (req, res) {
    res.send('Hello World!');
});


app.listen(process.env.PORT, function () {
    console.log('Example app listening on port ' + process.env.PORT + '!')
});