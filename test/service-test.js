var svc = require('../lib/service.js');
var path = require('path');

var config = {
<<<<<<< HEAD
   name : 'akera-admin',
   start : {
      script : 'c:/temp/sample.js',
      args : 'toto titi'
   },
   path : 'c:/temp',
   description : 'Akera-admin test service'
=======
  name : 'test',
  script : path.join(__dirname, 'sample.js'),
  description : 'akera-service test'
>>>>>>> branch 'master' of http://10.10.10.5:9000/scm/git/akera/akera-service
};

<<<<<<< HEAD
svc.install(config, function(err) {
   if (err)
      console.log('install error', err.message);
   else console.log('service installed');
});
=======
var svc = new Service(config);

svc.install().then(function() {
  console.log('test service installed');
  return svc.uninstall();
}).then(function() {
  console.log('test service uninstalled');
})['catch'](function(err) {
  console.log(err);
});
>>>>>>> branch 'master' of http://10.10.10.5:9000/scm/git/akera/akera-service
