var touchControl = {
	isScrolling: false,
	ignoreGlobal: false,
	eventBinds: [],

	init: function(channel, div){

	},

	addMouseScrolling: function(target){
		if(isNaN(parseInt(target.style.transform.split(' ')[1]))) target.style.transform = 'translate3d(0px, 0px, 0px)';

		this.bindEvent(target, 'mousewheel', function(event){
			if(target.style.display == 'none') return;

			if(event.preventDefault) event.preventDefault(event);

			var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail))); // reversed for cbc //
			var currentY = parseInt(target.style.transform.split(' ')[1]);
			var nextY = 20 * delta;

			if(currentY + nextY < 0) return;
			if((currentY + nextY) > (target.offsetHeight - (window.innerHeight - 60))) return;

			if(currentY + nextY == 0) target.style.transform = 'translate3d(0px, 0px, 0px)';;
			target.style.transform = 'translate3d(0px, ' + String(currentY + nextY) + 'px, 0px)';
		});
	},

	addTouchScrolling: function(target){
		if(isNaN(parseInt(target.style.transform.split(' ')[1]))) target.style.transform = 'translate3d(0px, 0px, 0px)';

		this.bindEvent(target, 'touchstart', function(event){
			target.lastMouseY = event.changedTouches[0].clientY;
			touchControl.bindEvent(document, 'touchmove', function(event){
				touchControl.isScrolling = true;

				if(event.preventDefault) event.preventDefault(event);

				var currentY = parseInt(target.style.transform.split(' ')[1]);

				if((currentY + -(target.lastMouseY - event.changedTouches[0].clientY)) <= 0) return;
				if((currentY + -(target.lastMouseY - event.changedTouches[0].clientY)) > (target.offsetHeight - (window.innerHeight - 10))) return;

				target.style.transform = 'translate3d(0px, ' + String(currentY + -(target.lastMouseY - event.changedTouches[0].clientY)) + 'px, 0px)';

				target.lastMouseY = event.changedTouches[0].clientY;
			});

			touchControl.bindEvent(document,'touchend', function(){ touchControl.unbindEvent(document, 'touchmove'); touchControl.unbindEvent(document, 'touchend'); });

			touchControl.bindEvent(document,'touchcancel', function(){ touchControl.unbindEvent(document, 'touchmove'); touchControl.unbindEvent(document, 'touchcancel'); });
		}, false);
	},

	bindEvent: function(target, eventType, eventFunc){
		if(this.eventBinds[target.id] == undefined) this.eventBinds[target.id] = [];

		if(this.eventBinds[target.id].length > 0){
			for(var i = 0; i < this.eventBinds[target.id].length; i++) if(this.eventBinds[target.id][i].type == eventType) this.unbindEvent(target, eventType);
		}

		var eventSlot = this.eventBinds[target.id].push({ type: eventType, func: eventFunc, node: target}) - 1;
		target.addEventListener(eventType, this.eventBinds[target.id][eventSlot].func, false);
	},

	unbindEvent: function(target, eventType){
		if(target == undefined){
			for(var target in this.eventBinds){
				for(var i = 0; i < this.eventBinds[target].length; i++){
					this.eventBinds[target][i].node.removeEventListener(this.eventBinds[target][i].type, this.eventBinds[target][i].func);
					this.eventBinds[target].splice(i, 1);
					i--;
				}

				if(this.eventBinds[target].length == 0) delete this.eventBinds[target];
			}
		}else if(eventType == undefined){
			if(target.hasChildNodes()){
				var nodes = target.childNodes;
				for(var i = 0; i < nodes.length; i++){
					if(nodes[i].hasChildNodes()) this.innerUnbind(nodes[i]);

					if(nodes[i].id != undefined && this.eventBinds[nodes[i].id] != undefined){
						for(var j = 0; j < this.eventBinds[nodes[i].id].length; j++){
							this.eventBinds[nodes[i].id][j].node.removeEventListener(this.eventBinds[nodes[i].id][j].type, this.eventBinds[nodes[i].id][j].func);
							this.eventBinds[nodes[i].id].splice(j, 1);
							j--;
						}

						if(this.eventBinds[nodes[i].id].length == 0) delete this.eventBinds[nodes[i].id];
					}
				}
			}

			if(target.id != undefined && this.eventBinds[target.id] != undefined){
				for(var i = 0; i < this.eventBinds[target.id].length; i++){
					this.eventBinds[target.id][i].node.removeEventListener(this.eventBinds[target.id][i].type, this.eventBinds[target.id][i].func);
					this.eventBinds[target.id].splice(i, 1);
					i--;
				}

				if(this.eventBinds[target.id].length == 0) delete this.eventBinds[target.id];
			}
		}else{
			if(target.id == undefined) return;

			for(var i = 0; i < this.eventBinds[target.id].length; i++){
				if(this.eventBinds[target.id][i].type == eventType){
					target.removeEventListener(eventType, this.eventBinds[target.id][i].func);
					this.eventBinds[target.id].splice(i, 1);
					i--;
				}
			}

			if(this.eventBinds[target.id].length == 0) delete this.eventBinds[target.id];
		}

		return true;
	},

	innerUnbind: function(targetNode){
		var nodes = targetNode.childNodes;
		for(var i = 0; i < nodes.length; i++){
			if(nodes[i].hasChildNodes()) this.innerUnbind(nodes[i]);

			if(this.eventBinds[nodes[i].id] != undefined){
				for(var j = 0; j < this.eventBinds[nodes[i].id].length; j++){
					if(nodes[i].id != undefined){
						this.eventBinds[nodes[i].id][j].node.removeEventListener(this.eventBinds[nodes[i].id][j].type, this.eventBinds[nodes[i].id][j].func);
						this.eventBinds[nodes[i].id].splice(j, 1);
					j--;
					}
				}

				if(this.eventBinds[nodes[i].id].length == 0) delete this.eventBinds[nodes[i].id];
			}
		}
	}
}
