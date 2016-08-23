var framework = {
	scrArray: [
				// core files //
				'js/lusydEngine.js',
				'js/gui.js',
				'js/touchControl.js',
				'js/global.js',
				'js/clientConfig.js',
				'js/serverSettings.js',
				'js/timeoutEngine.js',
				'js/modules.js',

				// module files //
				'modules/afk.js',
				'modules/nick.js',
				'modules/invite.js',
				'modules/ignore.js',

				// initialize lusyd client //
				'js/init.js'
				],


	load: function(){
		this.scrArray.forEach(function(srcFile){
			var domScript = document.createElement('script');
			domScript.async = false;
			domScript.src = srcFile;
			document.head.appendChild(domScript);
		});
	}
}
