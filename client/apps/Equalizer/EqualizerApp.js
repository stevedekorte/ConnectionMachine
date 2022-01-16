"use strict"

/*

*/

class EqualizerApp extends LedApp {
    constructor () {
        super();
        this.setFps(120)

        this.registerForKeyboardInput()
        this.display().setBrightness(0)

        this._spectrum = new Spectrum()
        return this
    }

    step() {
        super.step()

        const xmax = this.frame().width()
        const ymax = this.frame().height()

        this.frame().clear()

        const bins = this._spectrum.getBins()
        //console.log("bins = ", bins)
        if (bins) {
            /*
            for (let x = 0; x < xmax; x++) {
                let b = bins[x+4]/255
                const r = 0.0
                b = Math.max(0, b - r)/(1 - r)

                const v = Math.floor(32*b)
                //this.frame().drawFromTo(x, ymax, x, ymax - v)
                this.frame().setBit(x, ymax-1- v, 1)

            }
            */
            

            /*
            for (let x = 0; x < xmax; x++) {
                let b = bins[x+3]/255
                const r = 0.5
                b = Math.max(0, b - r)/(1 - r)

                const v = Math.floor(16*b)
                if (v > 0) {
                    this.frame().drawFromTo(x, ymax/2 + v, x, ymax/2 - v)
                }
            }
            */
            
            
            for (let x = 0; x < xmax/2; x++) {
                let scale = 1
                let b = bins[Math.floor((xmax/2-x)*scale)]/255
                const r = 0.4
                b = Math.max(0, b - r)/(1 - r)

                const v = Math.floor(16*b*0.7)
                //const func = function(i, x, y) { return y % 4 === 0 }
                const func = null //function(i, x, y, d) { return d - i < 3 }
                if (v > 0) {
                    
                    this.frame().drawFromTo(x, ymax/2 + v, x, ymax/2 - v, func)
                    this.frame().drawFromTo(xmax-1 -x, ymax/2 + v, xmax - 1 -x, ymax/2 - v, func)
                    
                    //this.frame().setBit(x, ymax/2 + v, 1)
                    //this.frame().setBit(x, ymax/2 - v, 1)
                    
                    //this.frame().setBit(xmax-1 -x, ymax/2 + v, 1)
                    //this.frame().setBit(xmax-1 -x, ymax/2 - v, 1)
                }
            }
            

        }
    }

    //onKeyDown (event) {
    onClickLight (event, x, y) {
        this._spectrum.setupIfNeeded()
    }

}



