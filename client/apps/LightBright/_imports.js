"use strict"

ResourceLoader.pushRelativePaths([
    "../../_imports.js",
    "LightBrightApp.js",
]);



ResourceLoader.pushDoneCallback( () => {
    getGlobalThis().app = new LightBrightApp()
    getGlobalThis().app.run()
})

