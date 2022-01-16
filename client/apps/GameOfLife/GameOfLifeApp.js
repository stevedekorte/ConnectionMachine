"use strict"

getGlobalThis().GameOfLifeApp = class GameOfLifeApp extends LedApp {
    constructor () {
        super()
        this.setFps(1/5)

        const frame = this.frame()
        this.frame().randomize()
        this.frame().mirrorLeftToRight()
        this.frame().mirrorTopToBottom()

        this.newSlot("nextFrame", new LedFrame())
        this.newSlot("hashHistory", [])
        this.newSlot("maxHistory", 1000)
        this.newSlot("rulesForOn", [0, 0, 1, 1, 0, 0, 0, 0, 0] ) // index is neightbor count (0 - 8), value (1 or 0) is next state
        this.newSlot("rulesForOff", [0, 0, 0, 1, 0, 0, 0, 0, 0] ) // index is neightbor count (0 - 8), value (1 or 0) is next state

        this.newSlot("minY", 0)
    }

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

    checkForLoop () {
        const hash = this.frame().hash()
        const matches = this.hashHistory().filter((h) => h == hash)
        const isInLoop = matches.length != 0

        this.hashHistory().push(hash)
        while (this.hashHistory().length > this.maxHistory()) {
            this._hashHistory.shift()
        }

        if (isInLoop) {
            this.reset()
        }
    }

    reset () {
        this.frame().randomize()
        this.frame().mirrorLeftToRight()
        this.frame().mirrorTopToBottom()
        this.clearHistory()
        //this.mutateRules()
    }

    clearHistory () {
        this._hashHistory = []
        return this
    }

    circularGetBit (x, y) {
        const frame = this.frame()
        const xmax = frame.width()
        const ymax = frame.height()
        const minY = this.minY()
        if (x < 0) {
            x = xmax + 1 + x
        }
        if (y < minY) {
            y = ymax + 1 + y
        }

        x = x % (xmax - 1)
        y = y % (ymax - 1 - minY)
        return frame.getBit(x, y)
    }

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

    step () {
        super.step()

        /*
        if (this.t() % 1000 === 0) {
            this.reset()
        }
        */

        const xmax = this.frame().width()
        const ymax = this.frame().height()

        const nextFrame = this._nextFrame
        const frame = this.frame()

        //this.renderRules()
        nextFrame.copy(frame)
        

        for (let x = 0; x < xmax; x++) {
            for (let y = this.minY(); y < ymax; y++) {
                const total = (
                    this.circularGetBit(x+0, y-1) + // top  
                    this.circularGetBit(x+0, y+1) + // bottom
                    this.circularGetBit(x-1, y+0) + // left
                    this.circularGetBit(x+1, y+0) + // right
                    this.circularGetBit(x-1, y-1) + // top left
                    this.circularGetBit(x-1, y+1) + // bottom left
                    this.circularGetBit(x+1, y-1) + // bottom right
                    this.circularGetBit(x+1, y+1)   // top right
                )

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

        this.checkForLoop()
    }
}
