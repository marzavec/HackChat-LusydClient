/*

*/

modules.protocol['vanilla'] = function(data){
	if(data.cmd == 'join'){
		data.nick = data.nick + '#' + data.pass;
		
		return data;
	}
	
	return data;
}