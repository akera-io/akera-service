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
  var script = this.config.script;
  var self = this;

  try {
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
          stopScript : self.config.stopScript,
          stopArguments : self.config.stopArguments
        }
      }).end();
      console.log(svc_xml);
      fs
          .writeFileSync(path.join(path.dirname(script), 'daemon', name
              + '.xml'));
      var installer = spawn(path.join(path.dirname(script), 'daemon', name
          + '.xml'), [ 'install' ]);
      installer.on('exit', cb);
     // cb();
    });
  } catch (err) {
    cb(err);
  }
};

AkeraWindowsService.prototype.uninstall = function(cb) {
  cb = cb || function(){};
  var self = this;
  try {
    var uninstaller = spawn(path.join(path.basedir(self.config.script), 'daemon', name + '.exe', ['uninstall']));
    uninstaller.on('exit', cb);
  } catch(err) {
    cb(err);
  }
};

function copyFile(source, target, cb) {

  return cb();
  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on("error", function(err) {
    done(err);
  });
  var wr = fs.createWriteStream(target);
  wr.on("error", function(err) {
    done(err);
  });
  wr.on("close", function(ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled && cb) {
      cb(err);
      cbCalled = true;
    }
  }
}

module.exports = AkeraWindowsService;