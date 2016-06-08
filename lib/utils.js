<<<<<<< HEAD
'use strict';

var exports = module.exports = {};

var fs = require('fs');

exports.copyFile = function(source, target, cb) {

   var fdSrc = fs.openSync(source, 'r');
   var fdDest = fs.openSync(target, 'w');

   var readChunk = function(fdSrc, fdDest, cb) {
      var buf = new Buffer(64 * 1024);

      fs.read(fdSrc, buf, 0, buf.length, null, function(err, bytesRead, buffer) {
         if (err || bytesRead === 0) {
            fs.closeSync(fdSrc);
            fs.closeSync(fdDest);
            if (cb)
               return cb(err);
         } else {
            fs.writeSync(fdDest, buffer, 0, bytesRead);
            readChunk(fdSrc, fdDest, cb);
         }
      });
   };

   readChunk(fdSrc, fdDest, cb);

}
=======
var fs = require('fs');

module.exports = {
  findOrCreateDirectory : function(location) {
    try {
      if (!fs.existsSync(location))
        fs.mkdirSync(location);
      return true;
    } catch (e) {
      return false;
    }
  },
  copy : function(source, target, cb) {
    cb = cb || function() {
    };
    var chunkSize = 64 * 1024;
    var bufSize = 64 * 1024;
    var bufPos = 0;
    var buf = new Buffer(bufSize);
    var ws = fs.createWriteStream(target);
    fs.createReadStream(source, {
      'flags' : 'r',
      'encoding' : 'binary',
      'mode' : 0666,
      'bufferSize' : chunkSize
    }).addListener('data', function(chunk) {
      var bufNextPos = bufPos + chunk.length;
      if (bufNextPos == bufSize) {
        buf.write(chunk, bufPos, 'binary');
        ws.write(buf);
        bufPos = 0;
      } else {
        buf.write(chunk, bufPos, 'binary');
        bufPos = bufNextPos;
      }
    }).addListener('close', function() {
      if (bufPos != 0) {
        ws.write(buf.slice(0, bufPos));
        ws.end();
      } else {
        ws.close();
      }
      ws.on('close', cb);
    });
  }
};
>>>>>>> branch 'master' of http://10.10.10.5:9000/scm/git/akera/akera-service
