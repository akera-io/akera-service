'use strict';

var Service = require('node-linux').Service;

exports.install = function(config, cb) {
  config.script = config.script || config.start && config.start.script;
  var svc = new Service(config);
  svc.on('alreadyinstalled', function() {
    cb(new Error('Service is already installed'));
  }); 
  svc.on('error', function(err) {
    var unknown = 'unknown error';
    cb(new Error(err ? (err.message || unknown) : unknown));
  });
  svc.on('install', cb);
  
  svc.install();
};

exports.uninstall = function(config, cb) {
  config.script = config.script || config.start && config.start.script;
  var svc = new Service(config);
  svc.on('doesnotexist', function() {
    cb(new Error('Service does not exist'));
  });
  svc.on('invalidinstallation', function() {
    cb(new Error('Invalid service installation'));
  });
  svc.on('uninstall', cb);
  
  svc.uninstall();
};