// app/routes.js

var mongojs = require('mongojs');
module.exports = function (app) {
    app.get('/GetConsignmentsWarehouse/:id', ensureAuthorized, function (req, res) {
        var db = mongojs('mongodb://127.0.0.1:27017/AMDS', []);
        db.Consignments.find({ 'warehouse': req.params.id }, function (err, doc) {
            db.close();
            res.json(doc);
        });
    });
    app.get('/GetLogisticsCompany2/', ensureAuthorized, function (req, res) {
        var db = mongojs('mongodb://127.0.0.1:27017/AMDS', []);
        db.Users.find({'usertype': 'Logistics Company 2' }, { fullname: 1, _id: 1, usertype: 1 }, function (err, docs) {
            db.close();
            res.json(docs);
        });
    });
    
    app.post('/SaveWarehouse/:id/:type', ensureAuthorized, function (req, res) {
        //Save in the DB
        var status = '';
        if (req.params.type == 'Standard Product'){status = 'With Logistics Company 3'}
        else {status = 'With Logistics Company 2'}
        var db = mongojs('mongodb://127.0.0.1:27017/AMDS', []);
        db.Consignments.findAndModify({
            query: { _id: mongojs.ObjectId(req.params.id) },
            update: { $set: { status: status, warehousedata: req.body } },
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
