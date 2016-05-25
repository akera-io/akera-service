var os = require('os');
var rsvp = require('rsvp');

function Service(config) {
  if (!config)
    throw new Error('No configuration specified');
  if (!config.name || !config.script)
    throw new Error('Invalid configuration speficfied');

  var platform = os.platform();

  var Service;

  switch (platform) {
  case 'darwin':
    Service = require('node-mac').Service;
    break;
  case 'linux':
    Service = require('node-linux').Service;
    break;
  case 'win32':
    Service = require('node-windows').Service;
    break;
  default:
    throw new Error(
        'Your operating system is not supported. Supported platforms are: darwin, linux, win32. Found platform: '
            + platform);
  }

  var svc = new Service(config);
  this._service = svc;
}

Service.prototype.install = function() {
  var self = this;
  var promise = new rsvp.Promise(function(resolve, reject) {
    if (self.installed)
      resolve();
    else {
      var svc = self._service;
      svc.on('install', function() {
        self.installed = true;
        resolve();
      });
      svc.on('aleradyinstalled', function() {
        self.installed = true;
        resolve();
      });
      svc.install();
    }
  });
  return promise;
};

Service.prototype.start = function() {
  var self = this;
  var promise = new rsvp.Promise(function(resolve, reject) {
    if (!self.installed)
      reject(new Error('Service not installed.'));
    else {
      var svc = self._service;
      svc.on('start', function() {
        resolve();
      });
      svc.start();
    }
  });
  return promise;
};

Service.prototype.uninstall = function() {
  var svc = this._service;
  var promise = new rsvp.Promise(function(resolve, reject) {
    svc.on('uninstall', function() {
      resolve();
    });
    svc.uninstall();
  });
  return promise;
};

module.exports = Service;