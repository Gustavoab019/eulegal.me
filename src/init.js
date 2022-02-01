const Database = require("./configDB.js")

const initDb = {
    async init() {
        const db = await Database()

        await db.exec(`CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            date DATE,
            status TEXT,
            service TEXT
        )`);

        await db.close()
    }
}

initDb.init();
