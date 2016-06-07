var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var akera_svc_path = path.join(__dirname, '..', 'bin', 'AkeraService.exe');
var xml = require('xmlbuilder');

function AkeraWindowsService(cfg) {
  if (!cfg || !cfg.name)
    throw new Error('Invalid configuration provided');

  this.config = cfg;
}

AkeraWindowsService.prototype.install = function(cb) {
  cb = cb || function() {
  };
  var name = this.config.name;
  var script = this.config.script || this.config.start;
  var self = this;

  try {
    if (!fs.existsSync(path.join(path.dirname(script), 'daemon')))
      fs.mkdirSync(path.join(path.dirname(script), 'daemon'));

    copyFile(akera_svc_path, path.join(path.dirname(script), 'daemon', name
        + '.exe'), function(err) {
      if (err)
        return cb(err);
      var svc_xml = xml.create({
        config : {
          name : name,
          startup : 'automatic',
          description : self.config.desc,
          startScript : process.execPath,
          startArguments : script,
          stopScript : process.execPath,
          stopArguments : self.config.stopArguments
        }
      }).end();
      fs.writeFileSync(
          path.join(path.dirname(script), 'daemon', name + '.xml'), svc_xml);
      var installer = spawn(path.join(path.dirname(script), 'daemon', name
          + '.exe'), [ 'install', '-u', 'LocalSystem' ], {
        stdio : [ process.stdin, process.stdout, process.stderr ]
      });
      installer.on('exit', cb);
    });
  } catch (err) {
    cb(err);
  }
};

AkeraWindowsService.prototype.uninstall = function(cb) {
  cb = cb || function() {
  };
  var self = this;
  try {
    var uninstaller = spawn(path.join(path.dirname(self.config.script),
        'daemon', self.config.name + '.exe'), [ 'uninstall' ], {
      stdio : [ process.stdin, process.stdout, process.stderr ]
    });
    uninstaller.on('exit', cb);
  } catch (err) {
    cb(err);
  }
};

function copyFile(source, target, cb) {
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
  }).addListener("data", function(chunk) {
    var bufNextPos = bufPos + chunk.length;
    if (bufNextPos == bufSize) {
      buf.write(chunk, bufPos, 'binary');
      ws.write(buf);
      bufPos = 0;
    } else {
      buf.write(chunk, bufPos, 'binary');
      bufPos = bufNextPos;
    }
  }).addListener("close", function() {
    if (bufPos != 0) {
      ws.write(buf.slice(0, bufPos));
      ws.end();
    } else {
      ws.close();
    }
    ws.on('close', cb);
  });
}
module.exports = AkeraWindowsService;