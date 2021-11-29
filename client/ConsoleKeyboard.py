'''
what i thought:
- input() in another thread
- that were filling a global strings list
- strings are being popped in the main thread
'''

import threading
import time



class ConsoleKeyboard(object):
    def __init__(self):
        self.consoleBuffer = []

    def start(self):
        self.thread = threading.Thread(target=self.consoleInput, args=(self, )).start() # start the thread
        self.watch()

    def consoleInput(self, other):
        while True:
            print("-got input-")
            self.consoleBuffer.append(input())
            print("-got input 2-")


    def watch(self):
        while True:
            time.sleep(1) # avoid 100% cpu
            print("---")
            while self.consoleBuffer:
                print("input:", repr(consoleBuffer.pop(0)))



consoleKeyboard = ConsoleKeyboard()
consoleKeyboard.start()

"""
try:
  # do whatever
except KeyboardInterrupt:
  print('cancelled by user') or exit() # overload
"""