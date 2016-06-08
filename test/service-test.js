var svc = require('../lib/service.js');
var path = require('path');

var config = {
   name : 'akera-admin',
   start : {
      script : 'c:/temp/sample.js',
      args : 'toto titi'
   },
   path : 'c:/temp',
   description : 'Akera-admin test service'
};

svc.install(config, function(err) {
   if (err)
      console.log('install error', err.message);
   else console.log('service installed');
});
