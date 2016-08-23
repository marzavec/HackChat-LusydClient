var timeoutEngine = {
  enabled: true,
  ttMouseMon: 900000, // 15 minutes //
  ttKillself: 1800000, // 30 minutes //
	killTime: 0,

  init: function(){
    setTimeout(function(){ timeoutEngine.startMouseMon(); }, this.ttMouseMon);
  },

  startMouseMon: function(){
    if(!this.enabled) return;

    document.addEventListener("mousemove", this.onActivity, false);

    this.killTime = setTimeout(function(){
      lusydEngine.send({ cmd: 'killTargetClient', targetid: "this" });
    }, this.ttKillself);
  },

  onActivity: function(event){
    document.removeEventListener("mousemove", timeoutEngine.onActivity);

    clearTimeout(timeoutEngine.killTime);

    timeoutEngine.init();
  },

  temp: function(){

  }
}
