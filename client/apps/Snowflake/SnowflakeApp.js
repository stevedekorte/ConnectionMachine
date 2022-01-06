"use strict"

window.SnowflakeApp = class SnowflakeApp extends LedApp {
    constructor () {
        super()
        this.display().setBrightness(15)
    }

    step () {
        super.step()
        if (this._t % 10 === 1) {
            this.frame().clear()
            //globalRandomSet.clear()
            globalRandomSet.mutate()

            let a = 180

            for (let i = 0; i < 2; i++) {
                let b = new Branch()
                b.setAngle(a)
                b.setParent(this)
                b.firstGen()

                a += 180
            }

           // this.frame().randomize()
            //this.frame().mirrorLeftToRight()
            //this.frame().mirrorTopToBottom()
            //this.frame().mirrorDiagonal()
        }
    }

}
