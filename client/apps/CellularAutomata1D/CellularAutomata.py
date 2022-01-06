"""

"""

from LedApp import LedApp
from CA import CA
import time


class CellularAutomata(LedApp):
    def __init__(self): # constructor method
        LedApp.__init__(self)

    def run(self):
        ca = CA()
        xmax = 32
        ymax = 32
        frame = self.frame
        while True:
            self.display.setBrightness(0)
            for i in range(3):
                self.beginFrame()
                for y in range(ymax):
                    ca.generate()

                    if (ca.generation % 8 == 0):
                        #ca.randomizeRules()
                        ca.mutateRules()
                    if (ca.generation % 32 == 1):
                        #ca.randomizeCells()
                        ca.mutateCells()


                    for x in range(xmax):
                        frame.setBit(x, y, ca.cells[x])
                        #frame.setXorBit(x, y, ca.cells[x])
                
                    for x in range(xmax):
                        ca.cells[x] = frame.getBit(x, y)
                        #print("frame:", frame.bits)
                self.endFrame()
            self.display.setBrightness(1)
            #time.sleep(5)


if __name__ == "__main__":
    app = CellularAutomata()
    app.run()

