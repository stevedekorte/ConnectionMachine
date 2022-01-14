
ResourceLoader.pushRelativePaths([
    "../../_imports.js",
    "Spectrum.js",
    "EqualizerApp.js",
]);



ResourceLoader.pushDoneCallback( () => {
    getGlobalThis().app = new EqualizerApp()
    getGlobalThis().app.run()
})

