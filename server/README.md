

## CM2 panel Python software


This is a simple http web socket server that 

```console
$ python3 PanelServer.py
```

Web socket messages are in json format. When a new client connects, the server sends a message with the dimensions (in positive integer values) of the display. 

Example:

```
{
	"width" : 32,
	"height" : 32
}

Client messages to the server contain the bitmap of pixel values in hex format, and (optionally) the brightness level (an integer 0 to 15, inclusive) for the display. 0 brightness is the dimmest level, but is not totally dark.

Example:

```
{
	"frame" : "FFFFFFFF800000018000000180000001800000018000000180000001800000018000000180000001800000018000000180000001800000018000000180000001800000018000000180000001800000018000000180000001800000018000000180000001800000018000000180000001800000018000000180000001FFFFFFFF",
	"brightness" : 0
}
```

#configuration

You may need to edit the lines:

		self.host = "192.168.4.185"
		self.port = 13254

to your desired host and port names.