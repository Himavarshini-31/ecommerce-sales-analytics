const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend Running Successfully!");
});

app.get("/customers", (req, res) => {

    const sql = "SELECT * FROM customers";

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        else {
            res.json(result);
        }

    });

});

app.get("/categories", (req, res) => {

    const sql = "SELECT * FROM categories";

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        else {
            res.json(result);
        }

    });

});

app.get("/products", (req, res) => {

    const sql = "SELECT * FROM products";

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        else {
            res.json(result);
        }

    });

});

app.get("/orders", (req, res) => {

    const sql = "SELECT o.*, p.amount AS amount FROM orders o LEFT JOIN payments p ON o.order_id = p.order_id";

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        else {
            res.json(result);
        }

    });

});

app.get("/payments", (req, res) => {
    console.log("CORRECT PAYMENTS API CALLED");

    const sql = "SELECT p.payment_id,p.order_id,p.payment_method,p.payment_status,p.payment_date,(pr.price * o.quantity) AS amount FROM payments p JOIN orders o ON p.order_id = o.order_id JOIN products pr ON o.product_id = pr.product_id ORDER BY p.payment_id";

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        else {
            res.json(result);
        }

    });

});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});

// POST Endpoints for Adding Data to the Database
app.post("/customers", (req, res) => {

    const {
        first_name,
        last_name,
        email,
        phone,
        city,
        country,
        registration_date
    } = req.body;

    const sql = `
    INSERT INTO customers
    (first_name,last_name,email,phone,city,country,registration_date)
    VALUES (?,?,?,?,?,?,CURDATE())
    `;

    db.query(sql,
        [first_name,last_name,email,phone,city,country],
        (err,result)=>{

            if(err){
                console.log(err);
                return res.status(500).json(err);
            }

            res.json({
                message:"Inserted",
                customer_id:result.insertId
            });

        });

});

app.post("/products", (req, res) => {

    const { product_name, category_id, price, stock_quantity } = req.body;

    const sql =
        `INSERT INTO products
        (product_name, category_id, price, stock_quantity)
        VALUES(?,?,?,?)`;

    db.query(
        sql,
        [product_name, category_id, price, stock_quantity],
        (err, result) => {

            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            else {
                res.json({
                    message: "Product Added Successfully!"
                });
            }

        }
    );

});

app.post("/orders", (req, res) => {

    const { customer_id, product_id, quantity, order_date } = req.body;

    const sql =
        `INSERT INTO orders
        (customer_id, product_id, quantity, order_date)
        VALUES(?,?,?,?)`;

    db.query(
        sql,
        [customer_id, product_id, quantity, order_date],
        (err, result) => {

            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            else {
                res.json({
                    message: "Order Added Successfully!"
                });
            }

        }
    );

});

app.post("/payments", (req, res) => {

    const { order_id, payment_method, payment_status, payment_date } = req.body;

    const sql = `
        INSERT INTO payments
        (order_id, payment_method, payment_status, payment_date)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [order_id, payment_method, payment_status, payment_date],
        (err, result) => {

            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            else {
                res.json({
                    message: "Payment Added Successfully!"
                });
            }

        }
    );

});
app.post("/categories", (req, res) => {

    const { category_name } = req.body;

    const sql =
        `INSERT INTO categories
        (category_name)
        VALUES(?)`;

    db.query(
        sql,
        [category_name],
        (err, result) => {

            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            else {
                res.json({
                    message: "Category Added Successfully!",
                    category_id: result.insertId,
                    category_name: category_name
                });
            }

        }
    );

});