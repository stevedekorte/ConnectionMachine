
# you may need to install:
# pip3 install websocket-server

import logging
from websocket_server import WebsocketServer

from Panel import Panel
import json


class PanelServer(object):
	def __init__(self):
		self.host = "127.0.0.1"
		self.port = 13254
		self.server = None
		self.panel = None
		self.setupPanel()

	def setupPanel(self):
		#self.panel = Panel()


	def run(self):
		server = WebsocketServer(host = self.host, port = self.port, loglevel = logging.INFO)
		server.set_fn_new_client(lambda client, server : self.onClientConnect(client, server) )
		server.set_fn_client_left(lambda client, server : self.onClientDisconnect(client, server) )
		server.set_fn_message_received(lambda client, server, message : self.nClientMessage(client, server, message) )
		server.run_forever()
		self.server = server

	def onClientConnect(self, client, server):
		self.server.send_message_to_all("client connected")

	def onClientDisconnect(self, client, server):
		print("client left")
		
	def onClientMessage(self, client, server, message):
		data = json.loads(message)
		#print("server received message: '" + message + "'")
		print("server received json: '" + data + "'")
		if data.frame:
			self.panel.setHexFrame(data.frame)
		if data.brightness is not None:
			self.panel.setBrightness(ata.brightness)

	
	def sendClientMessage(self, client, message):
		self.server.send_message(client, message)

	def sendAllClientsMessage(self, message):
		self.server.send_message_to_all(message)


if __name__ == "__main__":
	panelServer = PanelServer()
	panelServer.run()