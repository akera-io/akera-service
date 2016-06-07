var Service = require('../lib/service.js');
var path = require('path');

var config = {
  name : 'akera admin',
  script : path.resolve(__dirname, 'sample.js'),
  description : 'Akera-admin test service'
};

var svc = new Service(config);

//svc.start().then(function() {
//  console.log('service started');
//}, function(err) {
//  console.log('start error: ' + err);
//});

svc.uninstall().then(function() {
   console.log('service uninstalled');
 }, function(err) {
   console.log('uninstall error: ' + err);
 });

//svc.install().then(function() {
//  console.log('service installed');
//  return svc.start();
//}).then(function() {
//  console.log('service started');
//})['catch'](function(err) {
//  console.log('start error: ' + err);
//});