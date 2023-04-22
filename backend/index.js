import express from 'express';
import mysql from "mysql";
import cors from 'cors';
import inventoryRoute from "./routes/inventory.js"
import consoleRoute from "./routes/consoles.js"
import authRoutes from "./routes/auth.js"
import cookieParser from 'cookie-parser';

const app = express()

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "",
    database: "database_project_final",
});

app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.get("/", (req, res) => {
    res.json("hello this is the backend");
})

app.use("/api/auth", authRoutes);

app.use("/api/inventory", inventoryRoute);

app.use("/api/consoles", consoleRoute);


app.listen(8800, () => {
    console.log("Connected to backend!")
})