
ResourceLoader.pushRelativePaths([
    "../../_imports.js",
    "Spectrum.js",
    "EqualizerApp.js",
]);



ResourceLoader.pushDoneCallback( () => {
    window.app = new EqualizerApp()
    window.app.run()
})

