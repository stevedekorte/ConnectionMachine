"use strict"

ResourceLoader.pushRelativePaths([
    "../../_imports.js",
    "CellularAutomata2d.js",
    "GameOfLifeApp.js",
]);



ResourceLoader.pushDoneCallback( () => {
    getGlobalThis().app = new GameOfLifeApp()
    getGlobalThis().app.run()
})

