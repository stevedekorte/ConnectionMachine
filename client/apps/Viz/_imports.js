
ResourceLoader.pushRelativePaths([
    "../../_imports.js",
    "./animations/_imports.js",
    "VizApp.js",
]);



ResourceLoader.pushDoneCallback( () => {
    window.app = new VizApp()
    window.app.run()
})

