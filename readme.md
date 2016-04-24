# Overview
_Current build isn't very user friendly due to some ui functions missing!_
Lusyd is a chat client / bouncer for WebSocket based chat rooms like Hack.Chat.
There are a few chat clients floating around, however I did not find any that met the feature list I was looking for. So, coders going to code, Lusyd was the outcome. Features, check box indicates current implementation:


- [x] *Browser Based*, connect to the client through any device with a browser.
- [x] *Persistance*, access the client from multiple locations with out creating new connections. Channels can be connected with default credentials or new ones.
- [x] *Multi "Socket"*, one browser tab, several channels & the ability to connect to more & close them.
- [x] *Enhanced UI Features*, notifications, easy to read alternating line colors, etc.
- [x] *Message Caching*, in the spirit of Hack.Chat, no logs are made- however chat data is cached to memory so when you jump from one device / location to another; you won't miss anything.
- [ ] *Client Timeout*, left the client open at work? Don't worry about your coworkers messing around under your name, the client will securely close if the mouse hasn't moved. They can also be force closed remotely.
- [x] *Module Based*, mutate the protocal, output or input using modules. Found a new server you want to connect to? No lengthy recoding needed; just make a new module. Text effects? Module.
- [x] *Secure*, to use the client; you'll need to enter credentials. (Security needs to be made better, its bare bones atm)
- [x] *Logging*, log security events, errors, etc.
- [ ] *Quick Nick Change*, quickly change nick across all channels; Marzavec -> afk_Marzavec
- [ ] *LaTeX*, of course




UI partially developed & based off of work from designs made by @ToastyStoemp




# Usage
Lusyd is designed to be run on a vps. It can also be run on your home machine with port forwarding.

Prerequisites:

	- Install Node.js ( [https://nodejs.org/](https://nodejs.org/) )
	
	- Until a package.json is generated, you'll need to run: npm install ws http




Clone Git, modify config & initialize:

	* `git clone [URL]`
	* edit: \HackChat-LusydClient\config\mainConfig.js
	* `cd HackChat-LusydClient`
	* `node main.js`
	* point your favorite browser (Chrome) to `http://your.domain.or.ip:6161/` (This port can be changed in mainConfig)
	* enter the username and password set in mainConfig (clientUser & clientPass)
	* the client will intialize and connect to the first room listed in \HackChat-LusydClient\www\js\clientConfig.js




#To-do:
	Add scrolling support
	Finish Menus:
		Close connection
		Alt-Open connection
		Change style
		Invite user
		Ignore user
		AFK / change nick
	
	Module IO support (protocal is done)
	Client timeout
	Client tracking / force close
	View image (litebox style)
	Url support
	Newline fix
	Channel url support
	Change nick / away
	Add LaTeX
	Click notifiction -> show channel & Chat event count; "(3)"
	Add "atelier-dune" css
