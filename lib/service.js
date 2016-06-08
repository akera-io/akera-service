'use strict';

var exports = module.exports = {};

var getHandler = function() {
   switch (process.platform) {
      case 'darwin':
         break;
      case 'linux':
         return require('./akera-linux-service.js');
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

exports.uninstall = function(config, cb) {
   try {
      getHandler().uninstall(config, cb);
   } catch (err) {
      if (typeof cb === 'function')
         return cb(err);
      throw err;
   }
};
