import random
import time

class CA(object):
    def __init__(self):
        # interesting rules sets
        # 00111110
        # 10100001
        # 00001111
        # 01001001
        # 01111100
        # 10010010
        # 01101010
        # 00011110


        self.width = 32
        self.rules = [
            [1, 1, 1, 0],
            [1, 1, 0, 1],
            [1, 0, 1, 0],
            [1, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 1, 0, 1],
            [0, 0, 1, 1],
            [0, 0, 0, 1]
        ]
        
        self.randomizeRules()
        self.cells = [0] * self.width
        self.restart()


    def ruleString(self):
        parts = []
        for i in range(len(self.rules)):
            parts.append(str(self.rules[i][3]))
        return "".join(parts)


    def randomizeRules(self):
        for i in range(len(self.rules)):
            rule = self.rules[i]
            rule[3] = random.randint(0, 1)
        self.genRuleDict()

    def mutateRules(self):
        i = random.randint(0, len(self.rules)-1)
        rule = self.rules[i]
        if rule[3] == 1:
            rule[3] = 0
        else:
            rule[3] = 1
        self.genRuleDict()

    def flipCellAt(self, i):
        if self.cells[i] == 1:
            self.cells[i] = 0
        else:
            self.cells[i] = 1

    def genRuleDict(self):
        self.rulesDict = {}
        for i in range(len(self.rules)):
            rule = self.rules[i]
            key = self.keyForSet(rule)
            v = rule[3]
            self.rulesDict[key] = v
            #print("rule ", rule, " key ", key, " value ", v)
        #print("ruleSet: ", self.ruleString())

    def keyForSet(self, set):
        #return str(set[0:3]) #str(set[0]) + str(set[1]) + str(set[2]) # for debugging
        return set[0] + set[1]*2 + set[2]*4

    def restart(self):
        self.generation = 0
        self.cells = [0] * self.width
        self.randomizeCells()

    def randomizeCells(self):
        for i in range(self.width):
            self.cells[i] = random.randint(0, 1) *random.randint(0, 1) #*random.randint(0, 1)

    def mutateCells(self):
        for i in range(self.width):
            r = random.randint(0, 1) *random.randint(0, 1) *random.randint(0, 1)
            if r:
                self.flipCellAt(i)
    
    def generate(self):
        xmax = len(self.cells)
        nextgen = [0] * xmax
        for i in range(xmax):
            left  = self.cells[(i - 1) % xmax]
            me    = self.cells[(i + 0) % xmax]
            right = self.cells[(i + 1) % xmax]
            set = [left, me, right]
            key = self.keyForSet(set)
            v = self.rulesDict[key]
            #print("set ", set, " key ", key, " value ", v)
            nextgen[i] = v
        self.cells = nextgen
        self.generation += 1




    
