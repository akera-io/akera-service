var Service = require('../lib/service.js');
var path = require('path');

var config = {
  name : 'test',
  script : path.join(__dirname, 'sample.js'),
  description : 'akera-service test'
};

var svc = new Service(config);

svc.install().then(function() {
  console.log('test service installed');
  return svc.uninstall();
}).then(function() {
  console.log('test service uninstalled');
})['catch'](function(err) {
  console.log(err);
});