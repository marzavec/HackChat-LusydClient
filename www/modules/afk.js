/*
Description: listens for /afk & adjusts nick accordingly
*/

// setup module global vars //
var isAfk = false;

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
