/*

*/

cacheControl = {
	cache: [],
	
	add: function(chanID, data){
		if(typeof this.cache[chanID] === 'undefined') this.cache[chanID] = [];
			
		if(this.cache[chanID].length >= mainConfig.maxCachedMsgs) this.cache[chanID].shift();
		
		this.cache[chanID].push(data);
	},
	
	get: function(chanID){
		if(typeof this.cache[chanID] === 'undefined') return [];
		
		return this.cache[chanID];
	},
	
	clear: function(chanID){
		this.cache[chanID] = [];
	}
}