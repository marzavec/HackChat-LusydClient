/*

*/

log = {
	add: function(type, details){
		var details = this.genHeader(type) + details;
		
		var fileStream = fileSys.createWriteStream(this.getFilePath(type), {'flags': 'a'});
		fileStream.write(details);
		fileStream.end("\r\n");
	},
	
	genHeader: function(type){
		var today = new Date();

		var hour = today.getHours();
		hour = (hour < 10 ? '0' : '') + hour;

		var min  = today.getMinutes();
		min = (min < 10 ? '0' : '') + min;

		var sec  = today.getSeconds();
		sec = (sec < 10 ? '0' : '') + sec;

		var year = today.getFullYear();

		var month = today.getMonth() + 1;
		month = (month < 10 ? '0' : '') + month;

		var day  = today.getDate();
		day = (day < 10 ? '0' : '') + day;

		return year + '/' + month + '/' + day + ' ' + hour + ':' + min + ':' + sec + ' - ' + type + ' Event, details: ';
	},
	
	getFilePath: function(type){
		var today = new Date();
		
		var year = today.getFullYear();

		var month = today.getMonth() + 1;
		month = (month < 10 ? '0' : '') + month;

		var day  = today.getDate();
		day = (day < 10 ? '0' : '') + day;
		
		return './logs/' + type + 'Log_' +  year + month + day + '.txt';
	}
}