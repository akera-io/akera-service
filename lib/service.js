var os = require('os');
var rsvp = require('rsvp');

function Service(config) {
  if (!config || !config.name)
    throw new Error('Invalid configuration specified');

  var platform = os.platform();

  try {
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
    }
  } catch (err) {
    throw new Error('Error initializing platform specific service: '
        + err.message);
  }

  if (!this.Service)
    throw new Error(
        'Your operating system is not supported. Supported platforms are: darwin, linux, win32. Found platform: '
            + platform);

  this.config = config;
}

Service.prototype.install = function() {
  var self = this;

  return new rsvp.Promise(function(resolve, reject) {

    self._service = self._service || new self.Service(self.config);

    try {

      self._service.on('install', resolve);
      self._service.on('alreadyinstalled', resolve);

      self._service.install();

    } catch (err) {
      reject(new Error('Failed to install service: ' + err.message));
    }
  });

};

Service.prototype.start = function() {
  var self = this;

  return new rsvp.Promise(function(resolve, reject) {

    self._service = self._service || new self.Service(self.config);

    try {

      self._service.on('start', resolve);
      self._service.on('error', reject);
      self._service.start();

    } catch (err) {
      reject(new Error('Failed to start service: ' + err.message));
    }
  });
};

Service.prototype.stop = function() {
  var self = this;

  return new rsvp.Promise(function(resolve, reject) {

    self._service = self._service || new self.Service(self.config);

    try {
      self._service.on('stop', resolve);
      self._service.on('alreadystopped', resolve);

      self._service.stop();
    } catch (err) {
      reject(new Error('Failed to stop service: ' + err.message));
    }
  });
};

Service.prototype.uninstall = function() {
  var self = this;

  return new rsvp.Promise(function(resolve, reject) {

    self._service = self._service || new self.Service(self.config);

    try {
      self._service.on('uninstall', resolve);
      self._service.on('alreadyuninstalled', resolve);

      self._service.uninstall();
    } catch (err) {
      reject(new Error('Failed to uninstall service: ' + err.message));
    }
  });
};

module.exports = Service;