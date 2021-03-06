var gui = {
	chatInput: '',
	tabHolder: '',
	menus: [],
	gatesOpen: false,
	availableCss: ['default', 'android', 'atelier-dune'],

	init: function(channel, div){
		this.chatInput = this.genDom('textarea', 'chatInput', 'chatInput', '', [], [{eventName: 'keydown', func: function(event){
				if(event.keyCode == 13 && !event.shiftKey){
					event.preventDefault();

					lusydEngine.sendChat(this.value);
					this.value = '';

					return false;
				}else if(event.keyCode == 9 && !event.shiftKey){
					event.preventDefault();

					if(this.value.lastIndexOf('@') == -1) return;

					var selStart = this.selectionStart;
					var search = this.value.substr(this.value.lastIndexOf('@') + 1, selStart - (this.value.lastIndexOf('@') + 1)).toLowerCase();
					if(search == '') return;

					var searchLen = search.length;
					var results = [];
					users[connectedChannels[currentChannel].id].forEach(function(nick){
						if(nick.substr(0, searchLen).toLowerCase() == search) results.push(nick);
					});

					if(results.length == 1){
						this.value = this.value.substr(0, selStart) + (results[0].substr(searchLen)) + this.value.substr(selStart);
						this.selectionStart = selStart + (results[0].length - searchLen);
						this.selectionEnd = selStart + (results[0].length - searchLen);
					}
				}else if(event.keyCode == 38 && !event.shiftKey && this.selectionStart === 0){
					this.value = lusydEngine.lastSent[connectedChannels[currentChannel].id];
				}
			}}]);

		this.tabHolder = gui.genDom('div', 'tabHolder', '', '', [], []);

		this.tabHolder.appendChild(this.genDom('div', '', 'tabBtn icon', '&#61946;', [], [{
			eventName: 'mouseup', func: function(event){
				gui.popMenu('main');
			}
		}]));

		// main menu //
		// build close menu //
		this.buildCloseMenu();

		// build open menu //
		this.buildOpenMenu();

		// build alt open menu //
		this.buildAltOpenMenu();

		// build settings menu //
		this.buildSettingsMenu();

		// build invite menu //
		this.buildInviteMenu();

		// build ignore menu //
		this.buildIgnoreMenu();

		// build user menu //
		this.buildUserMenu();

		// build client menu //
		this.buildClientMenu();

		// build clear menu //
		this.buildClearMenu();

		this.addToMenu('main', 4, this.genDom('div', '', 'menuLink icon closeMenuBtn', '&#61974;', [{name: 'title', value: 'Close Menu'}], [{eventName: 'mouseup', func: function(event){
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

	buildCloseMenu: function(){
		this.addToMenu('main', 4, this.genDom('div', '', 'menuLink icon', '&#61975;', [{name: 'title', value: 'Close This Channel'}], [{eventName: 'mouseup', func: function(event){
			gui.popMenu('close');
		}}]));

		this.addToMenu('close', 2, this.genDom('div', '', 'menuLabel', 'Close this channel?', [{name: 'style', value:'vertical-align: bottom;'}], []));

		this.addToMenu('close', 2, this.genDom('div', '', 'menuLabel', 'Are you sure?', [{name: 'style', value:'vertical-align: bottom;'}], []));

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
	},

	buildOpenMenu: function(){
		this.addToMenu('main', 4, this.genDom('div', '', 'menuLink icon', '&#61849;', [{name: 'title', value: 'Open New Channel'}], [{eventName: 'mouseup', func: function(event){
			gui.popMenu('open');
		}}]));

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
	},

	buildAltOpenMenu: function(){
		this.addToMenu('altopen', 1, this.genDom('div', '', 'menuLabel', 'Alternate open menu under development', [], []));

		this.addToMenu('altopen', 1, this.genDom('div', '', 'menuLink icon closeMenuBtn', '&#61974;', [{name: 'title', value: 'Close Menu'}], [{eventName: 'mouseup', func: function(event){
			closeCurrentMenu();
		}}]));
	},

	buildSettingsMenu: function(){
		this.addToMenu('main', 4, this.genDom('div', '', 'menuLink icon', '&#61972;', [{name: 'title', value: 'Display Settings'}], [{eventName: 'mouseup', func: function(event){
			gui.popMenu('settings');
		}}]));

		this.addToMenu('settings', 1, this.genDom('div', '', 'menuLabel', 'Settings menu under development', [], []));

		this.addToMenu('settings', 1, this.genDom('div', '', 'menuLink icon closeMenuBtn', '&#61974;', [{name: 'title', value: 'Close Menu'}], [{eventName: 'mouseup', func: function(event){
			closeCurrentMenu();
		}}]));
	},

	buildInviteMenu: function(){
		this.addToMenu('main', 4, this.genDom('div', '', 'menuLink icon', '&#61746;', [{name: 'title', value: 'Invite a User'}], [{eventName: 'mouseup', func: function(event){
			gui.popMenu('invite');
		}}]));

		this.addToMenu('invite', 1, this.genDom('div', '', 'menuLabel', 'Invite menu under development', [], []));

		this.addToMenu('invite', 1, this.genDom('div', '', 'menuLink icon closeMenuBtn', '&#61974;', [{name: 'title', value: 'Close Menu'}], [{eventName: 'mouseup', func: function(event){
			closeCurrentMenu();
		}}]));
	},

	buildIgnoreMenu: function(){
		this.addToMenu('main', 4, this.genDom('div', '', 'menuLink icon', '&#61968;', [{name: 'title', value: 'Ignore a User'}], [{eventName: 'mouseup', func: function(event){
			gui.popMenu('ignore');
		}}]));

		this.addToMenu('ignore', 1, this.genDom('div', '', 'menuLabel', 'Ignore menu under development', [], []));

		this.addToMenu('ignore', 1, this.genDom('div', '', 'menuLink icon closeMenuBtn', '&#61974;', [{name: 'title', value: 'Close Menu'}], [{eventName: 'mouseup', func: function(event){
			closeCurrentMenu();
		}}]));
	},

	buildUserMenu: function(){
		this.addToMenu('main', 4, this.genDom('div', '', 'menuLink icon', '&#61948;', [{name: 'title', value: 'My Profile'}], [{eventName: 'mouseup', func: function(event){
			gui.popMenu('profile');
		}}]));

		this.addToMenu('profile', 1, this.genDom('div', '', 'menuLabel', 'Profile menu under development', [], []));

		this.addToMenu('profile', 1, this.genDom('div', '', 'menuLink icon closeMenuBtn', '&#61974;', [{name: 'title', value: 'Close Menu'}], [{eventName: 'mouseup', func: function(event){
			closeCurrentMenu();
		}}]));
	},

	buildClientMenu: function(){
		this.addToMenu('main', 4, this.genDom('div', '', 'menuLink icon', '&#61862;', [{name: 'title', value: 'Manage Clients'}], [{eventName: 'mouseup', func: function(event){
			lusydEngine.send({cmd: 'getClientList'});
			closeCurrentMenu();
		}}]));

		this.addToMenu('clients', 1, this.genDom('div', '', 'menuLabel', 'Refreshing. . .', [], []));

		this.addToMenu('clients', 1, this.genDom('div', '', 'menuLink icon closeMenuBtn', '&#61974;', [{name: 'title', value: 'Close Menu'}], [{eventName: 'mouseup', func: function(event){
			closeCurrentMenu();
		}}]));
	},

	buildClearMenu: function(){
		this.addToMenu('main', 4, this.genDom('div', '', 'menuLink icon', '&#61956;', [{name: 'title', value: 'Clear Messages'}], [{eventName: 'mouseup', func: function(event){
			gui.popMenu('clear');
		}}]));

		this.addToMenu('clear', 1, this.genDom('div', '', 'menuLabel', 'Clear menu under development', [], []));

		this.addToMenu('clear', 1, this.genDom('div', '', 'menuLink icon closeMenuBtn', '&#61974;', [{name: 'title', value: 'Close Menu'}], [{eventName: 'mouseup', func: function(event){
			closeCurrentMenu();
		}}]));
	},

	rebuildClientsMenu: function(data){
		this.menus['clients'].innerHTML = '';
		this.menus['clients'].appendChild(this.genDom('div', '', 'menuRow'));

		if(typeof data === 'undefined'){
			this.addToMenu('clients', 1, this.genDom('div', '', 'menuLabel', 'Refreshing. . .', [], []));

			this.addToMenu('clients', 1, this.genDom('div', '', 'menuLink icon closeMenuBtn', '&#61974;', [{name: 'title', value: 'Close Menu'}], [{eventName: 'mouseup', func: function(event){
				closeCurrentMenu();
			}}]));
			return;
		}

		if(data.clientList.length == 1){
			this.addToMenu('clients', 1, this.genDom('div', '', 'menuLabel', 'You are the only one connected.', [], []));

			this.addToMenu('clients', 1, this.genDom('div', '', 'menuLink icon closeMenuBtn', '&#61974;', [{name: 'title', value: 'Close Menu'}], [{eventName: 'mouseup', func: function(event){
				gui.rebuildClientsMenu();
				closeCurrentMenu();
			}}]));
			return;
		}

		this.addToMenu('clients', 1, this.genDom('div', '', 'menuLabel', 'Click to force client disconnect:', [], []));

		data.clientList.forEach(function(clientData){
			if(clientData.id != data.thisID) gui.addToMenu('clients', 1, gui.genDom('div', '', 'menuLink', 'ID: ' + clientData.id.substr(0, 7) + ' IP: ' + clientData.ip, [{name: 'targetid', value: clientData.id }], [{eventName: 'mouseup', func: function(event){
				console.log(this.getAttribute('targetid'));
				lusydEngine.send({ cmd: 'killTargetClient', targetid: this.getAttribute('targetid') });
				closeCurrentMenu();
				gui.rebuildClientsMenu();
			}}]));
		});

		this.addToMenu('clients', 1, this.genDom('div', '', 'menuLink icon closeMenuBtn', '&#61974;', [{name: 'title', value: 'Close Menu'}], [{eventName: 'mouseup', func: function(event){
			closeCurrentMenu();
		}}]));
	},

	openGates: function(){
		this.gatesOpen = true;

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
	},

	changeStyle: function(newStyle){
		document.getElementById('currentCss').setAttribute('href', 'css/' + newStyle + '.css');
	}
}
