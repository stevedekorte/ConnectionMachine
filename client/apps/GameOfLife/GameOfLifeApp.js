"use strict"

window.GameOfLifeApp = class GameOfLifeApp extends LedApp {
    constructor () {
        super()
        this.setFps(120)

        const frame = this.frame()
        frame.randomize()

        this._nextFrame = new LedFrame()
        this._hashHistory = []
        this._maxHistory = 100
    }

    checkForLoop () {
        const hash = this.frame().hash()
        const matches = this._hashHistory.filter((h) => h == hash)
        const isInLoop = matches.length != 0

        this._hashHistory.push(hash)
        while (this._hashHistory.length > this._maxHistory) {
            this._hashHistory.shift()
        }

        if (isInLoop) {
            this.frame().randomize()
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
        
        let changes = 0
        for (let x = 0; x < xmax; x++) {
            for (let y = 0; y < ymax; y++) {
                const total = (
                    frame.getBit(x, (y-1) % ymax) + 
                    frame.getBit(x, (y+1) % ymax) +
                    frame.getBit((x-1) % xmax, y) + 
                    frame.getBit((x+1) % xmax, y) +
                    frame.getBit((x-1) % xmax, (y-1) % ymax) + 
                    frame.getBit((x-1) % xmax, (y+1) % ymax) +
                    frame.getBit((x+1) % xmax, (y-1) % ymax) + 
                    frame.getBit((x+1) % xmax, (y+1) % ymax)
                    )
                //print(x, " ", y, " ", total)
    
                // Conway's rules
                if (frame.getBit(x, y) == 1) {
                    if ((total < 2) || (total > 3)) {
                        nextFrame.setBit(x, y, 0)
                    }
                } else {
                    if (total === 3) {
                        nextFrame.setBit(x, y, 1)
                        changes ++
                    }
                }
            }
        }
        frame.copy(nextFrame)
        /*
        if (changes < 100) {
            for (let i = 0; i < changes; i++) {
                frame.addOneRandomOnBit()
            }
        }
        */

        this.checkForLoop()
    }
}
