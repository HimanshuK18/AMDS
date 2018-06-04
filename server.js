// Required Modules
var express    = require("express");
var morgan     = require("morgan");
var bodyParser = require("body-parser");
var contract = require("./config/contract")

var app        = express();
var port = process.env.PORT || 6800;

app.use(express.static(__dirname + '/public')); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require('./app/routes')(app);
require('./app/millroutes')(app);
require('./app/lc2routes')(app);
require('./app/warehouseroutes')(app);
require('./app/logisticsoneroutes')(app);
require('./app/servicecenterroutes')(app);
require('./app/logisticsthreeroutes')(app);
require('./app/orderroutes')(app);
require('./app/customerroutes')(app);


app.use(morgan("dev"));
//error hadler
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});
process.on('uncaughtException', function(err) {
    console.log(err);
});

// Start Server
app.listen(port, function () {
    console.log( "Express server listening on port " + port);
}); 