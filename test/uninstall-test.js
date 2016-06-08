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

svc.uninstall(config, function(err) {
   if (err)
      console.log('uninstall error', err.message);
   else
      console.log('service uninstalled');
 });

