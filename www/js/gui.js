var gui = {
	chatInput: '',
	tabHolder: '',
	menus: [],
	availableCss: ['default', 'android'],
	
	init: function(channel, div){
		this.chatInput = this.genDom('textarea', 'chatInput', 'chatInput', '', [], [{eventName: 'keydown', func: function(event){ 
				if(event.keyCode == 13 && !event.shiftKey){
					event.preventDefault();
					
					lusydEngine.sendChat(this.value);
					this.value = '';
					
					return false;
				}
			}}]);
		
		this.tabHolder = gui.genDom('div', 'tabHolder', '', '', [], []);
		
		this.tabHolder.appendChild(this.genDom('div', '', 'tabBtn icon', '&#61946;', [], [{
			eventName: 'mouseup', func: function(event){
				gui.popMenu('main');
			}
		}]));
		
		// build main menu //
		this.addToMenu('main', 4, this.genDom('div', '', 'menuLink icon', '&#61975;', [{name: 'title', value: 'Close This Channel'}], [{eventName: 'mouseup', func: function(event){
			gui.popMenu('close');
		}}]));
		
		this.addToMenu('main', 4, this.genDom('div', '', 'menuLink icon', '&#61849;', [{name: 'title', value: 'Open New Channel'}], [{eventName: 'mouseup', func: function(event){
			gui.popMenu('open');
		}}]));
		
		this.addToMenu('main', 4, this.genDom('div', '', 'menuLink icon', '&#61972;', [{name: 'title', value: 'Display Settings'}], [{eventName: 'mouseup', func: function(event){
			gui.popMenu('settings');
		}}]));
		
		this.addToMenu('main', 4, this.genDom('div', '', 'menuLink icon', '&#61746;', [{name: 'title', value: 'Invite a User'}], [{eventName: 'mouseup', func: function(event){
			gui.popMenu('invite');
		}}]));
		
		this.addToMenu('main', 4, this.genDom('div', '', 'menuLink icon', '&#61968;', [{name: 'title', value: 'Ignore a User'}], [{eventName: 'mouseup', func: function(event){
			gui.popMenu('ignore');
		}}]));
		
		this.addToMenu('main', 4, this.genDom('div', '', 'menuLink icon', '&#61948;', [{name: 'title', value: 'My Profile'}], [{eventName: 'mouseup', func: function(event){
			gui.popMenu('profile');
		}}]));
		
		this.addToMenu('main', 4, this.genDom('div', '', 'menuLink icon', '&#61956;', [{name: 'title', value: 'Clear Messages'}], [{eventName: 'mouseup', func: function(event){
			gui.popMenu('clear');
		}}]));
		
		this.addToMenu('main', 4, this.genDom('div', '', 'menuLink icon closeMenuBtn', '&#61974;', [{name: 'title', value: 'Close Menu'}], [{eventName: 'mouseup', func: function(event){
			closeCurrentMenu();
		}}]));
		
		// build close menu //
		this.addToMenu('close', 2, this.genDom('div', '', 'menuLink', 'Close this channel?', [{name: 'style', value:'vertical-align: bottom;'}], []));
		
		this.addToMenu('close', 2, this.genDom('div', '', 'menuLink', 'Are you sure?', [{name: 'style', value:'vertical-align: bottom;'}], []));
		
		this.addToMenu('close', 2, this.genDom('div', '', 'menuLink icon', '&#61796;', [{name: 'title', value: 'YES'},{name: 'style', value: 'color: #0F0;'}], [{eventName: 'mouseup', func: function(event){
			lusydEngine.closeConnection(connectedChannels[currentChannel].id);
			closeCurrentMenu();
		}}]));
		
		this.addToMenu('close', 2, this.genDom('div', '', 'menuLink icon', '&#61760;', [{name: 'title', value: 'NO'},{name: 'style', value: 'color: #F00;'}], [{eventName: 'mouseup', func: function(event){
			closeCurrentMenu();
		}}]));
		
		this.addToMenu('close', 9, this.genDom('div', '', 'menuLink icon closeMenuBtn', '&#61974;', [{name: 'title', value: 'Close Menu'}], [{eventName: 'mouseup', func: function(event){
			closeCurrentMenu();
		}}]));
		
		// build open menu //
		var connectionList = this.genDom('select', 'styleList', 'menuLink', '', [], [{eventName: 'change', func: function(event){
			closeCurrentMenu();
			if(this.value == 'other'){
				gui.popMenu('altopen');
			}else{
				openConnectionByTitle(this.value);
			}
		}}]);
		
		var changeMe = document.createElement("option");
		changeMe.value = '';
		changeMe.text = '< Open New Connection >';
		connectionList.appendChild(changeMe);
		
		roomPresets.forEach(function(channel){
			var opt = document.createElement("option");
			opt.value = channel.title;
			opt.text = channel.title;
			connectionList.appendChild(opt);
		});
		
		var altConnection = document.createElement("option");
		altConnection.value = 'other';
		altConnection.text = '< Other >';
		connectionList.appendChild(altConnection);
		
		this.addToMenu('open', 1, connectionList);
		
		this.addToMenu('open', 1, this.genDom('div', '', 'menuLink icon closeMenuBtn', '&#61974;', [{name: 'title', value: 'Close Menu'}], [{eventName: 'mouseup', func: function(event){
			closeCurrentMenu();
		}}]));
		
		// build alt open menu //
		this.addToMenu('altopen', 1, this.genDom('div', '', 'menuLink', 'Alternate open menu under development', [], []));
		
		this.addToMenu('altopen', 1, this.genDom('div', '', 'menuLink icon closeMenuBtn', '&#61974;', [{name: 'title', value: 'Close Menu'}], [{eventName: 'mouseup', func: function(event){
			closeCurrentMenu();
		}}]));
		
		// build settings menu //
		this.addToMenu('settings', 1, this.genDom('div', '', 'menuLink', 'Settings menu under development', [], []));
		
		this.addToMenu('settings', 1, this.genDom('div', '', 'menuLink icon closeMenuBtn', '&#61974;', [{name: 'title', value: 'Close Menu'}], [{eventName: 'mouseup', func: function(event){
			closeCurrentMenu();
		}}]));
		
		// build invite menu //
		this.addToMenu('invite', 1, this.genDom('div', '', 'menuLink', 'Invite menu under development', [], []));
		
		this.addToMenu('invite', 1, this.genDom('div', '', 'menuLink icon closeMenuBtn', '&#61974;', [{name: 'title', value: 'Close Menu'}], [{eventName: 'mouseup', func: function(event){
			closeCurrentMenu();
		}}]));
		
		// build ignore menu //
		this.addToMenu('ignore', 1, this.genDom('div', '', 'menuLink', 'Ignore menu under development', [], []));
		
		this.addToMenu('ignore', 1, this.genDom('div', '', 'menuLink icon closeMenuBtn', '&#61974;', [{name: 'title', value: 'Close Menu'}], [{eventName: 'mouseup', func: function(event){
			closeCurrentMenu();
		}}]));
		
		// build user menu //
		this.addToMenu('profile', 1, this.genDom('div', '', 'menuLink', 'Profile menu under development', [], []));
		
		this.addToMenu('profile', 1, this.genDom('div', '', 'menuLink icon closeMenuBtn', '&#61974;', [{name: 'title', value: 'Close Menu'}], [{eventName: 'mouseup', func: function(event){
			closeCurrentMenu();
		}}]));
		
		// build clear menu //
		this.addToMenu('clear', 1, this.genDom('div', '', 'menuLink', 'Clear menu under development', [], []));
		
		this.addToMenu('clear', 1, this.genDom('div', '', 'menuLink icon closeMenuBtn', '&#61974;', [{name: 'title', value: 'Close Menu'}], [{eventName: 'mouseup', func: function(event){
			closeCurrentMenu();
		}}]));
	},
	
	addToMenu: function(id, maxCols, dom){
		if(typeof this.menus[id] === 'undefined'){
			this.menus[id] = this.genDom('div', '', 'menu');
			this.menus[id].appendChild(this.genDom('div', '', 'menuRow'));
		}
		
		if(this.menus[id].lastChild.children.length >= maxCols){
			this.menus[id].appendChild(this.genDom('div', '', 'menuRow'));
		}
		this.menus[id].lastChild.appendChild(dom);
	},
	
	genDom: function(type, id, className, innerHtml, attribArray, bindArray){
		id = id !== '' ? id : makeID();
		innerHtml = typeof innerHtml !== 'undefined' ? innerHtml : '';
		attribArray = typeof attribArray !== 'undefined' ? attribArray : [];
		bindArray = typeof bindArray !== 'undefined' ? bindArray : [];
		
		var returnDom = document.createElement(type);
		returnDom.setAttribute('id', id);
		returnDom.setAttribute('class', className);
		returnDom.innerHTML = innerHtml;
		
		attribArray.forEach(function(att){
			returnDom.setAttribute(att.name, att.value);
		});
		
		bindArray.forEach(function(event){
			touchControl.bindEvent(returnDom, event.eventName, event.func);
		});
		
		return returnDom;
	},
	
	openGates: function(){
		setTimeout(function(){
			document.getElementById('rightGate').style.transform = 'translate3d(75%, 0, 0)';
			document.getElementById('leftGate').style.transform = 'translate3d(-75%, 0, 0)';
		}, 300);
		
		setTimeout(function(){
			document.body.removeChild(document.getElementById('rightGate'));
			document.body.removeChild(document.getElementById('leftGate'));
		}, 700);
	},
	
	addConnectionTab: function(id, domain, channel){
		this.tabHolder.appendChild(this.genDom('div', id, 'tabBtn', domain + '<br>' + channel, [], [{
			eventName: 'mouseup', func: function(event){
				changeChannel(this.id);
			}
		}]));
	},
	
	popMenu: function(id){
		closeCurrentMenu();
		
		if(typeof this.menus[id] === 'undefined'){
			console.log('Failed to load menu: ' + id);
			return;
		}
		
		currentMenu = id;
		document.body.appendChild(this.menus[id]);
		setTimeout( function(){ addClass(gui.menus[id], 'menuOpen'); }, 100);
	}
}