import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import validateJSON from "./middleware/validateJSON.js";
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";
import realtimeProductsRouter from "./routes/realtimeproducts.router.js";
import { getProducts } from "./utils/products.js";

const app = express();
const port = process.env.port || 8080;

const httpServer = app.listen(port, () => {});
export const io = new Server(httpServer);

// handlebars config
app.engine("handlebars", handlebars.engine());
app.set("views", "./views");
app.set("view engine", "handlebars");

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(validateJSON); // To validate the JSON format in the request body
app.use(express.static("public"));
// This middleware will add the products to the request object to refresh the products when refreshing the page in /realtimeproducts
app.use(async (req, res, next) => {
  req.products = await getProducts();
  next();
});

// handlebars config
app.engine("handlebars", handlebars.engine());
app.set("views", "./views");
app.set("view engine", "handlebars");
app.get("/", async (req, res) => {
  res.render("home", { products: req.products });
});

// routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/realtimeproducts", realtimeProductsRouter);

app.use("/", (err, req, res, next) => {
  console.error(err.stack);
  return res
    .status(500)
    .send("An internal error occurred. Please try again later.");
});
