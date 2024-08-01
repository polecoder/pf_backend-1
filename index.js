import express from "express";
import validateJSON from "./middleware/validateJSON.js";
import productsRouter from "./routes/products.router.js";

const app = express();

app.use(express.json());
app.use(validateJSON); // To validate the JSON format in the request body
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRouter);

app.use("/", (err, req, res, next) => {
  console.error(err.stack);
  return res
    .status(500)
    .send("An internal error occurred. Please try again later.");
});

app.listen(8080, () => {
  console.log("Servidor iniciado en http://localhost:8080");
});
