
import random
#import secrets
import math

class LedFrame:
    def __init__(self): # constructor method
        self.xmax = 32
        self.ymax = 32
        self.bits = [0] * self.ledCount()
        #self.initBits()

    def initBits(self):
        return [0] * self.ledCount()

    def clear(self):
        self.setAllBitsTo(0)

    def setAllBitsTo(self, b):
        count = self.ledCount()
        for i in range(count): 
            self.bits[i] = b

    def ledCount(self):
        return self.xmax * self.ymax

    def randomize(self):
        count = self.ledCount()
        for i in range(count): 
            self.bits[i] = random.randint(0, 1) #* random.randint(0, 1)*random.randint(0, 1)* random.randint(0, 1)

    def randomizeBit(self, x, y):
        i = self.index_for_xy(x, y)
        self.bits[i] = random.randint(0, 1)

    def addOneRandomOnBit(self):
        i = random.randrange(0, self.ledCount())
        self.bits[i] = random.randint(0, 1)

    def asHexFrame(self):
        bits = self.bits
        hexChunks = [] 
        bitChunks = []
        for n in range(int(len(bits)/4)): 
            index = n * 4
            chunk = bits[index:index+4]
            s = "".join(map(str, chunk))
            number = int(str(s),2)

            hexChunk = format(number, 'x')
            hexChunks.append(hexChunk)
        out = "".join(hexChunks)
        #print("out: ", out)
        return out

    # --- xy utility methods ---

    def index_for_xy(self, x, y):
        index = (int(x)*self.xmax) + int(y)
        return index

    def getBitAtIndex(self, i): # returns 1 or 0
        return self.bits[i] 

    def setBitAtIndex(self, i, v): # v should be 1 or 0
        return self.bits[i] 

    def getBit(self, x, y):
        i = self.index_for_xy(x, y)
        return self.bits[i] 

    def flipBit(self, x, y):
        i = self.index_for_xy(x, y)
        if self.bits[i] == 0:
            self.bits[i] = 1
        else:
            self.bits[i] = 0

    def setBit(self, x, y, v):
        i = self.index_for_xy(x, y)
        self.bits[i] = v

    def setXorBit(self, x, y, v):
        i = self.index_for_xy(x, y)
        cv = self.bits[i]
        self.bits[i] = int(bool(v) ^ bool(cv)) 

    def copy(self, frame):
        self.bits[:] = frame.bits[:]

    def compositeAndOpFrame(self, frame):
        bits1 = self.bits
        bits2 = frame.bits
        size = len(bits1)
        for i in range(size):
            bits1[i] = int(bool(bits1[i]) and bool(bits2[i]))
        
    def compositeOrOpFrame(self, frame):
        bits1 = self.bits
        bits2 = frame.bits
        size = len(bits1)
        for i in range(size):
            bits1[i] = int(bool(bits1[i]) or bool(bits2[i]))
        
    def compositeXorOpFrame(self, frame):
        bits1 = self.bits
        bits2 = frame.bits
        size = len(bits1)
        for i in range(size):
            bits1[i] = int(bool(bits1[i]) ^ bool(bits2[i]))


    def drawFromTo(self, x1, y1, x2, y2):
        x = x1
        y = y1
        d = math.sqrt(math.pow(x1 - x2, 2) + math.pow(y1 - y2, 2))
        for n in range(int(d)):
            x = int(x1 + (x2 - x1)*n/d)
            y = int(y1 + (y2 - y1)*n/d)
            self.setBit(x, y, 1)

        
