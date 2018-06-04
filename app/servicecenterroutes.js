// app/routes.js

var mongojs = require('mongojs');
module.exports = function (app) {
    app.get('/GetConsignmentsServiceCenter/:id', ensureAuthorized, function (req, res) {
        var db = mongojs('mongodb://127.0.0.1:27017/AMDS', []);
        db.Consignments.find({$and : [{ 'OrderType': 'Custom Product' },{'servicecenter': req.params.id}]}, function (err, doc) {
            db.close();
            res.json(doc);
        });
    });
    app.get('/GetCustomerServiceCenter', ensureAuthorized, function (req, res) {
        var db = mongojs('mongodb://127.0.0.1:27017/AMDS', []);
        db.Users.find({'usertype': 'Customer' }, function (err, docs) {
            db.close();
            res.json(docs);
        });
    });
    
    app.post('/SaveServiceCenter/:id', ensureAuthorized, function (req, res) {
        //Save in the DB
        var db = mongojs('mongodb://127.0.0.1:27017/AMDS', []);
        db.Consignments.findAndModify({
            query: { _id: mongojs.ObjectId(req.params.id) },
            update: { $set: { status: "With Logistics Company 3", servicecenterdata: req.body } },
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
