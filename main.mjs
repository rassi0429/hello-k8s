import express from "express";
import os from "os"
const app = express()

app.listen(3000, () => console.log("API OK!"))
app.get("/", (req, res) => {
    console.log("GET Request!")
    res.send("Hello! this is Express! Today is " + new Date() + " hostname is " + os.hostname())
})