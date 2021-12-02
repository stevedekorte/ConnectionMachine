"""

"""

from LedApp import LedApp
from LedFrame import LedFrame


class Clear(LedApp):
    def __init__(self): # constructor method
        LedApp.__init__(self)


    def run(self):
        self.beginFrame()
        self.frame.clear()
        self.endFrame()



if __name__ == "__main__":
    app = Clear()
    app.run()

