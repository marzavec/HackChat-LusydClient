/*

*/

mainConfig = {
	clientUser: 'root', // username to access proxy //
	clientPass: 'toor', // password to access proxy //

	nick: 'Lusyd', // nick to use in channels //
	password: 'fucktripslol', // password to use in channels //

	httpPort: '6161', // http socket server port, for the browser to connect to //
	wsPort: '6060', // web socket server port, for the js to connect to //

	logErrors: true, // enable error logging //
	logSecurity: true, // log failed or unauthorized usage attempts //

	cacheEnabled: true, // allow message caching //
	maxCachedMsgs: 200, // how many chat events to store per channel //
	proxyImages: true // allow client to load images through lusyd server //
}
