[![Akera Logo](http://akera.io/logo.png)](http://akera.io/)

  Akera service/daemon module.

## Installation

```bash
$ npm set registry "http://repository.akera.io/"
$ npm install akera-service
```

## Docs

  * [Website and Documentation](http://akera.io/)


## Tests

  To run the test suite, first install the dependencies, then run `npm test`.

## Quick Start

  While in Unix having a daemon program ran as a service - automatically start when the
  server starts, is not a difficult task for Windows OS that requires a few more hops
  therefore the akera-service module was added.
  
  This can also be used separately although it's main purpose is to be used in akera.io
  servers - the application server, the web service and also the newly added administration 
  service can all be installed as a `service` now.
  
  With this one can basically start any node.js daemon as a service using a simple configuration:
	- name: the service name is mandatory, this is how the service will be shown in the services list.
	- description: optional service description.
	- start: this can be only the start-up script full path if no additional arguments are needed.
  		- script: the full path of the start-up script.
  		- args: if additional arguments need to be passed to the start-up script.
	- stop: this is optional, only if the service need to be nicely closed through a shutdown script - it 
	can be only the shutdown script full path if no additional arguments are needed.
  		- script: the full path of the shutdown script.
  		- args: if additional arguments need to be passed to the shutdown script.
	 
```javascript

var svc = require('akera-service');

var config = {
   name : 'akera sample',
   start : {
      script : 'c:/temp/service.js',
      args : 'start'
   },
   stop : {
      script : 'c:/temp/service.js',
      args : 'stop'
   },
   path : 'c:/temp',
   description : 'Akera sample service'
};

svc.install(config, function(err) {
   if (err)
      console.log('install error', err.message);
   else 
      console.log('service installed');
});

```

## License

	Copyright (c) 2015 ACORN IT, Romania - All rights reserved

	This Software is protected by copyright law and international treaties. This Software is licensed (not sold), 
	and its use is subject to a valid WRITTEN AND SIGNED License Agreement. The unauthorized use, copying or 
	distribution of this Software may result in severe criminal or civil penalties, and will be prosecuted to the 
	maximum extent allowed by law. 

  	