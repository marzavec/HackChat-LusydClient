/*
Description: listens for /afk & adjusts nick accordingly. Auto reply if user is afk
*/

// setup module global vars //
var isAfk = false;
var afkMsg = 'lookup the term "afk"; then you\'ll understand why I\'m not replying. . .';

// hook main code into client input //
modules.in.push(function(data){
  // ignore if incoming data is json or is not afk command //
  if(typeof data.cmd !== 'undefined' || data.split(' ')[0] != '/afk') return data;

  // run name change //
  if(isAfk){
    lusydEngine.changeNick('_afk', false, false, true);
    isAfk = false;
  }else{
    lusydEngine.changeNick('_afk', false, true);
    isAfk = true;
  }

  // return false to stop data from being pushed to the server //
  return false;
});

// hook main code into server output //
modules.out.push(function(data){
  // ignore if incoming data is not json //
  if(typeof data === 'string' || typeof data.cmd === 'undefined') return data;

  // if afk & mentioned //
  if(typeof data.mention !== 'undefined' && data.mention == true && isAfk) lusydEngine.send({ cmd: 'chatTo', id: data.id, text: '@' + data.nick + ', ' + afkMsg});

  // return data anyway //
  return data;
});
