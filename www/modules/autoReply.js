/*
Description: listens for /nick & adjusts nick accordingly
*/

// setup module global vars //


// hook main code into server output //
modules.out.push(function(data){
  // ignore if incoming data is not json //
  if(typeof data === 'string' || typeof data.cmd === 'undefined') return data;

  // run name change //
  if(typeof data.mention !== 'undefined' && data.mention == true && isAfk) lusydEngine.send({ cmd: 'chatTo', id: data.id, text: '@' + data.nick + ', lookup the term "afk"; then you\'ll understand why I\'m not replying. . .'});

  if(typeof data.cmd !== 'undefined' && data.cmd == 'chat'){
    if(data.text == 'ping' && !data.isMe) lusydEngine.send({ cmd: 'chatTo', id: data.id, text: '@' + data.nick + ', pong. . .'});
  }

  // return data anyway //
  return data;
});
