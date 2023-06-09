import { db } from "../db.js";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

export const register = (req, res) => {
    //check if user already exists
    const q = "SELECT * FROM user WHERE email = ? OR username = ?"

    db.query(q, [req.body.email, req.body.username], (err, data) => {
        if (err) return res.json(err)
        if (data.length === 1) return res.status(409).json("User already exists!");

        //hash
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const q = "INSERT INTO user(`email`, `username`, `password`) VALUES (?)"
        const values = [
            req.body.email,
            req.body.username,
            hash,
        ]

        db.query(q, [values], (err, data) => {
            //console.log("added to users")
            if (err) return res.json(err)
            return res.status(200).json("User has been created.")
        })
    });
};

export const addToCustomer = (req, res) => {
    //check if user already exists
    const q = "SELECT * FROM customer WHERE customerID = ?"

    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.json(err)
        if (data.length === 1) return res.status(409).json("User already exists!");

        const q = "INSERT INTO customer(`customerID`, `address`, `phoneNum`) VALUES (?)"
        const values1 = [
            req.body.username,
            req.body.address,
            req.body.phone,
        ]

        db.query(q, [values1], (err, data) => {
            //console.log("added to customer")
            if (err) return res.json(err)
            return res.status(200).json("Customer has been added.")
        })

    });
};

export const login = (req, res) => {
    //check user exists

    const q = "SELECT * FROM user WHERE username = ?"
    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.json(err);
        if (data.length === 0) return res.status(404).json("User not found!");

        //check password
        const passwordCheck = bcrypt.compareSync(req.body.password, data[0].password);
        if (!passwordCheck) return res.status(400).json("Wrong username or password!")

        const token = Jwt.sign({ id: data[0].email }, "jwtkey");
        const { password, ...other } = data[0]

        res.cookie("access_token", token, {
            httpOnly: true
        }).status(200).json(other)

    });
};

export const logout = (req, res) => {
    res.clearCookie("access_token", {
        sameSite: "none",
        secure: true
    }).status(200).json("User has been logged out.")
};