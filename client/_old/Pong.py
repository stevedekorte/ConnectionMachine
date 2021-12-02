"""

"""

from LedApp import LedApp


class LedAppLife(LedApp):
    def __init__(self): # constructor method
        LedApp.__init__(self)

    def run(self):
        bits = self.frame.bits

        xmax = 31
        ymax = 31
        x = 1
        y = 0
        xv = 3/2
        yv = 5/2
        
        bounceValue = 0
        while True:

            self.beginFrame()
            lastx = x
            lasty = y

            self.frame.setBit(lastx, lasty, 0)

            x = x + xv
            y = y + yv
            #if (yv < 0):
            #    yv = yv - 0.5

            if x > xmax:
                x = xmax
                xv = self.bounce(xv)
                bounceValue = 15

            if x < 0:
                x = 0
                xv = self.bounce(xv)
                bounceValue = 15

            if y > ymax:
                y = ymax
                yv = self.bounce(yv)
                bounceValue = 15

            if y < 0:
                y = 0
                yv = self.bounce(yv)
                bounceValue = 15

            self.display.setBrightness(int(bounceValue))

            if bounceValue > 0:
                bounceValue *= 0.6
                if bounceValue < 1:
                    bounceValue = 0

            self.frame.setBit(x, y, 1)
            self.endFrame()


if __name__ == "__main__":
    app = Pong()
    app.run()

