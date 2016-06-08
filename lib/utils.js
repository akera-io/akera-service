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
