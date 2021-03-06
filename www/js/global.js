// setup global vars //
var roomPresets = [];
var connectedChannels = [];
var currentChannel = 0;
var notifySound = new Audio('audio/notifi-sound.wav');
var currentMenu = '';
var odd = false;
var unreadCount = 0;
var users = [];

// global functions //

function connectionList(conList){
	if(conList.data.length == 0){
		lusydEngine.startNewConnection(roomPresets[0]);
		return;
	}

	// get cached messages for each channel //
	conList.data.forEach(function(meta){
		var newCon = connectedChannels.push({ id: meta.id, domain: meta.domain, channel: meta.channel, chanDiv: gui.genDom('div', '', 'chatOutput', '<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>') }) - 1;
		document.body.appendChild(connectedChannels[newCon].chanDiv);
		touchControl.addMouseScrolling(connectedChannels[newCon].chanDiv);
		gui.addConnectionTab(meta.id, meta.domain, meta.channel);

		connectedChannels[newCon].chanDiv.style.display = 'none';

		lusydEngine.getCachedMsgs(meta.id);
	});

	setTimeout(function(){ gui.openGates(); }, 500);

	setTimeout(function(){
		document.body.appendChild(gui.chatInput);
		document.body.appendChild(gui.tabHolder);
		connectedChannels[currentChannel].chanDiv.style.display = 'table';
	}, 1200);
}

function onCacheMsgData(msgData){
	var cached = true;
	msgData.data.forEach(function(chatEvent){
		chatEvent.id = msgData.id;
		if(typeof window[chatEvent.cmd] == 'function') window[chatEvent.cmd](chatEvent, cached);
	});
}

function onNewConnection(data){
	var newCon = connectedChannels.push({ id: data.id, domain: data.domain, channel: data.channel, chanDiv: gui.genDom('div', '', 'chatOutput', '<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>') }) - 1;
	document.body.appendChild(connectedChannels[newCon].chanDiv);
	touchControl.addMouseScrolling(connectedChannels[newCon].chanDiv);
	gui.addConnectionTab(data.id, data.domain, data.channel);

	changeChannel(data.id);

	if(!gui.gatesOpen){
		setTimeout(function(){ gui.openGates(); }, 500);

		setTimeout(function(){
			document.body.appendChild(gui.chatInput);
			document.body.appendChild(gui.tabHolder);
			connectedChannels[currentChannel].chanDiv.style.display = 'table';
		}, 1200);
	}
}

function onConnectionClosed(data){
	var chatTab = document.getElementById(data.id);
	chatTab.parentNode.removeChild(chatTab);

	for(var i = 0, j = connectedChannels.length; i < j; i++){
		if(connectedChannels[i].id == data.id){
			connectedChannels[i].chanDiv.parentNode.removeChild(connectedChannels[i].chanDiv);
			connectedChannels.splice(i, 1);
			changeChannel(connectedChannels[0].id);
			return;
		}
	}
}

function onContentData(data){
	var contentDom = gui.genDom(data.type, '', '', '', [{name: 'src', value: data.data}], []);
	if(data.type == 'video'){
		contentDom.autoplay = true;
		contentDom.controls = true;
	}
	document.getElementById(data.domID).appendChild(contentDom);
}

function onClientList(data){
	console.log(data);
	gui.rebuildClientsMenu(data);
	gui.popMenu('clients');
}

function onForward(data){
	window.location = data.destination;
}

function makeID(){
	var returnID = "";
	var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for(var i = 0; i < 7; i++) returnID += chars.charAt(Math.floor(Math.random() * chars.length));

	return returnID;
}

function chanIdToDiv(id){
	for(var i = 0, j = connectedChannels.length; i < j; i++){
		if(connectedChannels[i].id == id){
			return connectedChannels[i].chanDiv;
		}
	}
}

function chat(data, isCached){
	if(!document.hasFocus())
		document.title = "(" + ++unreadCount + ") Lusyd Client";

	pushMessage(chanIdToDiv(data.id), parseLinks(data));

	if(typeof isCached !== 'undefined' && isCached == true) return;

	for(var i = 0, j = modules.out.length; i < j; i++){
		data = modules.out[i](data);
		if(data == false) return;
	}
}

function info(data){
	data.nick = '*';
	pushMessage(chanIdToDiv(data.id), parseLinks(data));
}

function warn(data){
	data.nick = '!';
	pushMessage(chanIdToDiv(data.id), data);
}

function onlineAdd(data, isCached){
	if(typeof users[data.id] === 'undefined') users[data.id] = [];
	if(users[data.id].indexOf(data.nick) == -1) users[data.id].push(data.nick);

	data.text = data.nick + ' joined';
	data.nick = '*';
	pushMessage(chanIdToDiv(data.id), data);

	if(typeof isCached !== 'undefined' && isCached == true) return;

	for(var i = 0, j = modules.out.length; i < j; i++){
		data = modules.out[i](data);
		if(data == false) return;
	}
}

