// app/routes.js
var mongojs = require('mongojs');


module.exports = function (app) {
    app.post('/authenticate', function (request, response) {
        var db = mongojs('mongodb://127.0.0.1:27017/AMDS', ['Users']);
        db.Users.findOne({ EMailID: request.body.emailid}, function (err, doc) {
            if (doc != null) {
                if (doc.EMailID == request.body.emailid && doc.password == request.body.password) {
                    //Create token and login the user
                    var jwt = require("jsonwebtoken");
                    var NewUser = {
                        id: JSON.stringify(doc._id).replace(/"/g, ""),
                        fullname: doc.fullname,
                        email: doc.EMailID,
                        UserType: doc.usertype,
                        blockchainaccount: doc.blockchainaccount,
                        token: null
                    }
    
                    NewUser.token = jwt.sign(NewUser, NewUser.email, { expiresIn: 60 * 60 });
                    response.json({
                        type: true,
                        data: NewUser,
                        token: NewUser.token
                    });
                }
                else { response.json({ "message": "Not Ok" }); }
            }
            else { response.json({ "message": "Not Ok" }); }
        });
    });

    app.post('/signin', function (req, res) {
        User.findOne({ email: req.body.email, password: req.body.password }, function (err, user) {
            if (err) {
                res.json({
                    type: false,
                    data: "Error occured: " + err
                });
            } else {
                if (user) {
                    res.json({
                        type: false,
                        data: "User already exists!"
                    });
                } else {
                    var userModel = new User();
                    userModel.email = req.body.email;
                    userModel.password = req.body.password;
                    userModel.save(function (err, user) {
                        user.token = jwt.sign(user, process.env.JWT_SECRET);
                        user.save(function (err, user1) {
                            res.json({
                                type: true,
                                data: user1,
                                token: user1.token
                            });
                        });
                    })
                }
            }
        });
    });


};

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