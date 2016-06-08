var Service = require('../lib/service.js');
var path = require('path');

var config = {
  name : 'test',
  script : path.join(__dirname, 'sample.js'),
  description : 'Akera-service test service'
};

var svc = new Service(config);

svc.install().then(function() {
  console.log('service installed');
  return svc.start();
}).then(function() {
  console.log('service started');
})['catch'](function(err) {
  console.log('start error: ' + err);
});