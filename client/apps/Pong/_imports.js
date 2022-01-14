
ResourceLoader.pushRelativePaths([
    "../../_imports.js",
    "PongApp.js",
]);

ResourceLoader.pushDoneCallback( () => {
    getGlobalThis().app = new CellularAutomataApp()
    getGlobalThis().app.run()
})

