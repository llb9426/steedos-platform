import { SteedosSqlite3Driver } from "../../../../src/driver";
import { expect } from 'chai';
import path = require("path");

let databaseUrl = path.join(__dirname, "sqlite-test.db");
// let databaseUrl = ':memory:';
let tableName = "TestFieldsForSqlite4";

describe('fetch records width specific fields for sqlite3 database', () => {
    before(async () => {
        let driver = new SteedosSqlite3Driver({ url: `${databaseUrl}` });
        let result: any = await driver.get(`select count(*) as count from sqlite_master where type = 'table' and name = '${tableName}'`);
        console.log("insert data to sqlite3 database before check table count result:");
        console.log(result);
        expect(result.count).to.be.not.eq(undefined);
        if (result.count) {
            await driver.run(`DROP TABLE ${tableName}`);
        }
        await driver.run(`
            CREATE TABLE ${tableName}(
                [id] TEXT primary key,
                [name] TEXT,
                [title] TEXT,
                [tag] TEXT
            );
        `);
    });

    it('fields arguments is a array', async () => {

        let driver = new SteedosSqlite3Driver({ url: `${databaseUrl}` });
        await driver.insert(tableName, { id: "ptr", name: "ptr", title: "PTR", tag: "one" });
        await driver.insert(tableName, { id: "cnpc", name: "cnpc", title: "CNPC", tag: "one" });

        let queryOptions = {
            fields: ["name", "title"]
        };
        let result = await driver.find(tableName, queryOptions);
        console.log("fetch records width specific fields result:");
        console.log(result);

        await driver.delete(tableName, "ptr");
        await driver.delete(tableName, "cnpc");
        expect(result).to.be.length(2);
        expect(result[0].name).to.be.eq("ptr");
        expect(result[0].title).to.be.eq("PTR");
        expect(result[0].tag).to.be.eq(undefined);

    });

    it('fields arguments is a string', async () => {

        let driver = new SteedosSqlite3Driver({ url: `${databaseUrl}` });
        await driver.insert(tableName, { id: "ptr", name: "ptr", title: "PTR", tag: "one" });
        await driver.insert(tableName, { id: "cnpc", name: "cnpc", title: "CNPC", tag: "one" });

        let queryOptions = {
            fields: "name, title, "
        };
        let result = await driver.find(tableName, queryOptions);
        console.log("fetch records width specific fields result:");
        console.log(result);

        await driver.delete(tableName, "ptr");
        await driver.delete(tableName, "cnpc");
        expect(result).to.be.length(2);
        expect(result[0].name).to.be.eq("ptr");
        expect(result[0].title).to.be.eq("PTR");
        expect(result[0].tag).to.be.eq(undefined);

    });

    it('fields must not be undefined or empty', async () => {

        let driver = new SteedosSqlite3Driver({ url: `${databaseUrl}` });
        await driver.insert(tableName, { id: "ptr", name: "ptr", title: "PTR", tag: "one" });
        await driver.insert(tableName, { id: "cnpc", name: "cnpc", title: "CNPC", tag: "one" });

        let queryOptions = {
            fields: []
        };
        let result: any = "";
        try {
            result = await driver.find(tableName, queryOptions);
            console.log("fetch records width specific fields result:");
            console.log(result);
        }
        catch (ex) {
            result = "error";
        }
        expect(result).to.be.eq("error");

    });
});