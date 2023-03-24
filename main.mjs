import express from "express";
import os from "os"
import pg from 'pg'

const client = new pg.Client({
    user: process.env.pg_user || "user",
    host: process.env.pg_host || "127.0.0.1",
    database: process.env.pg_database || "db",
    password: process.env.pg_pwd || "password",
    port: process.env.pg_port || 5432
});

client.connect();

// テーブルが存在しない場合に作成するSQL文を定義する
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS data_table (
    id SERIAL PRIMARY KEY,
    data VARCHAR(255) NOT NULL
  )
`;

// テーブルが存在しない場合にテーブルを作成する
await client.query(createTableQuery)

const app = express()
app.use(express.json())

const host = os.hostname()

app.listen(3000, () => console.log("API OK!"))
app.get("/", (req, res) => {
    console.log("GET Request!")
    res.send("Hello! this is Express! Today is " + new Date() + " hostname is " + host)
})

app.get("/pg", async (req, res) => {
    const selectQuery = 'SELECT * FROM data_table';
    const responce = await client.query(selectQuery)
    res.setHeader("server-host", host).send(responce.rows)
})

app.post("/pg", async (req, res) => {
    const data = req.body.data
    const insertQuery = {
        text: 'INSERT INTO data_table (data) VALUES ($1)',
        values: [data],
    };
    try {
        await client.query(insertQuery)
        res.send(`OK ${host}`)
    } catch (e) {
        res.send(`Failed ${host} \n ${e}`)
    }
})