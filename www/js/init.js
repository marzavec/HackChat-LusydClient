document.id = 'mainDocument';

if(Notification && Notification.permission !== "granted") Notification.requestPermission();

gui.init();

lusydEngine.init();

/*
// chat line click handler //
touchControl.bindEvent(window, 'touchend', function(event){
	if(touchControl.isScrolling){
		touchControl.isScrolling = false;
		return;
	}else if(touchControl.ignoreGlobal){
		touchControl.ignoreGlobal = false;
		return;
	}
	
	var currentNode = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
	var notFound = true;
	while(notFound){
		if(typeof currentNode === 'undefined' || currentNode == null) break;
		
		if(typeof currentNode.getAttribute !== 'undefined' && currentNode.getAttribute('class') != null && currentNode.getAttribute('class').split(' ')[0] == 'chatLine'){
			notFound = false;
			gui.popLineMenu(currentNode);
			break;
		}
		
		currentNode = currentNode.parentNode;
	}
});
*/