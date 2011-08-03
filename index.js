var http = require('http'),
    path = require('path'),
    fs = require('fs'),
    express = require('express');

var ip = process.argv[2],
    listenPort = process.argv[3],
    serviceMappingDir = process.argv[4];
    
var app = express.createServer();
app.use(express.logger());

function readFileSyncSafe(path) {
  try {
    console.log('verbose: reading: ' + path);
    return fs.readFileSync(path);
  } catch (e) {
    console.log("error: unable to read contents of file '" + path + "': " + e.toString());
    return '';
  }
}

function readFileSyncJson(path) {
  try {
    return JSON.parse(readFileSyncSafe(path));
  } catch (e) {
    return null;
  }
}

app.get(/.*/, function(req, res) {
  var files = fs.readdirSync(serviceMappingDir);
  
  var services = [];
  
  files.forEach(function (file) {
    if (file.substr(file.length - 5, 5) === ".port") {
      var serviceName = file.substr(0, file.length - 5);
      services.push({
        name: serviceName,
        url: 'http://' + serviceName + '.anodejs.org',
        logsUrl: 'http://anodejs-log.anodejs.org/' + serviceName,
        state: '',
      });
    }
  });

  res.render('dashboard.jade', { layout: false, services: services });
})

app.listen(listenPort);