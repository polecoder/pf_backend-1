import { getProducts } from "../utils/products.js";

/**
 * Middleware to validate the product information for product CREATION.
 *
 * The product information must contain the following fields:
 * - title: string
 * - description: string
 * - code: string
 * - price: number
 * - status: boolean
 * - stock: number
 * - category: string
 *
 * @param {Request} req The request object.
 * @param {Response} res The response object.
 * @param {NextFunction} next The next middleware function.
 * @returns {void}
 */
export async function validateProductCreation(req, res, next) {
  const newProduct = req.body;

  if (Object.keys(newProduct).length === 0) {
    return res.status(400).send({ error: "Missing the product information" });
  }

  if (!newProduct.title || typeof newProduct.title !== "string") {
    return res.status(400).send({ error: "Invalid product title" });
  }

  if (!newProduct.description || typeof newProduct.description !== "string") {
    return res.status(400).send({ error: "Invalid product description" });
  }

  if (!newProduct.code || typeof newProduct.code !== "string") {
    return res.status(400).send({ error: "Invalid product code" });
  }

  if (!newProduct.price || typeof newProduct.price !== "number") {
    return res.status(400).send({ error: "Invalid product price" });
  }

  if (!newProduct.status || typeof newProduct.status !== "boolean") {
    return res.status(400).send({ error: "Invalid product status" });
  }

  if (!newProduct.stock || typeof newProduct.stock !== "number") {
    return res.status(400).send({ error: "Invalid product stock" });
  }

  if (!newProduct.category || typeof newProduct.category !== "string") {
    return res.status(400).send({ error: "Invalid product category" });
  }

  const products = await getProducts();
  const productExists = products.find(
    (product) => product.code === newProduct.code
  );
  if (productExists) {
    return res.status(400).send({ error: "Product already exists" });
  }

  next();
}

/**
 * Middleware to validate the product information for product MODIFICATION.
 *
 * This checks that the product fields are correctly typed and that the product exists.
 *
 * @param {Request} req The request object.
 * @param {Response} res The response object.
 * @param {NextFunction} next The next middleware function.
 * @returns {void}
 */
export function validateProductModification(req, res, next) {
  const newProduct = req.body;

  if (Object.keys(newProduct).length === 0) {
    return res.status(400).send({ error: "Missing the product information" });
  }

  if (newProduct.title && typeof newProduct.title !== "string") {
    return res.status(400).send({ error: "Invalid product title" });
  }

  if (newProduct.description && typeof newProduct.description !== "string") {
    return res.status(400).send({ error: "Invalid product description" });
  }

  if (newProduct.code && typeof newProduct.code !== "string") {
    return res.status(400).send({ error: "Invalid product code" });
  }

  if (newProduct.price && typeof newProduct.price !== "number") {
    return res.status(400).send({ error: "Invalid product price" });
  }

  if (newProduct.status && typeof newProduct.status !== "boolean") {
    return res.status(400).send({ error: "Invalid product status" });
  }

  if (newProduct.stock && typeof newProduct.stock !== "number") {
    return res.status(400).send({ error: "Invalid product stock" });
  }

  if (newProduct.category && typeof newProduct.category !== "string") {
    return res.status(400).send({ error: "Invalid product category" });
  }

  next();
}
