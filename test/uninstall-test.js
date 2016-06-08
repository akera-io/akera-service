var svc = require('../lib/service.js');
var path = require('path');
var platform = require('os').platform();

var config = {
   name : 'akera-test',
   start : {
      script : platform === 'win32' ? 'c:/temp/sample.js' : path.join(__dirname, 'sample.js'),
      args : 'toto titi'
   },
   path : 'c:/temp',
   description : 'Akera-admin test service'
};

svc.uninstall(config, function(err) {
   if (err)
      console.log('uninstall error: %s', err.message);
   else
      console.log('service uninstalled');
 });

