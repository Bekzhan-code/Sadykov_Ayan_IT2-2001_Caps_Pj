const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcrypt");

app.use(cors());
app.use(express.json());

app.get("/users", async (req, res) => {
  try {
    const allUsers = await pool.query("SELECT * FROM users");
    res.json(allUsers.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.post("/users/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const { firstname, lastname, email, phone, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await pool.query(
      "INSERT INTO users (firstname, lastname,email,phone,password) VALUES($1,$2,$3,$4,$5)",
      [firstname, lastname, email, phone, hashedPassword]
    );
    res.status(201).json({ message: "Success" });
  } catch {
    res.status(500).json({ message: "This login already exists" });
  }
});

app.post("/users/login", async (req, res) => {
  const user = await pool.query(
    `SELECT * FROM users WHERE email ='${req.body.email}'`
  );
  console.log(req.body.email);
  if (user == null) {
    return res.status(400).send("Cannot find user");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.rows[0].password)) {
      res.json({ message: "Success" });
    } else {
      res.json({ message: "Incorrect password" });
    }
  } catch {
    res.status(500).json({ message: "Incorrect login" });
  }
});

app.post("/cartItems", async (req, res) => {
  try {
    const { title, image, price } = req.body;
    const newCartItem = await pool.query(
      "INSERT INTO cartItems (title, image, price) VALUES($1,$2,$3)",
      [title, image, price]
    );

    res.json(newCartItem);
  } catch (error) {
    console.error(error.message);
  }
});

app.delete("/cartItems", async (req, res) => {
  try {
    const { title } = req.body;
    await pool.query(`DELETE FROM cartItems WHERE title = '${title}'`);
    res.status(204).json("Item Deleted");
  } catch (error) {
    console.error(error.message);
  }
});

app.listen(5000);
