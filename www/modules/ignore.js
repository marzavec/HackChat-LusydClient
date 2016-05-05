/*
Description: listens for /ignore & toggles ignoring user globally
             or current channel if specified
*/

// setup module global vars //


// hook main code into client input //
modules.in.push(function(data){
  // ignore if incoming data is json or is not ignore command //
  if(typeof data.cmd !== 'undefined' || data.split(' ')[0] != '/ignore') return data;

  var cmdArray = data.split(' ');
  if(typeof cmdArray[1] === 'undefined' || cmdArray[1] == ''){
    warn({id: connectedChannels[currentChannel].id, text: 'Usage: /ignore @nick'});
    return false;
  }

  // send ignore //
  var localOnly = (typeof cmdArray[2] !== 'undefined' && cmdArray[2] == 'local') ? true : false;
  lusydEngine.sendIgnore(cmdArray[1].replace('@', ''), localOnly);

  // return false to stop data from being pushed to the server //
  return false;
});
