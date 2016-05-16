var lusydEngine = {
	ws: 0,
	firstConnect: true,
	pingInterval: 0,
	lastSent: [],

	init: function(){
		this.connect();
	},

	connect: function(){
		var my = this; // to maintain scope //

		this.ws = new WebSocket('ws://' + window.location.hostname + ':' + String(serverSettings['port']));

		this.ws.onopen = function(){
			if(my.firstConnect){
				my.send({cmd: 'getConnectionList'});
				my.firstConnect = false;
			}else{
				my.send({cmd: 'ping'});
			}

			my.pingInterval = window.setInterval(function(){
				my.send({cmd: 'ping'});
			}, 45*1000);
		}

		this.ws.onclose = function(){
			clearInterval(my.pingInterval);

			pushMessage(this, {nick: '!', text: "Disconnected from Lusyd server. Reconnecting. . ."}, false);

			window.setTimeout(function(){
				my.connect();
			}, 500);
		}

		this.ws.onmessage = function(message){
			var data = JSON.parse(message.data);
			if(typeof window[data.cmd] == 'function') window[data.cmd](data);
		}
	},

	startNewConnection: function(domainOrClient, wsPath, channel, protocol){
		if(typeof domainOrClient === 'object'){
			protocol = domainOrClient.protocol;
			channel = domainOrClient.channel;
			wsPath = domainOrClient.wsPath;
			domainOrClient = domainOrClient.domain;
		}

		this.send({cmd: 'openConnection', id: makeID(), domain: domainOrClient, wsPath: wsPath, channel: channel, protocol: protocol});
	},

	closeConnection: function(chanID){
		this.send({cmd: 'closeConnection', id: chanID});
	},

	getCachedMsgs: function(id){
		this.send({cmd: 'getCachedMsgs', id: id });
	},

	getContentURL: function(domID, contentType, url){
		this.send({cmd: 'getContent', domID: domID, type: contentType, url: url });
	},

	changeNick: function(newNick, prepend, append, remove){
		var data = { cmd: 'changeNick', nick: newNick };
		if(typeof prepend !== 'undefined' && prepend == true) data.prepend = true;
		if(typeof append !== 'undefined' && append == true) data.append = true;
		if(typeof remove !== 'undefined' && remove == true) data.remove = true;

		this.send(data);
	},

	sendChat: function(text, id){
		id = typeof id !== 'undefined' ? id : connectedChannels[currentChannel].id;

		this.lastSent[id] = text;

		for(var i = 0, j = modules.in.length; i < j; i++){
			text = modules.in[i](text);
			if(text == false) return;
		}

		this.send({ cmd: 'chatTo', id: id, text: text });
	},

	sendInvite: function(targetNick, id){
		id = typeof id !== 'undefined' ? id : connectedChannels[currentChannel].id;

		this.send({ cmd: 'invite', id: id, nick: targetNick });
	},

	sendIgnore: function(targetNick, localOnly, id){
		id = typeof id !== 'undefined' ? id : connectedChannels[currentChannel].id;

		this.send({ cmd: 'ignore', id: id, nick: targetNick, localOnly: localOnly });
	},

	send: function(data){
		if(this.ws && this.ws.readyState == this.ws.OPEN){
			this.ws.send(JSON.stringify(data));
		}
	},

	temp: function(data){

	}
}
