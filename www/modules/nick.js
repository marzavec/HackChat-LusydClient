/*
Description: listens for /nick & adjusts nick accordingly
*/

// setup module global vars //


// hook main code into client input //
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
});
