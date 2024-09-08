import { Router } from "express";
import { isValidObjectId } from "mongoose";
import {
  addProductToCart,
  createCart,
  getCartById,
  getCarts,
  productInCart,
} from "../utils/carts.js";
import { getProductById, getProducts } from "../utils/products.js";

const cartsRouter = Router();

/**
 * POST /api/carts
 * Creates a new empty cart and returns its ID.
 */
cartsRouter.post("/", async (req, res) => {
  const newCartId = await createCart();
  res.send({ message: `Cart created with id: ${newCartId}` });
});

/**
 * GET /api/carts/:cid
 * Returns the products in the cart with the given id.
 * If the given id does not exist, returns a 404 status code.
 */
cartsRouter.get("/:cid", async (req, res) => {
  const cid = req.params.cid;

  if (!isValidObjectId(cid)) {
    return res.status(400).send({ error: "Invalid object id" });
  }

  const cart = await getCartById(cid);
  if (!cart) {
    return res.status(404).send({ error: "Cart not found" });
  }

  res.send({ message: "Cart found successfully", cart });
});

/**
 * POST /api/carts/:cid/products/:pid
 * Adds the product with the given pid to the cart with the given cid.
 * If the cart or product does not exist, returns a 404 status code.
 * If the product is already in the cart, increments its quantity by 1.
 * If the product is not in the cart, adds it with a quantity of 1.
 */
cartsRouter.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
    return res.status(400).send({ error: "Invalid object id" });
  }

  const desiredCart = await getCartById(cid);
  if (!desiredCart) {
    return res.status(404).send({ error: "Cart not found" });
  }

  const desiredProduct = await getProductById(pid);
  if (!desiredProduct) {
    return res.status(404).send({ error: "Product not found" });
  }

  const updatedCart = await addProductToCart(cid, pid, 1);

  if (!updatedCart) {
    return res.status(500).send({ error: "Error adding product to cart" });
  }

  res.send({
    message: `Product with id ${pid} added to cart with id ${cid} successfully`,
  });
});

export default cartsRouter;
