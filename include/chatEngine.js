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
	lastPoster: '',


	init: function(id, domain, wsPath, channel, pModule, nick, pass){
		this.myID = id;
		this.myDomain = domain;
		this.myWsPath = wsPath;
		this.myChannel = channel;
		this.protocolModule = pModule;

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

			if(mainConfig.cacheEnabled) cacheControl.add(my.myID, data);

			if(data.cmd == 'chat'){
				data.isLastPoster = (my.lastPoster == data.nick);
				my.lastPoster = data.nick;
				if(data.text.toLowerCase().indexOf(my.myNick.toLowerCase()) != -1) data.mention = true;
				var forbidden = {
				'&':'&amp;',
				'<':'&#60;',
				'>':'&#62;'
				};
				data.text = data.text.replace(/(&|<|>)/g, function(matched){
					return forbidden[matched];
				});

				data.text = data.text.replace("\n", '<br>');
			}else{
				my.lastPoster = '';
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
		clearInterval(this.pingInterval);
		this.ws.close();
	},

	changeNick: function(nickData, delay){
		if(typeof delay !== 'undefined'){
			console.log('delayed change');
			console.log(delay * 2000);
			var my = this;
			setTimeout(function(){ my.changeNick(nickData); }, delay * 2000);
			return;
		}
		
		var newNick = nickData.nick;
		if(typeof nickData.append !== 'undefined' && nickData.append == true) newNick = this.myNick + nickData.nick;
		if(typeof nickData.prepend !== 'undefined' && nickData.prepend == true) newNick = nickData.nick + this.myNick;

		this.myNick = newNick;
		this.shutdown();
		this.join();
	},

	temp: function(){
		// placeholder //
	}
}
