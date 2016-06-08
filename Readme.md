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

  	