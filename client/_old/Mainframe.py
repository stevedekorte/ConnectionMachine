"""

"""

from LedApp import LedApp
from LedFrame import LedFrame
import random

class Mainframe(LedApp):
    def __init__(self): # constructor method
        LedApp.__init__(self)
        mask = LedFrame()
        d = 4
        for x in range(mask.xmax):
            for y in range(mask.ymax):
                #v = x > 1 and x < mask.xmax - 1 and y > 1 and y < mask.ymax - 1 and x % 8 != 0 and y % 8 != 0
                #v = x % d != 0 and (x-1) % d != 0 and (x+1) % d != 0
                v = x > 1 and x < mask.xmax - 2
                v = v and y % d != 0 and (y-1) % d != 0 and (y+1) % d != 0
                mask.setBit(x, y, v)
                #print(x, y, v)
        self.mask = mask
        self.frame.randomize()

    def run(self):
        t = 0
        frame = self.frame
        while True:
            self.beginFrame()

            """
            changeChance = 0
            for x in range(frame.xmax):
                for y in range(frame.ymax):
                    r = random.random()
                    if r < changeChance:
                        frame.randomizeBit(x, y)
            """

            for i in range(10):
                frame.addOneRandomOnBit()

            frame.compositeAndOpFrame(self.mask)
            self.endFrame()
            t = t + 1

"""
    def run_old(self):
        t = 0
        xmax = 32
        ymax = 32
        while True:
            self.beginFrame()

            for x in range(xmax): 
                for y in range(ymax): 
                    xx = (x - xmax/2)
                    yy = (y - ymax/2)
                    noise = random.uniform(0.0, 1.0)/4
                    #r = (1 + Math.sin((xx*10 - y )*t/10)) / 2 + noise
                    r1 = (1 + math.sin((y*800 + noise - x/8)/2 + t/10)) / 2 - noise
                    r2 = (1 + math.sin((x*1400 + noise - y/8)/2 + t/10)) / 2 - noise
                    r3 = (1 + math.sin((x + noise + y)/2 + t/10)) / 2 - noise
                    r = (r3+r2)/2
                    nextState = 0
                    nextState = int(r < 0.5)

                    currentState = self.frame.getBit(x, y)

                    v= int( bool(nextState) ^ bool(currentState) )
                    self.frame.setBit(x, y, v)


            self.endFrame()
            t = t + 1

    def run2(self):
        frame = self.frame
        t = 1
        xmax = 32
        ymax = 32
        while True:
            n = 0
            self.beginFrame()
            for x in range(xmax): 
                for y in range(ymax):
                    #v = n % (1 + t % 150)
                    i = 1 + (t % 32)
                    v1 = (x % i + y % i) % 2
                    v2 = (n % (x+1) + y % i) % 2
                    v = int(v1 and v1)
                    frame.setBit(x, y, v2)
                    n = n + 2

            self.endFrame()
            t = t + 1
"""

if __name__ == "__main__":
    app = Mainframe()
    app.run()



