"use strict"

getGlobalThis().GameOfLifeApp = class GameOfLifeApp extends LedApp {
    constructor () {
        super()
        this.setFps(80)

        const frame = this.frame()
        frame.randomize()

        this.newSlot("nextFrame", new LedFrame())
        this.newSlot("hashHistory", [])
        this.newSlot("maxHistory", 100)
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
            this.frame().randomize()
            this.clearHistory()
        }
    }

    clearHistory () {
        this._hashHistory = []
        return this
    }

    step () {
        super.step()

        const xmax = this.frame().width()
        const ymax = this.frame().height()

        const nextFrame = this._nextFrame
        const frame = this.frame()

        //nextFrame.copy(frame)
        
        for (let x = 0; x < xmax; x++) {
            for (let y = 0; y < ymax; y++) {
                const total = (
                    frame.circularGetBit(x, (y-1) % ymax) + 
                    frame.circularGetBit(x, (y+1) % ymax) +
                    frame.circularGetBit((x-1) % xmax, y) + 
                    frame.circularGetBit((x+1) % xmax, y) +
                    frame.circularGetBit((x-1) % xmax, (y-1) % ymax) + 
                    frame.circularGetBit((x-1) % xmax, (y+1) % ymax) +
                    frame.circularGetBit((x+1) % xmax, (y-1) % ymax) + 
                    frame.circularGetBit((x+1) % xmax, (y+1) % ymax)
                    )
                //print(x, " ", y, " ", total)
    
                // Conway's rules
                if (frame.getBit(x, y) == 1) {
                    if ((total < 2) || (total > 3)) {
                        nextFrame.setBit(x, y, 0)
                        //nextFrame.setXorBit(x, y, 1)
                    }
                } else {
                    if (total === 3) {
                        nextFrame.setBit(x, y, 1)
                        //nextFrame.setXorBit(x, y, 1)
                    }
                }
            }
        }
        frame.copy(nextFrame)

        this.checkForLoop()
    }
}
