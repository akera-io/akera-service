var os = require('os');
var rsvp = require('rsvp');

function Service(config) {
  if (!config || !config.name)
    throw new Error('Invalid configuration specified');

  var platform = os.platform();

  switch (platform) {
  case 'darwin':
    this.Service = require('node-mac').Service;
    break;
  case 'linux':
    this.Service = require('node-linux').Service;
    break;
  case 'win32':
    this.Service = require('node-windows').Service;
    break;
  default:
    throw new Error(
        'Your operating system is not supported. Supported platforms are: darwin, linux, win32. Found platform: '
            + platform);
  }

  this.config = config;
}

Service.prototype.install = function() {
  var self = this;

  return new rsvp.Promise(function(resolve, reject) {
    if (self.installed === true)
      resolve();
    else {
      if (!self.config || !self.config.script)
        reject(new Error('Missing service startup script.'));
      else {
        try {
          var svc = new self.Service(self.config);

          svc.on('install', function() {
            self._service = svc;
            self.installed = true;
            resolve();
          });

          svc.on('alreadyinstalled', function() {
            self._service = svc;
            self.installed = true;
            resolve();
          });
          
          svc.install();
          
        } catch (err) {
          reject(err);
        }
      }
    }
  });

};

Service.prototype.start = function() {
  var self = this;

  return new rsvp.Promise(function(resolve, reject) {
    if (!self.installed)
      reject(new Error('Service not installed.'));
    else {
      try {
        var svc = self._service;
        try {
        svc.on('start', function() {
          resolve();
        });
        } catch(e) {
          reject(new Error('Service is not installed')); 
        }

        svc.start();

      } catch (err) {
        reject(err);
      }
    }
  });
};

Service.prototype.uninstall = function() {
  var self = this;

  return new rsvp.Promise(function(resolve, reject) {

    var svc = self._service;

    if (!svc) {
      if (!self.config || !self.config.name)
        reject(new Error('Invalid service configuration.'));
      else
        svc = new self.Service(self.config);
    }

    try {
      svc.on('uninstall', function() {
        resolve();
      });

      svc.uninstall();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = Service;