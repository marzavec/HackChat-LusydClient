/*
Description: listens for /invite & invites target user
*/

// setup module global vars //


// hook main code into client input //
modules.in.push(function(data){
  // ignore if incoming data is json or is not invite command //
  if(typeof data.cmd !== 'undefined' || data.split(' ')[0] != '/invite') return data;

  var cmdArray = data.split(' ');
  if(typeof cmdArray[1] === 'undefined' || cmdArray[1] == ''){
    warn({id: connectedChannels[currentChannel].id, text: 'Usage: /invite @nick'});
    return false;
  }

  // send invite //
  lusydEngine.sendInvite(cmdArray[1].replace('@', ''));

  // return false to stop data from being pushed to the server //
  return false;
});
