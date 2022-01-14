"use strict"

console.log("CA")

getGlobalThis().CA = class CA extends Base {
    constructor() {
        super()
        // interesting rules sets
        // 00111110
        // 10100001
        // 00001111
        // 01001001
        // 01111100
        // 10010010
        // 01101010
        // 00011110


        this._width = 32
        this._rules = [
            [1, 1, 1, 0],
            [1, 1, 0, 1],
            [1, 0, 1, 0],
            [1, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 1, 0, 1],
            [0, 0, 1, 1],
            [0, 0, 0, 1]
        ]

        this._generation = 0

        this.randomizeRules()
        this._cells = new Array(this._width)
        this.restart()
    }

    generation() {
        return this._generation
    }

    cells () {
        return this._cells
    }

    ruleString() {
        const parts = []
        for (let i = 0; i < this._rules.length; i++) {
            parts.append(str(this._rules[i][3]))
        }
        return parts.join("")
    }

    randomizeRules() {
        for (let i = 0; i < this._rules.length; i++) {
            const rule = this._rules[i]
            rule[3] = Math.round(Math.random())
        }
        this.genRuleDict()
    }

    mutateRules() {
        const i = Math.floor(Math.random() * this._rules.length)
        const rule = this._rules[i]
        if (rule[3] == 1) {
            rule[3] = 0
        } else {
            rule[3] = 1
        }
        this.genRuleDict()
    }

    flipCellAt(i) {
        if (this._cells[i] == 1) {
            this._cells[i] = 0
        } else {
            this._cells[i] = 1
        }
    }

    genRuleDict() {
        this._rulesDict = {}
        for (let i = 0; i < this._rules.length; i++) {
            const rule = this._rules[i]
            const key = this.keyForSet(rule)
            const v = rule[3]
            this._rulesDict[key] = v
            //print("rule ", rule, " key ", key, " value ", v)
        }
        //print("ruleSet: ", this.ruleString())
    }

    keyForSet(set) {
        //return str(set[0:3]) //str(set[0]) + str(set[1]) + str(set[2]) // for debugging
        return set[0] + set[1] * 2 + set[2] * 4
    }

    restart() {
        this._generation = 0
        this._cells = new Array(this._width)
        this.randomizeCells()
    }

    randomizeCells() {
        for (let i = 0; i < this._width; i++) {
            this._cells[i] = Math.round(Math.random() * Math.random())
        }
    }

    mutateCells() {
        for (let i = 0; i < this._width; i++) {
            const r = Math.round(Math.random() * Math.random() * Math.random())

            if (r) {
                this.flipCellAt(i)
            }
        }
    }

    cellValueAt (i) {
        let xmax = this._cells.length
        if (i < 0) { 
            i = xmax + 1 + i 
        }
        if (i > xmax - 1) { 
            i = i % xmax 
        }

        return this._cells[i] ? 1 : 0
    }

    generate() {
        let xmax = this._cells.length
        const nextgen = new Array(xmax)
        for (let i = 0; i < xmax; i++) {
            const left  = this.cellValueAt(i - 1)
            const me    = this.cellValueAt(i + 0)
            const right = this.cellValueAt(i + 1) 
            const set = [left, me, right]
            const key = this.keyForSet(set)
            const v = this._rulesDict[key]
            //print("set ", set, " key ", key, " value ", v)
            nextgen[i] = v
        }
        this._cells = nextgen
        this._generation += 1
    }
}





