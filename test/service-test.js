var Service = require('../lib/service.js');

var config = {
  name : 'akera-admin',
  script : '/home/radu/git/akera-admin/index.js',
  description : 'Akera-admin test service'
};

var svc = new Service(config);

svc.start().then(function() {
  console.log('service started');
}, function(err) {
  console.log(err.message);
});

svc.install().then(function() {
  console.log('service installed');
  return svc.start();
}, function(err) {
  console.log(err);
}).then(function() {
  console.log('service started');
}, function(err) {
  console.log(err);
});