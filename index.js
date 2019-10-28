const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require("./queries");
// const port = 3000

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

app.get("/users", db.getUsers);
// app.get("/users/:id", db.getUserById);
app.post("/users", db.createUser);
app.get("/users/login", db.login);

app.listen(4000, () => console.log("listning on 4000....."));
