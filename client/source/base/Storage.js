

getGlobalThis().Storage = class Storage extends Base {

    init() {
        this.newSlot("delegate", null)
        this.newSlot("db", null)
        this.newSlot("storeName", "test")
        this.newSlot("store", null)
        this.newSlot("index", null)
        this.newSlot("openCallback", null)
        this.newSlot("version", 6)
    }

    indexedDB() {
        if (!this._indexedDB) {
            const g = getGlobalThis()
            return g.indexedDB || g.mozIndexedDB || g.webkitIndexedDB || g.msIndexedDB || g.shimIndexedDB;
        }
        return this._indexedDB
    }

    delete() {
        this.db().deleteObjectStore("cache");
    }

    open(openCallback) {
        this.setOpenCallback(openCallback)
        const self = this
        const openRequest = this.indexedDB().open("MyDatabase", this.version());
        const result = {}

        openRequest.onupgradeneeded = function (event) {
            self.setDb(openRequest.result)
            self.onOpenUpgradeNeeded(event)
        };

        openRequest.onsuccess = function (event) {
            self.setDb(openRequest.result)
            self.onOpenSuccess(event)
        }

        openRequest.onerror = function (event) {
            result.error = openRequest.error
            console.log("openRequest.error: ", openRequest.error)
            throw new Error(openRequest.error)
            openCallback(result)
        }

        openRequest.onblocked = function () {
            // this event shouldn't trigger if we handle onversionchange correctly

            // it means that there's another open connection to the same database
            // and it wasn't closed after db.onversionchange triggered for it
            throw new Error("onblocked")
        };
    }

    onOpenUpgradeNeeded(event) {
        console.log(" onupgradeneeded - likely setting up local database for the first time")

        const db = event.target.result;

        db.onerror = function (event) {
            console.log("db error ", event)
        };

        this.setDb(db)

        const objectStore = db.createObjectStore(this.storeName(), { keyPath: "key" }, false);
        objectStore.createIndex("key", "key", { unique: true });
    }

    /*
    onUpgradeNeeded () {
        try {
        const store = this.db().createObjectStore(this.storeName(), { keyPath: "key" });
        //setTimeout(() => { this.didOpen() }, 0)
        } catch(e) {
            console.log(e)
        }
        const self = this
        setTimeout(() => { self.didOpen()({}) }, 1000)
    }
    */

    onOpenSuccess() {
        //this.onUpgradeNeeded()
        this.didOpen()
    }

    didOpen(result) {
        if (this.openCallback()) {
            this.openCallback()(result)
            //setTimeout(() => { this.openCallback()(result) }, 1000)
        }
    }

    getKeys (doneFunc) {
        const request = objectStore.getAllKeys()

        request.onerror = function (event) {
            throw new Error(event.error)
        };

        request.onsuccess = function (event) {
            doneFunc(request.result)
        }
    }


    asyncAtPut(key, value, doneFunc) {
        const tx = this.db().transaction(this.storeName(), "readwrite");
        const store = tx.objectStore(this.storeName());

        store.put({ key: key, value: value }); // this is an update

        // Close the db when the transaction is done
        tx.oncomplete = function () {
            if (doneFunc) {
                doneFunc()
            }
        }
    }

    /*
    asyncHasKey (key, doneFunc) {
        this.asyncAt(key, (result) => {
            const v = result.value !== undefined 
            doneFunc({ value = v })
        })
    }
    */


    asyncAt(key, doneFunc) {
        const tx = this.db().transaction(this.storeName(), "readonly");
        const store = tx.objectStore(this.storeName());

        // Query the data
        const request = store.get(key);
        const result = {}

        request.onsuccess = function (event) {
            //const record = tx.result
            //doneFunc(result);  
        }

        request.onerror = function () {
            result.error = tx.error
            //doneFunc(result);  
        }


        tx.onerror = function (event) {
            result.error = tx.error
            doneFunc(result);
        }

        tx.oncomplete = function (event) {
            const record = request.result
            result.value = typeof (record) === "undefined" ? undefined : record.value
            doneFunc(result);
        }
    }

    asyncDeleteAt(key, doneFunc) {
        const tx = this.db().transaction(this.storeName(), "readwrite");
        const request = store.delete(key);
        const result = {}

        tx.onerror = function (event) {
            result.error = tx.error
            doneFunc(result);
        }

        tx.oncomplete = function (event) {
            doneFunc(result);
        }

    }
}

/*
getGlobalThis().StorageTest = class StorageTest extends Base {

    init () {
        this.newSlot("storage", null)
    }

    run () {
        const storage = Storage.clone()
        this.setStorage(storage)
        storage.open((result) => { this.didOpen(result) })
    }

    didOpen (result) {
        //console.log("didOpen")
        //console.log("asyncAtPut a b")
        this.storage().asyncAtPut("a", "b", (result) => { this.didPut(result) })
    }

    didPut (result) {
        //console.log("asyncAt a")
        this.storage().asyncAt("a", (result) => { this.didGet(result) })
    }

    didGet (result) {
        console.log("didGet ", result.value)
    }
}


StorageTest.clone().run()
*/
