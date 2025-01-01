import express from "express";
import "express-async-errors";
import routes from "./startup/routes.js";
import db from "./startup/db.js";
import log from "./startup/log.js";
import product from "./startup/product.js";
import cors from 'cors'

const app = express();

app.use(cors())
log(app);
db();
routes(app);
product(app);

let port

if (app.get('env') !== 'test') {
  console.log("Define the port ----------------------------------------------")
  port = process.env.PORT || 3000;
}

const server = app.listen(port, () =>
  console.log(`Listening on port ${port}...`)
);

export default server; // export for testing
