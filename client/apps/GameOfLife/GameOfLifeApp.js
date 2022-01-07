"use strict"

window.GameOfLifeApp = class GameOfLifeApp extends LedApp {
    constructor () {
        super()
        this.setFps(20)

        const frame = this.frame()
        frame.randomize()

        this._nextFrame = new LedFrame()
        this._previousFrames = []
        this._maxHistory = 3
    }

    isInLoop () {
        for (let i = 0; i < this._previousFrames.length; i++) {
            const pf = this._previousFrames[i]
            if (pf.equals(this.frame())) {
                return true
            }
        }
        return false
    }

    recordCurrentFrame () {
        this._previousFrames.push(this.frame().duplicate())
        while (this._previousFrames.length > this._maxHistory) {
            this._previousFrames.shift()
        }
    }

    step () {
        super.step()

        const xmax = this.frame().width()
        const ymax = this.frame().height()

        const nextFrame = this._nextFrame
        const frame = this.frame()

        nextFrame.copy(frame)
        
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

        if (this.isInLoop()) {
            frame.randomize()
        } else {
            this.recordCurrentFrame()
        }
    }
}
