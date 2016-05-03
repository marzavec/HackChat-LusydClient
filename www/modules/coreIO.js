/*
Description: listens for /nick & adjusts nick accordingly
*/

// setup module global vars //
var isAfk = false;

// hook main code into module engine //
modules.in.push(function(data){
  // ignore if incoming data is json or is not afk command //
  if(typeof data.cmd !== 'undefined' || data.split(' ')[0] != '/nick') return data;

  var cmdArray = data.split(' ');
  if(typeof cmdArray[1] === 'undefined' || cmdArray[1] == ''){
    warn({id: connectedChannels[currentChannel].id, text: 'Usage: /nick newNick'});
    return data;
  }

  // run name change //
  lusydEngine.changeNick(cmdArray[1]);

  // return false to stop data from being pushed to the server //
  return false;
}
);


// setup module global vars //
var isAfk = false;

// add module
modules.io.push(function(data){
  if(typeof data.cmd !== 'undefined' || data.substr(0, 1) != '/') return data;

  var cmdArray = data.split(' ');
  cmdArray[0] = cmdArray[0].substr(1);

  switch(cmdArray[0]){
    case 'nick':
      if(typeof cmdArray[1] === 'undefined' || cmdArray[1] == ''){
        warn({id: connectedChannels[currentChannel].id, text: 'Usage: /nick newNick'});
        return data;
      }
      lusydEngine.changeNick(cmdArray[1]);

      return false;
    break;
    case 'afk':
      lusydEngine.changeNick('_afk', false, true);

      return false;
    break;
  }

  return data;
}
);
