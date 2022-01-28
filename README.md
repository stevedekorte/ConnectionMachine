# cm2.fun
Open hardware design files and code for ht1632c + rPI driven 32x32 LED display wall art project inspired by the Connection Machine super computer.

Display runs an rPI with a small websocket python server that accepts new frames. 
Client is written in Javascript and runs in-browser. 
Several demo apps are included in the /client/apps folder.

For example, try opening: 

	client/apps/CellularAutomata/index.html
	
It will run the similutor in the browser, even if it can't talk to the LED display.

See docs folder for more details, if you'd like to build your own.
