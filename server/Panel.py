"""
layer over ht1632c to help with sizing and rotation
"""
import sys
import argparse
import math
import ht1632c
import time


class Panel(object): 
    def __init__(self):
        self.NUM_PANELS = 1
        # defult to flip vertical and rotate so origin is at top left. 
        self.PANEL_ROTATION = 3
        self.WIDTH = self.NUM_PANELS * 32
        self.HEIGHT = 32
        #self.parseArgs()
        self.h = ht1632c.HT1632C(self.NUM_PANELS, self.PANEL_ROTATION)

    def width (self):
        return this.WIDTH
    
    def height (self): 
        return this.HEIGHT
        
    def setHexFrame(self, frame_data):
        self.h.hexframe(frame_data)
        self.h.sendframe()
        
    def clear(self, data):
        self.h.clear()
        self.h.sendframe()

    def setBrightness(self, value): # value should be integer 0 to 15
        if value < 0:
            value = 0
        if value > 15:
            value = 15
        self.h.pwm(value)

"""
    def parseArgs(self)

        args = parser.parse_args()

        if args.swap_xy:
            self.PANEL_ROTATION = PANEL_ROTATION - 1
        if args.flip_vertical:
            self.PANEL_ROTATION = PANEL_ROTATION - 2
        if args.flip_horizontal:
            self.PANEL_ROTATION = PANEL_ROTATION + 4


        parser = argparse.ArgumentParser()
        parser.add_argument("--ip",
                            default="127.0.0.1", help="The ip to listen on")
        parser.add_argument("--port",
                            type=int, default=5005, help="The port to listen on")
        parser.add_argument("--flip_horizontal",
                            help="reverse horizontal direction, x=0 is at right",
                            action="store_true")
        parser.add_argument("--swap_xy",
                            help="swap x and y directions, y is horizontal, x is vertical",
                            action="store_true")
        parser.add_argument("--flip_vertical",
                            help="reverse vertical direction, y=0 is at bottom",
                            action="store_true")
"""