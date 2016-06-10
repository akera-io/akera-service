'use strict';

var exports = module.exports = {};

var fs = require('fs');
var path = require('path');
var utils = require('./utils.js');
var xml = require('xmlbuilder');
var spawn = require('child_process').spawn;

var getDaemonFolder = function(config, script) {

   script = script || (config.start ? config.start.script || config.start : config.script);
   var daemonFolder = config.path || path.dirname(script);

   return path.join(daemonFolder.indexOf('"') !== -1 ? daemonFolder.substr(1) : daemonFolder,
      'daemon');
};

var callOrThrow = function(err, cb) {
   if (cb)
      return cb(err);

   throw err;
};

exports.install = function(config, cb) {
   if (!config || !config.name || (!config.start && !config.script))
      return callOrThrow(new Error('Invalid configuration provided'), cb);

   var name = config.name;
   var startScript = config.start ? config.start.script || config.start : config.script;
   var stopScript = config.stop && config.stop.script ? config.stop.script : config.stop;

   var akera_svc_path = path.join(__dirname, '..', 'bin', 'AkeraService.exe');
   var daemonFolder = getDaemonFolder(config, startScript);
   var daemonFile = path.join(daemonFolder, name.replace(/ /g, '-') + '.exe');

   if (fs.existsSync(daemonFile))
      return callOrThrow(new Error('Service executable already exists: ' + daemonFile), cb);

   try {
      if (!fs.existsSync(daemonFolder))
         fs.mkdirSync(daemonFolder);

      cb = cb || function() {
      };

      utils.copyFile(akera_svc_path, daemonFile, function(err) {
         if (err)
            return cb(err);

         try {
            startScript = '"' + startScript + '"';
            
            if (stopScript)
               stopScript = '"' + stopScript + '"';
            
            var svc_xml = xml.create(
               {
                  config : {
                     name : name,
                     startup : 'automatic',
                     description : config.desc || config.description,
                     startScript : process.execPath,
                     startArguments : config.start && config.start.args ? startScript + ' '
                        + config.start.args : startScript,
                     stopScript : stopScript ? process.execPath : null,
                     stopArguments : stopScript && config.stop.args ? stopScript + ' '
                        + config.stop.args : stopScript
                  }
               }).end();

            fs.writeFileSync(daemonFile + '.xml', svc_xml);

            var installer = spawn(daemonFile, [ 'install', '-u', 'LocalSystem' ], {
               stdio : [ process.stdin, process.stdout, process.stderr ]
            });

            installer.on('exit', cb);
         } catch (err) {
            cb(err);
         }
      });
   } catch (err) {
      callOrThrow(err, cb);
   }
};

exports.uninstall = function(config, cb) {

   if (!config || !config.name || (!config.start && !config.script))
      return callOrThrow(new Error('Invalid configuration provided'), cb);

   var daemonFolder = getDaemonFolder(config);
   var daemonFile = path.join(daemonFolder, config.name + '.exe');

   if (!fs.existsSync(daemonFile))
      return callOrThrow(new Error('Service executable does not exists: ' + daemonFile), cb);

   try {
      var uninstaller = spawn(daemonFile, [ 'uninstall' ], {
         stdio : [ process.stdin, process.stdout, process.stderr ]
      });
      uninstaller.on('exit', function() {
         setTimeout(function() {
            try {
               fs.unlinkSync(daemonFile + '.xml');
               fs.unlinkSync(daemonFile);
            } catch (err) {
               callOrThrow(err, cb);
            }
         }, 5000);
      });
   } catch (err) {
      callOrThrow(err, cb);
   }
};
