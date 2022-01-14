"use strict"

ResourceLoader.pushRelativePaths([
    "../../_imports.js",
    "data/braille.js",
    "BrailleApp.js",
]);



ResourceLoader.pushDoneCallback( () => {
    getGlobalThis().app = new BrailleApp()
    getGlobalThis().app.run()
})

