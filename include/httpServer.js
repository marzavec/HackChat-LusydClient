/*

*/

httpServer = {
	serverSocket: 0,
	authedIPs: ['127.0.0.1'],
	
	init: function(){
		this.serverSocket = httpSocket.createServer(this.reply);
		this.serverSocket.listen(mainConfig.httpPort);
	},
	
	reply: function(requestData, socket){
		if(requestData.url == '/favicon.ico'){
			httpServer.sendfourOhFour(socket);
			return;
		}
		
		if(typeof requestData.headers['authorization'] === 'undefined'){
			httpServer.sendAuthRequest(socket);
			return;
		}
		
		var ip = requestData.connection.remoteAddress.replace('::ffff:', ''); // replace() is for ws & os compatibility //
		var authToken = requestData.headers['authorization'].split(/\s+/).pop();
		var creds = new Buffer(authToken, 'base64').toString().split(/:/);
		
		if(creds[0] != mainConfig.clientUser || creds[1] != mainConfig.clientPass){
			httpServer.sendAuthRequest(socket);
			if(mainConfig.logSecurity) log.add('Security', 'failed http login from ip: ' + ip);
			return;
		}
		
		//console.log("http: " + ip)
		if(httpServer.authedIPs.indexOf(ip) == -1) httpServer.authedIPs.push(ip);
		
		httpServer.serveRequest(requestData, socket);
	},
	
	sendAuthRequest: function(socket){
		socket.writeHead(401, {'Content-Type': 'text/html', 'WWW-Authenticate': 'Basic realm="Herro tharr. . ."'});
		socket.write('<h1>You Fail.</h1><hr><address>1337 Server >9000</address>');
		socket.end();
	},
	
	sendfourOhFour: function(socket){
		socket.writeHead(404, {'Content-Type': 'text/html'});
		socket.write('<h1>A rare pepe is easier to find than what you were looking for.</h1><hr><address>1337 Server >9000</address>');
		socket.end();
	},
	
	serveRequest: function(requestData, socket){
		if(requestData.url == '/') requestData.url += 'index.html';
		var path = './www' + requestData.url.replace('..', '');
		//console.log(path);
		fileSys.access(path, fileSys.F_OK, function(err){
			if(!err){
				var stats = fileSys.statSync(path);
				socket.writeHead(200, {'Content-Type': httpServer.getContentType(path), 'Content-Length': stats.size});
				var readStream = fileSys.createReadStream(path);
				socket.on('error', function(e){ readStream.end(); socket.end(); });
				readStream.on('end', function(e){ socket.end(); });
				
				readStream.pipe(socket);
			} else {
				httpServer.sendfourOhFour(socket);
			}
		});
	},
	
	getContentType: function(path){
		switch(path.split('.').pop()){
			case 'html':
				return 'text/html';
			break;
			case 'css':
				return 'text/css';
			break;
			case 'js':
				return 'text/javascript';
			break;
			case 'wav':
				return 'audio/wav';
			break;
			case 'ttf':
				return 'font/ttf';
			break;
		}
		
		return 'text/plain';
	}
}