function onlineRemove(data, isCached){
	users[data.id].splice(users[data.id].indexOf(data.nick), 1);

	data.text = data.nick + ' left';
	data.nick = '*';
	pushMessage(chanIdToDiv(data.id), data);

	if(typeof isCached !== 'undefined' && isCached == true) return;

	for(var i = 0, j = modules.out.length; i < j; i++){
		data = modules.out[i](data);
		if(data == false) return;
	}
}

function onlineSet(data, isCached){
	users[data.id] = data.nicks;

	data.text = 'Current Users: ' + data.nicks.join(', ');
	data.nick = '*';
	pushMessage(chanIdToDiv(data.id), data);

	if(typeof isCached !== 'undefined' && isCached == true) return;

	for(var i = 0, j = modules.out.length; i < j; i++){
		data = modules.out[i](data);
		if(data == false) return;
	}
}

function changeChannel(newChan){
	var targetChan = 0;
	for(var i = 0, j = connectedChannels.length; i < j; i++){
		if(connectedChannels[i].id == newChan){
			targetChan = i;
			break;
		}
	}

	if(typeof connectedChannels[currentChannel] !== 'undefined') connectedChannels[currentChannel].chanDiv.style.display = 'none';
	currentChannel = targetChan;
	connectedChannels[currentChannel].chanDiv.style.display = 'table';
}

function joinChanel(targetDom){
	var domain = connectedChannels[currentChannel].domain;
	var wsUrl = '';
	var protocol = '';
	for(var i = 0, j = roomPresets.length; i < j; i++){
		if(roomPresets[i].domain == domain){
			wsUrl = roomPresets[i].wsPath;
			protocol = roomPresets[i].protocol;
			break;
		}
	}

	lusydEngine.startNewConnection(domain, wsUrl, targetDom.innerHTML.substr(1), protocol);
}

function viewImage(targetDom){
	var imgContainer = gui.genDom('div', '', 'menu', '', [], []);
	if(serverSettings['willProxy']){
		lusydEngine.getContentURL(imgContainer.id, 'img', targetDom.innerHTML);
	}else{
		imgContainer.appendChild(gui.genDom('img', '', '', '', [{name: 'src', value: targetDom.innerHTML}], []));
	}

	imgContainer.appendChild(gui.genDom('div', '', 'menuLink icon closeMenuBtn', '&#61974;', [{name: 'title', value: 'Close Menu'}], [{eventName: 'mouseup', func: function(event){
		document.body.removeChild(imgContainer);
	}}]));

	document.body.appendChild(imgContainer);
	setTimeout( function(){ addClass(imgContainer, 'menuOpen'); }, 100);
}

function viewVideo(targetDom){
	var vidContainer = gui.genDom('div', '', 'menu', '', [], []);
	if(serverSettings['willProxy']){
		lusydEngine.getContentURL(vidContainer.id, 'video', targetDom.innerHTML);
	}else{
		var contentDom = gui.genDom('video', '', '', '', [{name: 'src', value: targetDom.innerHTML}], []);
		contentDom.autoplay = true;
		contentDom.controls = true;
		vidContainer.appendChild(contentDom);
	}

	vidContainer.appendChild(gui.genDom('div', '', 'menuLink icon closeMenuBtn', '&#61974;', [{name: 'title', value: 'Close Menu'}], [{eventName: 'mouseup', func: function(event){
		document.body.removeChild(vidContainer);
	}}]));

	document.body.appendChild(vidContainer);
	setTimeout( function(){ addClass(vidContainer, 'menuOpen'); }, 100);
}

function openConnectionByTitle(title){
	roomPresets.forEach(function(channel){
		if(channel.title == title){
			lusydEngine.startNewConnection(channel);
		}
	});
}

function closeCurrentMenu(event){
	if(typeof event !== 'undefined' && event.preventDefault) event.preventDefault(event);

	if(typeof gui.menus[currentMenu] === 'undefined') return;

	//var wait = touchControl.unbindEvent(gui.menus[currentMenu]);
	removeClass(gui.menus[currentMenu], 'menuOpen');
	gui.menus[currentMenu].parentNode.removeChild(gui.menus[currentMenu]);
	currentMenu = '';
}

function notifyUser(text, user, chanID){
	if(typeof text !== 'undefined'){
		notifySound.play();

		var notif = new Notification(user + ' mentioned you.', {
			body: text,
			icon: 'images/notification.png'
		});

		notif.onclick = function(){
      changeChannel(chanID);
    };

		setTimeout(function(){
			notif.close();
		}, 8000);
	}
}

function tripToColor(trip){
	var color1 = (Math.floor((trip[0].charCodeAt(0) - 33) * 2.865)).toString(16);
	var color3 = (Math.floor((trip[1].charCodeAt(0) - 33) * 2.865)).toString(16);
	var color2 = (Math.floor((trip[2].charCodeAt(0) - 33) * 2.865)).toString(16);
	return "#" + color1 + color2 + color3;
}

