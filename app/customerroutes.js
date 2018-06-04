// app/routes.js

var mongojs = require('mongojs');

module.exports = function (app) {
    
    app.get('/GetConsignmentsCustomer/:id', ensureAuthorized, function (req, res) {
        var db = mongojs('mongodb://127.0.0.1:27017/AMDS', []);
        db.Consignments.find({ 'PurchaserName': req.params.id }, function (err, doc) {
            db.close();
            res.json(doc);
        });
    });
    app.post('/SaveOrderC/:id', ensureAuthorized, function (req, res) {
        //Save in the DB
        var db = mongojs('mongodb://127.0.0.1:27017/AMDS', []);
        db.Consignments.findAndModify({
            query: { _id: mongojs.ObjectId(req.params.id) },
            update: { $set: { status: "Order Accepted By Customer" } },
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
