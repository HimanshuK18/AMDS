// app/routes.js

var mongojs = require('mongojs');

module.exports = function (app) {

    app.get('/GetCustomersList/', ensureAuthorized, function (req, res) {
        var db = mongojs('mongodb://127.0.0.1:27017/AMDS', []);
        db.Users.find({ $or: [{ 'usertype': 'Customer' }, { 'usertype': 'Service Center' }, { 'usertype': 'Warehouse' }] }, { fullname: 1, _id: 1, usertype: 1 }, function (err, docs) {
            db.close();
            res.json(docs);
        });
    });
    app.get('/GetConsignmentsMill/', ensureAuthorized, function (req, res) {
        var db = mongojs('mongodb://127.0.0.1:27017/AMDS', []);
        db.Consignments.find(function (err, doc) {
            db.close();
            res.json(doc);
        });
    });

    app.get('/GetConsignmentMill/:address', ensureAuthorized, function (req, res) {
        //get if from the BlockChain
        address = req.params.address;
        var contract = require('../config/contract');
        contract.getData (address, function (data) {
            var dataJ = JSON.parse(data);
            dataJ["Address"] = address;
            var db = mongojs('mongodb://127.0.0.1:27017/AMDS', []);
            db.Users.find({ $or: [{ _id: mongojs.ObjectId(dataJ.PurchaserName) }, { _id: mongojs.ObjectId(dataJ.warehouse) }, { _id: mongojs.ObjectId(dataJ.servicecenter) }] }, { fullname: 1, usertype: 1 }, function (err, docs) {
                db.close();
                for (let i = 0; i <= docs.length - 1; i++) {
                    if (docs[i].usertype == 'Customer') {
                        dataJ["PurchaserName"] = docs[i].fullname;
                    }
                    if (docs[i].usertype == 'Service Center') {
                        dataJ["servicecenter"] = docs[i].fullname;
                    }
                    if (docs[i].usertype == 'Warehouse') {
                        dataJ["warehousedetails"] = docs[i].fullname;
                    }
                }
                res.json(dataJ);
            });
        });
    });
    app.post('/SaveOrder/', ensureAuthorized, function (req, res) {
        //Save in the DB
        var db = mongojs('mongodb://127.0.0.1:27017/AMDS', ['Consignments']);
        req.body.status = "With Logistics Company 1";
        db.Consignments.findAndModify(
            {
                query: { _id: mongojs.ObjectId(req.body.id) },
                update: {
                    $set: {
                        productspecification: req.body.productspecification,
                        millteatreportnumber: req.body.millteatreportnumber,
                        heatnumber: req.body.heatnumber,
                        weight: req.body.weight,
                        productidmill: req.body.productidmill,
                        status: req.body.status
                    }
                },
                new: true
            }, function (err, doc) {
                if (doc) {
                    //save in the BlockChain
                    var contract = require('../config/contract');
                    contract.saveData(JSON.stringify(doc),doc.address, function (message, address) {
                        if (message == 'ok') {
                            db.close();
                            var resData = { "message": "OK" }
                            res.json(resData);
                        }
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

