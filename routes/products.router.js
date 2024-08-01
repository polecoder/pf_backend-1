import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  validateProductCreation,
  validateProductModification,
} from "../middleware/validateProduct.js";
import generateID from "../utils/generateID.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsRouter = Router();

/**
 * GET /api/products
 *
 * Returns a list of products with a default limit of 20.
 *
 * QUERY PARAMS:
 * - limit: Number of products to return.
 * - offset: Number of products to skip from the start.
 */
productsRouter.get("/", async (req, res) => {
  let offset = req.query.offset || 0;
  let limit = req.query.limit || 20;

  const productsPath = path.join(__dirname, "../data/products.json");
  let products = await fs.promises.readFile(productsPath, "utf-8");
  products = JSON.parse(products);

  if (isNaN(offset) || offset < 0 || offset >= products.length) {
    return res.status(400).send({ error: "Invalid offset query" });
  }

  if (isNaN(limit) || limit < 1 || limit > 20) {
    return res.status(400).send({ error: "Invalid limit query" });
  }

  offset = parseInt(offset);
  limit = parseInt(limit);

  const nextURL =
    offset + limit < products.length
      ? `http://localhost:8080/api/products?limit=${limit}&offset=${
          offset + limit
        }`
      : null;

  const previousURL =
    offset - limit >= 0
      ? `http://localhost:8080/api/products?limit=${limit}&offset=${
          offset - limit
        }`
      : null;

  res.send({
    next: nextURL,
    previous: previousURL,
    products: products.slice(offset, offset + limit),
  });
});

/**
 * GET /api/products/:id
 *
 * Returns the product with the given id.
 * If the given id does not exist, returns a 404 status code.
 */
productsRouter.get("/:pid", async (req, res) => {
  let id = req.params.pid;

  const productsPath = path.join(__dirname, "../data/products.json");
  let products = await fs.promises.readFile(productsPath, "utf-8");
  products = JSON.parse(products);

  const desiredProduct = products.find((product) => product.id === id);

  if (!desiredProduct) {
    return res.status(404).send({ error: "Product not found" });
  }

  res.send(desiredProduct);
});

/**
 * POST /api/products
 *
 * Creates a new product from the recieved req.body data.
 * The data is checked with the validateProductCreation middleware.
 */
productsRouter.post("/", validateProductCreation, async (req, res) => {
  const { title, description, code, price, status, stock, category } = req.body;

  const productsPath = path.join(__dirname, "../data/products.json");
  let products = await fs.promises.readFile(productsPath, "utf-8");
  products = JSON.parse(products);

  const id = generateID();
  const newProduct = {
    id,
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
  };
  products.push(newProduct);

  await fs.promises.writeFile(productsPath, JSON.stringify(products, null, 2));

  res.send({
    message: "Product added to list successfully",
    product: newProduct,
  });
});

/**
 * PUT /api/products/:pid
 *
 * Updates the product with the given id.
 * If the given id does not exist, returns a 404 status code.
 *
 * The data is checked with the validateProductCreation middleware.
 */
productsRouter.put("/:pid", validateProductModification, async (req, res) => {
  const id = req.params.pid;

  const { title, description, code, price, status, stock, category } = req.body;

  const productsPath = path.join(__dirname, "../data/products.json");
  let products = await fs.promises.readFile(productsPath, "utf-8");
  products = JSON.parse(products);

  const productIndex = products.findIndex((product) => product.id === id);
  if (productIndex === -1) {
    return res.status(404).send({ error: "Product not found" });
  }

  // If the request body does not contain a field, the product field is not updated
  const updatedId = products[productIndex].id;
  const updatedTitle = title || products[productIndex].title;
  const updatedDescription = description || products[productIndex].description;
  const updatedCode = code || products[productIndex].code;
  const updatedPrice = price || products[productIndex].price;
  const updatedStatus = status || products[productIndex].status;
  const updatedStock = stock || products[productIndex].stock;
  const updatedCategory = category || products[productIndex].category;

  const updatedProduct = {
    id: updatedId,
    title: updatedTitle,
    description: updatedDescription,
    code: updatedCode,
    price: updatedPrice,
    status: updatedStatus,
    stock: updatedStock,
    category: updatedCategory,
  };

  products[productIndex] = updatedProduct;

  await fs.promises.writeFile(productsPath, JSON.stringify(products, null, 2));

  res.send({
    message: "Product updated successfully",
    product: updatedProduct,
  });
});

/**
 * DELETE /api/products/:pid
 *
 * Deletes the product with the given id.
 * If the given id does not exist, returns a 404 status code.
 */
productsRouter.delete("/:pid", async (req, res) => {
  const id = req.params.pid;

  const productsPath = path.join(__dirname, "../data/products.json");
  let products = await fs.promises.readFile(productsPath, "utf-8");
  products = JSON.parse(products);

  const productIndex = products.findIndex((product) => product.id === id);
  if (productIndex === -1) {
    return res.status(404).send({ error: "Product not found" });
  }

  products.splice(productIndex, 1);

  await fs.promises.writeFile(productsPath, JSON.stringify(products, null, 2));

  res.send({ message: "Product deleted successfully" });
});

export default productsRouter;
