#!/usr/bin/env python3


# example use:
#
#   keyboard = Keyboard()
#   keyboard.setDelegate(self)
#   keyboard.startListening()
#
# note: only instantiate once until this is made into a singleton


import sys
import select
import tty
import termios


class Keyboard(object):
    def __init__(self):
        self.buffer = []
        self.delegate = None # delegate will be sent onKey(char) event messages

    def setDelegate(self, obj):
        self.delegate = obj

    def hasData(self):
        return select.select([sys.stdin], [], [], 0) == ([sys.stdin], [], [])

    def startListening(self):
        self.old_settings = termios.tcgetattr(sys.stdin)
        tty.setcbreak(sys.stdin.fileno())
        #tty.setraw(sys.stdin.fileno(), when = termios.TCSAFLUSH)
        print("Keyboard listening")

    def stopListening(self):
        termios.tcsetattr(sys.stdin, termios.TCSADRAIN, self.old_settings)

    def getKeys(self):
        #sys.stdin.flush()
        if self.hasData():
            print("> ")
            while self.hasData():
                c = sys.stdin.read(1)
                self.onKey(c)
            print("<")
       #c = sys.stdin.read(1)
        #print("read:", c) 

    def onKey(self, c):
        if self.delegate:
            self.delegate.onKey(c)

        print("    c:", c)
        self.buffer.append(c)
        if c == '\x1b': 
            self.didEscape()

    def didEscape(self):
        pass
        #this.stopListening()

    def test(self):
        t = 0

        while True:
            keyboard.getKeys()
            if (t % 100000 == 0):
                print("t:", t)
            t = t + 1

#keyboard = Keyboard()
#keyboard.startListening()
#keyboard.test()

