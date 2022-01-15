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


        this.newSlot("width", 32)

        // rules  
        // first 3 bits is are state of previous left, middle, and right bits
        // last bit is for new state

        this.newSlot("rules", [
            [0, 0, 0, 1], // 0
            [0, 0, 1, 1], // 1 // mirrors 4
            [0, 1, 0, 1], // 2 
            [0, 1, 1, 0], // 3 // mirrors 6
            [1, 0, 0, 0], // 4  // mirrors 1
            [1, 0, 1, 0], // 5  
            [1, 1, 0, 1], // 6  // mirrors 3
            [1, 1, 1, 0]  // 7
        ])

        this.newSlot("doesEnforceSymmetry", true)

        /*
        this.newSlot("symmetries", [
            [1, 4], [3, 6]
        ])
        */

        this.newSlot("generation", 0)

        this.randomizeRules()
        this.newSlot("cells", new Array(this.width()))
        this.restart()
    }

    enforceRuleSymmetries () {
        const rules = this.rules()

        console.log("ruleString 1: ", this.ruleString())

        rules[4][3] = rules[1][3]
        rules[6][3] = rules[3][3]

        console.log("ruleString 2: ", this.ruleString())

        /*
        this.symmetries().forEach((sym) => {
            const i1 = sym[0]
            const v = this.cells()[i1]
            for (let ri = 1; ri < this.
                rules[
        })
        */
    }

    ruleString() {
        let s = ""
        for (let i = 0; i < this._rules.length; i++) {
            s += this._rules[i][3]
        }
        return s
    }

    enforceCellStateSymmetry () {
        const cells = this.cells()
        for (let i = 0; i < cells.length - 1; i++) {
            cells[i] = cells[cells.length - 1 - i]
        }
        return this
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
        
        if (this.doesEnforceSymmetry()) {
            this.enforceRuleSymmetries()
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
            this._cells[i] = Math.round(Math.random())
            //this._cells[i] = Math.round(Math.random() * Math.random())
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