function parseLinks(data){
	var newData = JSON.parse(JSON.stringify(data));

	var channels = newData.text.match(/\s\?(\w+)\s?/gmi);
	if(channels) channels.forEach(function(link){
		link = link.replace(' ', '');
		if(link.substr(0, 1) != '?') return;
		var a = document.createElement('a');
		a.innerHTML = link;
		a.setAttribute("onclick", "joinChanel(this)");
		newData.text = newData.text.replace(link, a.outerHTML);
	});


	var urls = newData.text.match(/((https?:\/\/|www)\S+)|(\w*.(com|org|net|moe)\b)/ig);
	if(urls){
		var youtubeLinks = urls.join(" ").match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*t/);

		urls.forEach(function(link){
			var a = document.createElement('a');
			a.innerHTML = link;

			//Image link
			if((/\.(jpe?g|png|gif|bmp)$/i).test(link)){
				a.setAttribute("onclick", "viewImage(this)");
				newData.text = newData.text.replace(link, a.outerHTML);
			}

			//Video link
			else if((/\.(webm|mp4|ogg|gifv)$/i).test(link)){
				a.setAttribute("onclick", "viewVideo(this)");
				newData.text = newData.text.replace(link, a.outerHTML);
			}

			//Youtube

			else if(youtubeLinks){
				a.setAttribute("onclick", "this.appendChild(createGraphicEl(youtubeLinks[7]))");
				newData.text = newData.text.replace(link, a.outerHTML);
				//https://www.googleapis.com/youtube/v3/videos?key=YOUR_API_KEY&part=snippet&id=VIDEO_ID
			}

			else {
				a.setAttribute("href", link);
				a.setAttribute("target", "_blank");
				newData.text = data.text.replace(link, a.outerHTML);
			}
		});
	}
	return newData;
}

function createYouTubeElement(link){
	var iframe = document.createElement('iframe');
	setAttributes(iframe, {"src": "https://www.youtube.com/embed/" + link + "?version=3&enablejsapi=1", "width": "640", "height": "385", "frameborder": "0", "allowFullScreen": ""});
	return iframe;
}

function createGraphicEl(link, type){
	var el = document.createElement(type);
	setAttributes(el, {"src": link.innerHTML, "height": "50%", "width": "50%"});
	el.onclick = function() {
		//place holder//
	}
	return el;
}

function setAttributes(element, attributes){
	for(var key in attributes){
		element.setAttribute(key, attributes[key]);
 	}
}

function pushMessage(targetDiv, data){
	//console.log(data);
	if(typeof targetDiv === 'undefined' || typeof targetDiv.childNodes === 'undefined') return; // fix this bandaid later :D //

	var chatLine = document.createElement('div');
	chatLine.setAttribute('class', 'chatLine');
	chatLine.setAttribute('nick', data.nick);

	if(!data.isLastPoster) odd = !odd;
	if(odd) addClass(chatLine, 'odd');

	if(data.nick == '!'){
		addClass(chatLine, 'warn');
	}else if(data.nick == '*'){
		addClass(chatLine, 'info');
	}else if(data.nick == '<Server>'){
		addClass(chatLine, 'shout');
	}

	var leftSide = document.createElement('div');
	leftSide.setAttribute('class', 'leftSide');

	var tripDom = document.createElement('span');
	if(typeof data.trip !== 'undefined' && !data.isLastPoster){
		tripDom.innerHTML = data.trip;
		leftSide.appendChild(tripDom);
	}

	var nickDom = document.createElement('b');
	if(data.donator) addClass(nickDom, 'donator');
	if(typeof data.trip !== 'undefined') nickDom.style.cssText = 'color:' + tripToColor(data.trip);
	if(!data.isLastPoster) nickDom.innerHTML = data.nick;
	leftSide.appendChild(nickDom);
	chatLine.appendChild(leftSide);

	var rightSide = document.createElement('div');
	rightSide.setAttribute('class', 'rightSide');

	if(typeof data.text === 'undefined') data.text  = '';

	if(typeof data.mention !== 'undefined' && data.mention == true){
		addClass(rightSide, 'mention');
		if(!document.hasFocus()){
			notifyUser(data.text, data.nick, data.id);
		}
	}else if(data.text.indexOf("@*") != -1){
		addClass(rightSide, 'mention');
	}

	rightSide.innerHTML = data.text;

	var allowKatex = true; // change later //
	if(allowKatex && (data.text.match(/\$/g) || []).length >= 2){
		renderMathInElement(rightSide, {delimiters: [
			{left: "$$", right: "$$", display: true},
			{left: "$", right: "$", display: false},
		]});
	}

	chatLine.appendChild(rightSide);

	targetDiv.appendChild(chatLine);
}

function addClass(target, newClass){
	// setAttribute ~31% faster than classList.add() //
	target.setAttribute('class', target.getAttribute('class') + ' ' + newClass);
}

function removeClass(target, targetClass){
	// setAttribute ~31% faster than classList.add() //
	if(typeof target === 'undefined') return;
	target.setAttribute('class', target.getAttribute('class').replace(' ' + targetClass, ''));
}
