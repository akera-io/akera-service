var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var akera_svc_path = path.join(__dirname, '..', 'bin', 'AkeraService.exe');
var xml = require('xmlbuilder');
var os = require('os');
var utils = require('./utils.js');
var daemonDir = path.join(os.homedir(), '.akera', '.daemon');

function AkeraWindowsService(cfg) {
  if (!cfg || !cfg.name)
    throw new Error('Invalid configuration provided');

  this.config = cfg;
}

AkeraWindowsService.prototype.install = function(cb) {
  cb = cb || function() {
  };
  var self = this;

  try {
    var akeraHome = utils.findOrCreateDirectory(path.join(os.homedir(),
        '.akera'));
    var daemonHome = utils.findOrCreateDirectory(daemonDir);
    if (!akeraHome || !daemonHome)
      return cb(new Error(
          'Could not open path for writing. Please make sure you are logged in as an administrator.'));

    utils.copy(akera_svc_path, path.join(daemonDir, self.config.name + '.exe'),
        function(err) {
          if (err)
            return cb(err);
          var svc_xml = xml.create({
            config : {
              name : self.config.name,
              startup : 'automatic',
              description : self.config.desc,
              startScript : process.execPath,
              startArguments : self.config.script || self.config.start,
              stopScript : process.execPath,
              stopArguments : self.config.stopArguments
            }
          }).end();
          fs.writeFileSync(path.join(daemonDir, self.config.name + '.xml'),
              svc_xml);
          var installer = spawn(
              path.join(daemonDir, self.config.name + '.exe'), [ 'install',
                  '-u', 'LocalSystem' ], {
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
    var uninstaller = spawn(path.join(daemonDir, self.config.name + '.exe'),
        [ 'uninstall' ], {
          stdio : [ process.stdin, process.stdout, process.stderr ]
        });
    uninstaller.on('exit', cb);
  } catch (err) {
    cb(err);
  }
};

module.exports.Service = AkeraWindowsService;