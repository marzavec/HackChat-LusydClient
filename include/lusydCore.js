/*

*/

lusydCore = {
	roomConnections: [],

	init: function(){
		// placeholder //
	},

	getConnectionList: function(socket, data){
		var connectionMeta = [];

		for(var i = 0, j = this.roomConnections.length; i < j; i++){
			connectionMeta.push({'id': this.roomConnections[i].myID, 'domain': this.roomConnections[i].myDomain, 'channel': this.roomConnections[i].myChannel });
		}

		wsServer.sendTo(socket, { 'cmd': 'connectionList', 'data': connectionMeta });
	},

	getCachedMsgs: function(socket, data){
		if(!mainConfig.cacheEnabled){
			wsServer.sendTo(socket, { 'cmd': 'onCacheMsgData', 'id': data.id, 'data': [{'cmd': 'warn', 'text': 'Cache disabled.'}] });

			return;
		}

		wsServer.sendTo(socket, { 'cmd': 'onCacheMsgData', 'id': data.id, 'data': cacheControl.get(data.id) });
	},

	openConnection: function(socket, data){
		data.protocol = typeof data.protocol !== 'undefined' ? data.protocol : 'vanilla';
		data.nick = typeof data.nick !== 'undefined' ? data.nick : mainConfig.nick;
		data.pass = typeof data.pass !== 'undefined' ? data.pass : mainConfig.password;

		var conSlot = this.roomConnections.push(this.buildNewChat());
		this.roomConnections[conSlot - 1].init(data.id, data.domain, data.wsPath, data.channel, data.protocol, data.nick, data.pass);

		wsServer.broadCast({ 'cmd': 'onNewConnection', 'id': data.id, 'domain': data.domain, 'channel': data.channel });
	},

	closeConnection: function(socket, data){
		for(var i = 0, j = this.roomConnections.length; i < j; i++){
			if(this.roomConnections[i].myID == data.id){
				this.roomConnections[i].shutdown();
				this.roomConnections.splice(i, 1);
				cacheControl.clear(data.id)
				wsServer.broadCast({ 'cmd': 'onConnectionClosed', 'id': data.id, 'domain': data.domain, 'channel': data.channel });

				return;
			}
		}
	},

	getContent: function(socket, data){
	  var socketType = '';
		if(data.url.indexOf('http') == -1){
			socketType = 'http';
			data.url = 'http://' + data.url;
		}else{
			socketType = data.url.split(':')[0];
		}

		var contentHost = data.url.split('/')[2];
		var contentPath = data.url.replace(socketType + '://' + contentHost, '');
		var header = { 'User-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36' } // you say bad form; I say privacy //

		if(socketType == 'http'){
			httpSocket.get({
				host: contentHost,
				path: contentPath,
				headers: header
			}, function(response){
				response.setEncoding('base64');

				var body = '';

				response.on('data', function(d){
					body += d;
				});

				response.on('end', function(){
					wsServer.sendTo(socket, { 'cmd': 'onContentData', 'type': data.type, 'domID': data.domID, 'data': 'data:' + response.headers['content-type'] + ';base64,' + body });
				});
				response.on('error', function(err) { });
			});
		}else if(socketType == 'https'){
			httpsSocket.get({
				host: contentHost,
				path: contentPath,
				headers: header
			}, function(response){
				response.setEncoding('base64');

				var body = '';

				response.on('data', function(d){
					body += d;
				});

				response.on('end', function(){
					wsServer.sendTo(socket, { 'cmd': 'onContentData', 'type': data.type, 'domID': data.domID, 'data': 'data:' + response.headers['content-type'] + ';base64,' + body });
				});
				response.on('error', function(err) { });
			});
		}
	},

	buildNewChat: function(){
		function chat(){};
		chat.prototype = chatEngine;
		return new chat;
	},

	chatTo: function(socket, data){
		for(var i = 0, j = this.roomConnections.length; i < j; i++){
			if(this.roomConnections[i].myID == data.id){
				this.roomConnections[i].say(data.text);
			}
		}
	},

	changeNick: function(socket, data){
		var changedServers = [];

		for(var i = 0, j = this.roomConnections.length; i < j; i++){
			if(typeof changedServers[this.roomConnections[i].myWsPath] === 'undefined'){
				changedServers[this.roomConnections[i].myWsPath] = 1;
				this.roomConnections[i].changeNick(data);
			}else{
				this.roomConnections[i].changeNick(data, changedServers[this.roomConnections[i].myWsPath]);
				changedServers[this.roomConnections[i].myWsPath]++;
			}
		}
	},

	temp: function(){

	}
}
