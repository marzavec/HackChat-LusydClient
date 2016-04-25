/*
	Modified chatEngine, originally developed for ToastyChat Mobile
	Developer: Marzavec
	Use it as you'd like, but I'd appreciate a mention n_n
*/

chatEngine = {
	myID: '',
	myDomain: '',
	myWsPath: '',
	myChannel: '',
	myNick: '',
	myPass: '',
	protocolModule: '',
	shuttingDown: false,
	ws: 0,
	pingInterval: 0,
	rejoinInterval: 0,
	ignoredUsers: [],


	init: function(id, domain, wsPath, channel, pModule, nick, pass){
		this.myID = id;
		this.myDomain = domain;
		this.myWsPath = wsPath;
		this.myChannel = channel;
		this.protocolModule = pModule;
		this.lastPoster = '';

		this.myNick = typeof nick !== 'undefined' ? nick : mainConfig.nick;
		this.myPass = typeof pass !== 'undefined' ? pass : mainConfig.password;

		this.join();
	},

	join: function(){
		var my = this; // to maintain scope //

		this.ws = new webSocket(this.myWsPath);

		this.ws.onopen = function(){
			clearInterval(my.rejoinInterval);

			my.send({cmd: 'join', channel: my.myChannel, nick: my.myNick, pass: my.myPass});

			my.pingInterval = setInterval(function(){
				my.send({cmd: 'ping'});
			}, 45*1000);
		}

		this.ws.onclose = function(){
			clearInterval(my.pingInterval);

			if(!my.shuttingDown){
				my.rejoinInterval = setTimeout(function(){
					my.join(my.myChannel);
				}, 2000);
			}
		}

		this.ws.onmessage = function(message){
			var data = JSON.parse(message.data);
			if (data.cmd == "chat") {
				data.isLastPoster = (this.lastPoster == data.nick);
				this.lastPoster = data.nick;
				console.log(JSON.stringify(data));
			}

			if(mainConfig.cacheEnabled) cacheControl.add(my.myID, data);

			if(data.cmd == 'chat'){
				if(data.text.indexOf("@" + my.myNick) != -1) data.mention = true;
				var forbidden = {
				'<':'&#60;',
				'>':'&#62;'
				};
				data.text = data.text.replace(/<|>/gi, function(matched){
					return forbidden[matched];
				});
			}

			data.id = my.myID;
			wsServer.broadCast(data);
		}
	},

	send: function(data){
		data = modules.protocol[this.protocolModule](data);
		if(this.ws && this.ws.readyState == this.ws.OPEN){
			this.ws.send(JSON.stringify(data));
		}
	},

	say: function(data){
		this.send({cmd: 'chat', text: data});
	},

	shutdown: function(){
		this.shuttingDown = true;
		this.ws.close();
	},

	temp: function(){
		// placeholder //
	}
}
