"use strict"

window.GameOfLifeApp = class GameOfLifeApp extends LedApp {
    constructor () {
        super()
        this.setFps(20)

        const frame = this.frame()
        frame.randomize()

        self._nextFrame = new LedFrame()
    }

    step () {
        const xmax = this.frame().width()
        const ymax = this.frame().height()

        const nextFrame = self._nextFrame
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
                    }
                }
            }
        }
        frame.copy(nextFrame)
        frame.addOneRandomOnBit()
    }
}
