import { Router } from "express";
import mongoose from "mongoose";
import { io } from "../index.js";
import {
  validateProductCreation,
  validateProductModification,
} from "../middleware/products.middleware.js";
import {
  addProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../utils/products.js";

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

  const products = await getProducts();

  // Check if the query params are valid, only if the products array is not empty
  if (products.length > 0) {
    if (isNaN(offset) || offset < 0 || offset >= products.length) {
      return res.status(400).send({ error: "Invalid offset query" });
    }

    if (isNaN(limit) || limit < 1 || limit > 20) {
      return res.status(400).send({ error: "Invalid limit query" });
    }
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

  const desiredProduct = await getProductById(id);

  res.send(desiredProduct);
});

/**
 * POST /api/products
 *
 * Creates a new product from the recieved req.body data.
 * The data is checked with the validateProductCreation middleware.
 */
productsRouter.post("/", validateProductCreation, async (req, res) => {
  const productId = await addProduct(req.body);

  const products = await getProducts();
  io.emit("productsChange", products);

  res.send({
    message: "Product added to list successfully",
    id: productId,
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
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).send({ error: "Invalid object id" });
  }

  const { title, description, code, price, status, stock, category } = req.body;

  const productToUpdate = await getProductById(id);

  if (!productToUpdate) {
    return res.status(404).send({ error: "Product not found" });
  }

  // If the request body does not contain a field, the product field remains the same
  const updatedTitle = title || productToUpdate.title;
  const updatedDescription = description || productToUpdate.description;
  const updatedCode = code || productToUpdate.code;
  const updatedPrice = price || productToUpdate.price;
  const updatedStatus = status || productToUpdate.status;
  const updatedStock = stock || productToUpdate.stock;
  const updatedCategory = category || productToUpdate.category;

  const updatedProduct = {
    title: updatedTitle,
    description: updatedDescription,
    code: updatedCode,
    price: updatedPrice,
    status: updatedStatus,
    stock: updatedStock,
    category: updatedCategory,
  };

  await updateProduct(id, updatedProduct);

  const products = await getProducts();

  io.emit("productsChange", products);

  res.send({
    message: "Product updated successfully",
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
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).send({ error: "Invalid object id" });
  }

  const productToDelete = await getProductById(id);
  if (!productToDelete) {
    return res.status(404).send({ error: "Product not found" });
  }

  await deleteProduct(id);

  const products = await getProducts();

  io.emit("productsChange", products);

  res.send({ message: "Product deleted successfully" });
});

export default productsRouter;
