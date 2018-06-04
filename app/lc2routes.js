// app/routes.js

var mongojs = require('mongojs');
module.exports = function (app) {
    
    
    app.post('/SaveLogisticsTwoOrder/:id', ensureAuthorized, function (req, res) {
        //Save in the DB
        var db = mongojs('mongodb://127.0.0.1:27017/AMDS', []);
        db.Consignments.findOne({}, function(err, consigement) {
            var status = '';
            if (consigement.OrderType == 'Custom Product')
            {status= "With Service Centre"}
            else
            {status= "With Customer"}
            db.Consignments.findAndModify({
                query: { _id: mongojs.ObjectId(req.params.id) },
                update: { $set: { status: "With Service Centre", logisticstwodata: req.body } },
                new: true
            }, function (err, doc) {
                if (err) { console.log(" Woops! The error took place here... "); }
                else {
                    var contract = require('../config/contract');
                    contract.saveData(JSON.stringify(doc), doc.address, function (message) {
                        db.close();
                        var resData = { "message": "OK", "address": doc.address, "id": JSON.stringify(doc._id) }
                        res.json(resData);
                    });
                }
            });
        });
        
    });
}


function ensureAuthorized(req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.send(403);
    }
}

