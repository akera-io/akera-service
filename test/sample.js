var fs = require('fs');
var path = require('path');

fs.writeFileSync('c:/temp/service.log', JSON.stringify(process.argv));
