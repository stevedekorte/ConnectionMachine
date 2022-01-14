
ResourceLoader.pushRelativePaths([
    "../../_imports.js",
    "CA.js",
    "CellularAutomataApp.js",
]);

ResourceLoader.pushDoneCallback( () => {
    getGlobalThis().app = new CellularAutomataApp()
    getGlobalThis().app.run()
})

