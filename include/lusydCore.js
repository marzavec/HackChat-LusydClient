/*

*/

lusydCore = {
	roomConnections: [],
	
	init: function(){
		// placeholder //
	},
	
	getConnectionList: function(socket, data){
		console.log('got connectionList request');
		var connectionMeta = [];
		
		for(var i = 0, j = this.roomConnections.length; i < j; i++){
			connectionMeta.push({'id': this.roomConnections[i].myID, 'domain': this.roomConnections[i].myDomain, 'channel': this.roomConnections[i].myChannel })
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
	
	temp: function(){
		
	}
}