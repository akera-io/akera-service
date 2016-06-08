<<<<<<< HEAD
'use strict';
=======
var os = require('os');
var rsvp = require('rsvp');
>>>>>>> branch 'master' of http://10.10.10.5:9000/scm/git/akera/akera-service

<<<<<<< HEAD
var exports = module.exports = {};
=======
function Service(config) {
  if (!config || !config.name)
    throw new Error('Invalid configuration specified');
>>>>>>> branch 'master' of http://10.10.10.5:9000/scm/git/akera/akera-service

<<<<<<< HEAD
var getHandler = function() {
   switch (process.platform) {
      case 'darwin':
         break;
      case 'linux':
         break;
      case 'win32':
         return require('./akera-windows-service.js');
   }

   throw new Error('Platform not supported.');
}

exports.install = function(config, cb) {
   try {
      getHandler().install(config, cb);
   } catch (err) {
      if (typeof cb === 'function')
         return cb(err);
      throw err;
   }
};
=======
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
      this.Service = require('./akera-windows-service.js').Service;
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

      if (os.platform() !== 'win32') {
        self._service.on('install', resolve);
        self._service.on('alreadyinstalled', resolve);
        self._service.on('error', reject);
      }
      
      self._service.install(function(err) {
        if (err)
          reject(err);
        else resolve();
      });
>>>>>>> branch 'master' of http://10.10.10.5:9000/scm/git/akera/akera-service

<<<<<<< HEAD
exports.uninstall = function(config, cb) {
   try {
      getHandler().uninstall(config, cb);
   } catch (err) {
      if (typeof cb === 'function')
         return cb(err);
      throw err;
   }
};
=======
    } catch (err) {
      reject(new Error('Failed to install service: ' + err.message));
    }
  });

};

Service.prototype.uninstall = function() {
  var self = this;

  return new rsvp.Promise(function(resolve, reject) {

    self._service = self._service || new self.Service(self.config);

    try {
      if (os.platform() !== 'win32') {
        self._service.on('uninstall', resolve);
        self._service.on('alreadyuninstalled', resolve);
        self._service.on('error', reject);
      }
      self._service.uninstall(function(err) {
        if (err)
          reject(err);
        else resolve(err);
      });
    } catch (err) {
      reject(new Error('Failed to uninstall service: ' + err.message));
    }
  });
};

module.exports = Service;
>>>>>>> branch 'master' of http://10.10.10.5:9000/scm/git/akera/akera-service
