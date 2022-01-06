"use strict"

/*

*/

class EqualizerApp extends LedApp {
    constructor(self) {
        super();
        this.setFps(3)

        this.registerForKeyboardInput()
        this.display().setBrightness(0)
        return this
    }

    step() {
        super.step()

        const xmax = this.frame().width()
        const ymax = this.frame().height()

        this.frame().clear()

        const bins = Spectrum.timeStep()
        console.log("bins = ", bins)
        if (bins) {
            for (let x = 0; x < xmax; x++) {

                const v = Math.floor(32*(bins[7 + x*2]/255))
                //if (v < 2) { v = 0 }
                this.frame().drawFromTo(x, ymax, x, ymax - v)
            }
        }
    }

    clearXLine(y) {
        const xmax = this.frame().width()
        for (let x = 0; x < xmax; x++) {
            this.frame().setBit(x, y, 0)
        }
    }

    //onKeyDown (event) {
    onClickLight (event, x, y) {
        Spectrum.setup()
    }

}



