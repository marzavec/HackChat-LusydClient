/*

*/

wsServer = {
	serverSocket: 0,

	init: function(){
		this.serverSocket = new webSocket.Server({port: mainConfig.wsPort});
		this.serverSocket.on('connection', this.newConnection);
	},

	newConnection: function(socket){
		var ip = socket.upgradeReq.connection.remoteAddress;

		if(httpServer.authedIPs.indexOf(ip) == -1){
			if(mainConfig.logSecurity) log.add('Security', 'unauthorized webSocket connection from ip: ' + ip);
			socket.close();
			return;
		}

		socket.on('message', function(data){ wsServer.receivedData(socket, data); });
		socket.on('close', function(data){ wsServer.socketClosed(socket); });
	},

	receivedData: function(socket, data){
		var cmdData = JSON.parse(data);
		if(typeof lusydCore[cmdData.cmd] == 'function') lusydCore[cmdData.cmd](socket, cmdData);
	},

	broadCast: function(data){
		for(var client of this.serverSocket.clients) this.sendTo(client, data);
	},

	sendTo: function(socket, data){
		if(socket.readyState == webSocket.OPEN) socket.send(JSON.stringify(data));
	},

	socketClosed: function(socket){

	}
}
