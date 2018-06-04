var crypto = require('crypto');
var fs = require('fs');

function GetHASHforString(value) {
    var sha256HASH = crypto.createHash('sha256').update(value).digest("hex");
    return sha256HASH;
}

function GetHASHforFile(FilePath) {
    //Get hash code for a file
    var algo = 'sha256';
    var shasum = crypto.createHash(algo);
    var s = fs.ReadStream(FilePath);
    s.on('data', function (d) { shasum.update(d); });
    s.on('end', function () {
        var d = shasum.digest('hex');
        return d;
    });
}

function generateFileHash(FilePath, callback) {
    var algorithm = 'sha256';
    var shaAlgo = crypto.createHash('sha256');
    var stream = fs.ReadStream(FilePath);
    stream.on('data', function (d) { shaAlgo.update(d); });
    stream.on('end', function () {
        var d = shaAlgo.digest('hex');
        callback(d);
    });
}

exports.GetHASHforFile = GetHASHforFile;
exports.GetHASHforString = GetHASHforString;
exports.generateFileHash = generateFileHash;


