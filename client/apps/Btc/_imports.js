
ResourceLoader.pushRelativePaths([
    "../../_imports.js",
    //"BlockChainAPI.js",
    "BlockCypherAPI.js",
    //"BitcoinExplorerAPI.js",
    "BtcApp.js"
]);



ResourceLoader.pushDoneCallback( () => {
    window.app = new BtcApp()
    window.app.run()
})

