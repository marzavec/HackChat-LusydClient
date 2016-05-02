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
