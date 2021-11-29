"""
def import_module_by_path(path):
    name = os.path.splitext(os.path.basename(path))[0]                     
    # Python 3, after 3.4
    import importlib.util
    spec = importlib.util.spec_from_file_location(name, path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod
"""


from LedDisplay import LedDisplay
from LedFrame import LedFrame
from CA import CA
from Keyboard import Keyboard

import argparse
import time
#import timeit
from datetime import datetime
import math 


class LedApp:
    def __init__(self): # constructor method
        self.args = None
        self.parseArguments()
        self.delay = 1./float(self.args.fps)
        self.display = LedDisplay()
        self.display.ip = self.args.ip
        self.display.port = self.args.port
        self.display.setup()
        self.frame = LedFrame()
        self.keyboard = Keyboard()
        self.keyboard.setDelegate(self)
        self.keyboard.startListening()

    def onExit(self):
        self.keyboard.stopListening()

    def parseArguments(self):
        parser = argparse.ArgumentParser()
        parser.add_argument("--ip",
                            default="192.168.4.185",
                            help="The ip of the OSC server")
        parser.add_argument("--port",
                            type=int,
                            default=5005,
                            help="The port the OSC server is listening on")
        parser.add_argument("--brightness",
                            type=int,
                            default=1,
                            help="PWM brightness 0-15")
        parser.add_argument("--fps",
                            type=float,
                            default=30,
                            help="Frames per second")
        self.args = parser.parse_args()


    def beginFrame(self):
        self.startTime = datetime.now()

    def endFrame(self):
        self.display.setFrame(self.frame.asHexFrame())
        
        self.endTime = datetime.now()
        dt = self.endTime - self.startTime
        sleep = self.delay - float(dt.total_seconds())
        if sleep > 0: 
            pass
            time.sleep(sleep)
        self.keyboard.getKeys()


    def randomFrames(self):
        while True:
            self.beginFrame()
            self.frame.randomize()
            self.endFrame() # fps will determine speed

    def onKey(self, key):
        pass
        #print("LedApp.onKey(", key, ")")

    def run(self):
        pass
        #self.randomFrames()
        #self.display.clear()

#LedApp().run()