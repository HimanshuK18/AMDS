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
    app.get('/GetConsignmentO/:address', ensureAuthorized, function (req, res) {
        //get if from the BlockChain
        address = req.params.address;
        var contract = require('../config/contract');
        contract.getMillData (address, function (data) {
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
 
    app.post('/SaveOrderOrder/', ensureAuthorized, function (req, res) {
        //Save in the DB
        var db = mongojs('mongodb://127.0.0.1:27017/AMDS', ['Consignments']);
        req.body.status = "With Mill";
        db.Consignments.insert(req.body, function (err, doc) {
            if (doc) {
                //save in the BlockChain
                var contract = require('../config/contract');
                contract.PublishDataContract(JSON.stringify(doc), function (message, address) {
                    if (message == 'ok') {
                        db.Consignments.findAndModify(
                            {
                                query: { _id: mongojs.ObjectId(doc._id) },
                                update: { $set: { address: address } },
                                new: true
                            }, function (err, doc) {
                                if (err) { console.log(" Woops! The error took place here... "); }
                                else {
                                    db.close();
                                    var resData = { "message": "OK", "address": address, "id": JSON.stringify(doc._id) }
                                    res.json(resData);
                                }
                            });
                    }
                });
            }
        });
    });

    app.get('/GetOrderNumber/', ensureAuthorized, function (req, res) {
        var db = mongojs('mongodb://127.0.0.1:27017/AMDS', []);
        db.Consignments.count(function (err, count) {
            const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
            var d = new Date();
            var countO = GetCount(count + 1);
            var Odata = {'orderid': "AMFP-LUX-" + d.getFullYear() + "-" + monthNames[d.getMonth()] + "-" + countO};
            db.close();
            res.json(Odata);
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

function GetCount(count)
{
    var o = "";
if (count / 10 > 0 && count / 10 < 1) { 
    o = "00" + count.toString(); 
    return o; }
if (count / 10 < 10 && count / 10 > 1) {
    o = "0" + count.toString(); 
    return o;}
if (count / 10 >= 10) {
    o = count.toString();
    return o;}
}