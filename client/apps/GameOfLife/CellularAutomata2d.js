"use strict"

/*
    2d cellular automata

*/

getGlobalThis().CellularAutomata2d = class CellularAutomata2d extends Base {
    constructor () {
        super()
        this.newSlot("frame", new LedFrame())
        this.newSlot("nextFrame", new LedFrame())

        this.newSlot("rulesForOn", [0, 0, 1, 1, 0, 0, 0, 0, 0] ) // index is neightbor count (0 - 8), value (1 or 0) is next state
        this.newSlot("rulesForOff", [0, 0, 0, 1, 0, 0, 0, 0, 0] ) // index is neightbor count (0 - 8), value (1 or 0) is next state
        this.setupGameOfLifeRules()

        // keep history so we can reset if loop detected
        this.newSlot("hashHistory", [])
        this.newSlot("maxHistory", 1000)

        this.newSlot("width", null)
        this.newSlot("height", null)
        this.setWidth(32).setHeight(32) // make sure frames are correct size
        this.reset()
    }

    setWidth (v) {
        this.frame().setWidth(v)
        this.nextFrame().setWidth(v)
        this.reset()
        return this
    }

    setHeight (v) {
        this.frame().setHeight(v)
        this.nextFrame().setHeight(v)
        this.reset()
        return this
    }

    setupGameOfLifeRules () {
        this.setRulesForOn([0, 0, 1, 1, 0, 0, 0, 0, 0] ) 
        this.setRulesForOff([0, 0, 0, 1, 0, 0, 0, 0, 0] ) 
    }

    reset () {
        this.frame().randomize()
        this.frame().mirrorLeftToRight()
        this.frame().mirrorTopToBottom()
        this.clearHistory()
        //this.mutateRules()
    }

    // rules and mutation

    flipBitOnArray (anArray) {
        const i = Math.floor(Math.random() * anArray.length)
        anArray[i] = anArray[i] ? 0 : 1
    }

    mutateRules () {
        if (Math.random() < 0.5) {
            this.flipBitOnArray(this.rulesForOn())
        } else {
            this.flipBitOnArray(this.rulesForOff())
        }
    }

    randomizeRules () {
        let rules = this.rulesForOn()

        for (let i = 0; i < rules.length; i ++) {
            //const v = rules[i]
            rules[i] = Math.round(Math.random())
        }

        rules = this.rulesForOff()
        for (let i = 0; i < rules.length; i ++) {
            //const v = rules[i]
            rules[i] = Math.round(Math.random())
        }
    }

    // history and loop detection

    checkForLoop () {
        const hash = this.frame().hash()
        const matches = this.hashHistory().filter((h) => h == hash)
        const isInLoop = matches.length != 0

        this.hashHistory().push(hash)
        while (this.hashHistory().length > this.maxHistory()) {
            this.hashHistory().shift()
        }

        return isInLoop
    }


    clearHistory () {
        this.setHashHistory([])
        return this
    }

    // render

    /*
    renderRules () {
        const xmax = this.frame().width()
        const ymax = this.frame().height()
        const frame = this.frame()
        let x = 0

        for (let y = 0; y < this.minY(); y++) {
            for (x = 0; x < xmax; x++) {
                frame.setBit(x, y, 0); 
            }
        }

        x = 5

        frame.setBit(x, 0, 1); x++

        this.rulesForOn().forEach(v => {
            frame.setBit(x, 0, v)
            x++
        })
        frame.setBit(x, 0, 1); x++
        frame.setBit(x, 0, 0); x++
        frame.setBit(x, 0, 0); x++
        frame.setBit(x, 0, 1); x++
        this.rulesForOff().forEach(v => {
            frame.setBit(x, 0, v)
            x++
        })
        frame.setBit(x, 0, 1); x++
    }
    */

    step () {
        const xmax = this.frame().width()
        const ymax = this.frame().height()

        const nextFrame = this.nextFrame()
        const frame = this.frame()

        //this.renderRules()
        //nextFrame.copy(frame)
        nextFrame.clear()
        //frame.testCircular()

        //frame.assertValid()
        //nextFrame.assertValid()
        
        for (let y = 0; y < ymax; y++) {
            for (let x = 0; x < xmax; x++) {
                const top = frame.circularGetBit(x+0, y-1)
                const bottom = frame.circularGetBit(x+0, y+1) 
                const left = frame.circularGetBit(x-1, y+0) 

                if ( typeof (left) == 'undefined') {
                    //throw new Error("non leftbit found")
                    frame.circularGetBit(x-1, y+0) 
                }
                const right = frame.circularGetBit(x+1, y+0) 
                const topLeft = frame.circularGetBit(x-1, y-1) 
                const bottomLeft = frame.circularGetBit(x-1, y+1) 
                const bottomRight = frame.circularGetBit(x+1, y-1) 
                const topRight = frame.circularGetBit(x+1, y+1) 
                
                const total = top + bottom + left + right + topLeft + bottomLeft + bottomRight + topRight

                if (Number.isNaN(total)) {
                    throw new Error("non bit found")
                }

                // Conway's rules
                if (frame.getBit(x, y) == 1) {
                    const nextState = this.rulesForOn()[total]
                    nextFrame.setBit(x, y, nextState)
                } else {
                    const nextState = this.rulesForOff()[total]
                    nextFrame.setBit(x, y, nextState)
                }
            }
        }
        frame.copy(nextFrame)

        //frame.assertValid()
        //nextFrame.assertValid()

        if (this.checkForLoop()) {
            this.reset()
        }
    }

    runUntilLoopDetection () { 
        // WARNING: this might not return soon!
        while(!this.checkForLoop()) {
            this.setup()
        }
    }
}
