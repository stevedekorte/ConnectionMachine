"use strict"

ResourceLoader.pushRelativePaths([
    "../../_imports.js",
    "data/braille.js",
    "BrailleApp.js",
]);



ResourceLoader.pushDoneCallback( () => {
    window.app = new BrailleApp()
    window.app.run()
})

