"""

"""

from LedApp import LedApp


class Waves(LedApp):
    def __init__(self): # constructor method
        LedApp.__init__(self)

    def run(self):
        frame = self.frame
        xmax = self.display.xmax
        ymax = self.display.ymax
        self.display.setBrightness(0)
        t = 0
        while True:
            self.beginFrame()
            frame.clear()
            for x in range(xmax):
                xr = ((x/xmax) - 0.5) * 2 * math.pi * 2 
                v = math.cos(xr )*0.5*math.cos(t/20)*math.cos(t/10)
                #v = (v+1)/2 # 0 to 1
                #v *= math.sin(t/10)
                y = (v*ymax/2) + (ymax/2)
                #print("x:", x, " v:", v, " y:", int(y))
                frame.setBit(x, y, 1)
            t += 1
            self.endFrame()


if __name__ == "__main__":
    app = Waves()
    app.run()

