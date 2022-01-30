
# you may need to install:
# pip3 install websocket-server

import sys, getopt
import logging
from websocket_server import WebsocketServer

from Panel import Panel
import json

import socket


class PanelServer(object):
	def __init__(self):
		#self.host = "cm2.local"
		self.host = "192.168.4.185"
		self.port = 13254
		self.server = None
		self.isSecure = True
		self.panel = Panel()
		self.clientTally = 0
		self.setup()

	def setup ():
		hostName = socket.gethostname()
		hostIp = socket.gethostbyname(hostName)
		self.setHost(hostIp)

	def setIsSecure (aBoolean):
		this.isSecure = bool(aBoolean)

	def setHost (aString):
		self.host = aString

	def setPort (anInt):
		self.port = int(anInt)

	def run(self):
		print("running on host " + self.host + " and port " + str(self.port))

		if isSecure:
			server = WebsocketServer(host = self.host, port = self.port, loglevel = logging.ERROR, key="key.pem", cert="cert.pem", )
		else:
			server = WebsocketServer(host = self.host, port = self.port, loglevel = logging.ERROR)

		server.set_fn_new_client(lambda client, server : self.onClientConnect(client, server) )
		server.set_fn_client_left(lambda client, server : self.onClientDisconnect(client, server) )
		server.set_fn_message_received(lambda client, server, message : self.onClientMessage(client, server, message) )
		server.run_forever()
		self.server = server
		self.disableLogging()

	def disableLogging(self):
		logging.basicConfig(
			level=logging.DEBUG,
			format='%(asctime)s %(name)s %(levelname)-8s  %(message)s',
			datefmt='(%H:%M:%S)')
			
		# disable all loggers from different files
		logging.getLogger('asyncio').setLevel(logging.ERROR)
		logging.getLogger('asyncio.coroutines').setLevel(logging.ERROR)
		logging.getLogger('websockets.server').setLevel(logging.ERROR)
		logging.getLogger('websockets.protocol').setLevel(logging.ERROR)

	def onClientConnect(self, client, server):
		self.clientTally += 1
		client["id"] = str(self.clientTally)
		print("client " + client["id"] + " connected")
		self.sendClientMessage(client, "{ frame: { width: " + self.panel.width() + ", height: " + self.panel.height() + "} }")

	def onClientDisconnect(self, client, server):
		print("client " + client["id"] + " disconnected")
		
	def onClientMessage(self, client, server, message):
		#print("client " + client["id"] + " sent: '" + message + "'")
		dict = json.loads(message)
		#print("server received json: '" + str(dict) + "'")
		if self.panel:
			if "frame" in dict:
				self.panel.setHexFrame(dict["frame"])

			if "brightness" in dict:
				self.panel.setBrightness(dict["brightness"])

	
	def sendClientMessage(self, client, message):
		self.server.send_message(client, message)

	def sendAllClientsMessage(self, message):
		self.server.send_message_to_all(message)


def main(argv):
	help = 'PanelServer.py -host <hostname or address> -port <port number> -isSecure <true/false>'
	panelServer = PanelServer()

	try:
		opts, args = getopt.getopt(argv,"",["help", "host=","port=", "isSecure="])
	except getopt.GetoptError:
		print (help)
		sys.exit(2)

	for opt, arg in opts:
		if opt in ('-help'):
			print (help)
			sys.exit()
		elif opt in ("-host"):
			panelServer.setHost(arg)
		elif opt in ("-port"):
			panelServer.setPort(int(arg))
		elif opt in ("-isSecure"):
			panelServer.setIsSecure(arg == "true")
	panelServer.run()

if __name__ == "__main__":
	main(sys.argv[1:])