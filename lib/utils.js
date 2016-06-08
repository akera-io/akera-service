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