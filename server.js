require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const pgp = require("pg-promise")();
const db = pgp({
  host: "localhost",
  port: 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD
});

app.use(bodyParser.json());
app.use("/static", express.static("static"));
app.set("view engine", "hbs");

app.get("/menu", function(req, res) {
  db.any("select * from menu")
    .then(data => res.json(data))
    .catch(error => res.status(400).json({ error: "invaid request" }));
});



app.post("/order", function(req, res) {
  const orderItems = req.body;
  db.one('insert into "order" values(default) returning id')
    .then(data => {
      orderItems.forEach(item => {
        const { menu_id, quantity } = item;
        db.none(
          `insert into menu_order(menu_id, order_id,quantity)
          VALUES($1, $2, $3)`,
          [menu_id, data.id, quantity]
        )
      })
    })
    .then(() => res.json({ order: "new order accepted" }))
    .catch(error => res.status(400).json({ error: error.message }));
});

app.delete("/order/:id", function(req, res) {
  const order_id = req.params.id;
  db.none(`delete from menu_order where order_id=$1`, [order_id]).then(data => {
    db.none(`delete from "order" where "order".id=$1`, [order_id])
      .then(response =>
        res.status(204).json({ order: `order ${order_id} deleted` })
      )
      .catch(error => res.status(400).json({ error: error.message }));
  });
});

app.get("/order/:id", function(req, res) {
  const order_id = req.params.id;
  db.any(
    `select menu_id, menu.name, menu.price, menu.image_name, quantity
          from menu, menu_order
          where menu.id = menu_order.menu_id
          and menu_order.order_id = $1 `,
    [order_id]
  )
  .then(data => res.json(data))
  .catch(error => res.status(404).json({error: error.message}))
});

app.get("/order", function(req, res){
  db.any(
    `select order_id, menu_id, menu.name, menu.price, menu.image_name, quantity
          from menu, menu_order
          where menu.id = menu_order.menu_id`
  )
  .then(data => res.json(data))
  .catch(error => res.status(404).json({error: error.message}))
})

app.listen(8080, function() {
  console.log("Listening on port 8080");
});
