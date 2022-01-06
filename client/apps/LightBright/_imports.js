"use strict"

ResourceLoader.pushRelativePaths([
    "../../_imports.js",
    "LightBrightApp.js",
]);



ResourceLoader.pushDoneCallback( () => {
    window.app = new LightBrightApp()
    window.app.run()
})

