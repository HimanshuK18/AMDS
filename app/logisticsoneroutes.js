// app/routes.js

var mongojs = require('mongojs');

module.exports = function (app) {

    app.get('/GetLogisticsOneList', ensureAuthorized, function (req, res) {
        var db = mongojs('mongodb://127.0.0.1:27017/AMDS', []);
        db.Users.find({ 'usertype': 'Warehouse' }, function (err, docs) {
            db.close();
            res.json(docs);
        });
    });

   

    app.get('/GetConsignmentsLogisticsOne/', ensureAuthorized, function (req, res) {
        var db = mongojs('mongodb://127.0.0.1:27017/AMDS', []);
        db.Consignments.find( function (err, doc) {
            db.close();
            res.json(doc);
        });

    });

    app.post('/SaveLogisticsOneOrder/:id', ensureAuthorized, function (req, res) {
        //Save in the DB
        var db = mongojs('mongodb://127.0.0.1:27017/AMDS', []);
        db.Consignments.findAndModify({
            query: { _id: mongojs.ObjectId(req.params.id) },
            update: { $set: { status: "With Warehouse", logisticsonedata: req.body } },
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

