document.id = 'mainDocument';

if(Notification && Notification.permission !== "granted") Notification.requestPermission();

gui.init();

window.onfocus = function() {
  unreadCount = 0;
  document.title = "Lusyd Client";
  gui.chatInput.focus();
}

lusydEngine.init();

timeoutEngine.init();
