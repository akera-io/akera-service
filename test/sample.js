var fs = require('fs');
var path = require('path');
var logPath = require('os').platform() === 'win32' ? 'c:/temp/service.log' :  path.join(__dirname, 'service.log');

fs.writeFileSync(logPath, JSON.stringify(process.argv));
