/*

*/

// import classes //
fileSys = require('fs');
httpSocket = require('http');
httpsSocket = require('https');
webSocket = require('ws');
require('./config/mainConfig.js');
require('./include/log.js');
require('./include/lusydCore.js');
require('./include/cacheControl.js');
require('./include/httpServer.js');
require('./include/wsServer.js');
require('./include/chatEngine.js');
require('./include/modules.js');

//create log folder
if (!fileSys.existsSync('./logs')){
    fileSys.mkdirSync('./logs');
}

// import server modules //
var moduleList = fileSys.readdirSync('./modules/');
moduleList.forEach(function(mod){
	mod = './modules/' + mod;
	if(!fileSys.lstatSync(mod).isDirectory()) require(mod);
});

// initialize //
httpServer.init();
wsServer.init();
