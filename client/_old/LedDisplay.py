"""Small example OSC client
"""

from pythonosc import osc_message_builder
from pythonosc import udp_client

from CA import CA

class LedDisplay:
    def __init__(self): # constructor method
        self.xmax = 32
        self.ymax = 32
        self.ip = None
        self.port = None

    def setup(self):
        self.client = udp_client.SimpleUDPClient(self.ip, self.port)

    def setBrightness(self, b): # 0 to 15
        self.client.send_message("/bright", b)

    def setFrame(self, hexFrame): # 256 hex chars
        self.client.send_message("/hexframe", hexFrame)
