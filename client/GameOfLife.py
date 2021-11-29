"""

"""

from LedApp import LedApp
from LedFrame import LedFrame


class GameOfLife(LedApp):
    def __init__(self): # constructor method
        LedApp.__init__(self)


    def run(self):
        xmax = 32
        ymax = 32
        t = 0
        nextFrame = LedFrame()
        frame = self.frame
        frame.randomize()
        nextFrame.copy(frame)
        while True:
            self.beginFrame()
            changes = 0
            for x in range(xmax):
                for y in range(ymax):
                    total = (
                        frame.getBit(x, (y-1) % ymax) + 
                        frame.getBit(x, (y+1) % ymax) +
                        frame.getBit((x-1) % xmax, y) + 
                        frame.getBit((x+1) % xmax, y) +
                        frame.getBit((x-1) % xmax, (y-1) % ymax) + 
                        frame.getBit((x-1) % xmax, (y+1) % ymax) +
                        frame.getBit((x+1) % xmax, (y-1) % ymax) + 
                        frame.getBit((x+1) % xmax, (y+1) % ymax)
                        )
                    #print(x, " ", y, " ", total)
        
                    # Conway's rules
                    if frame.getBit(x, y) == 1:
                        if (total < 2) or (total > 3):
                            nextFrame.setBit(x, y, 0)
                            #changes = changes + 1
                            #print("did change 1 ", changes)
                    else:
                        if total == 3:
                            nextFrame.setBit(x, y, 1)
                            #changes = changes + 1
                            #print("did change 2 ", changes)


            self.endFrame()

            t = t + 1

            #if changes < 10:
            #    print("addOneRandomOnBit")
            #    nextFrame.addOneRandomOnBit()
            #    nextFrame.randomize()
            frame.copy(nextFrame)


if __name__ == "__main__":
    app = GameOfLife()
    app.run()

