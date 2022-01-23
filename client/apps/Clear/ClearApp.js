"use strict"

getGlobalThis().ClearApp = class ClearApp extends LedApp {
    constructor () {
        super()
        this.setFps(1)
    }

    step () {
        super.step()
        this.frame().clear()
    }
}
