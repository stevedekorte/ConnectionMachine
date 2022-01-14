
ResourceLoader.pushRelativePaths([
    "../../_imports.js",
    "./animations/_imports.js",
    "VizApp.js",
]);



ResourceLoader.pushDoneCallback( () => {
    getGlobalThis().app = new VizApp()
    getGlobalThis().app.run()
})

