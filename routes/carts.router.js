import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import generateID from "../utils/generateID.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cartsRouter = Router();

/**
 * POST /api/carts
 * Creates a new empty cart and returns its ID.
 */
cartsRouter.post("/", async (req, res) => {
  const cartsPath = path.join(__dirname, "../data/carts.json");
  let carts = await fs.promises.readFile(cartsPath, "utf-8");
  carts = JSON.parse(carts);

  const newCart = {
    id: generateID(16),
    products: [],
  };

  carts.push(newCart);

  await fs.promises.writeFile(cartsPath, JSON.stringify(carts, null, 2));

  res.send({ message: `Cart created with id: ${newCart.id}` });
});

/**
 * GET /api/carts/:id
 * Returns the products in the cart with the given id.
 * If the given id does not exist, returns a 404 status code.
 */
cartsRouter.get("/:cid", async (req, res) => {
  const id = req.params.cid;

  const cartsPath = path.join(__dirname, "../data/carts.json");
  let carts = await fs.promises.readFile(cartsPath, "utf-8");
  carts = JSON.parse(carts);

  const desiredCart = carts.find((cart) => cart.id === id);
  if (!desiredCart) {
    return res.status(404).send({ error: "Cart not found" });
  }

  res.send(desiredCart.products);
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

  const cartsPath = path.join(__dirname, "../data/carts.json");
  let carts = await fs.promises.readFile(cartsPath, "utf-8");
  carts = JSON.parse(carts);

  const desiredCart = carts.find((cart) => cart.id === cid);
  if (!desiredCart) {
    return res.status(404).send({ error: "Cart not found" });
  }

  const productsPath = path.join(__dirname, "../data/products.json");
  let products = await fs.promises.readFile(productsPath, "utf-8");
  products = JSON.parse(products);

  const desiredProduct = products.find((product) => product.id === pid);
  if (!desiredProduct) {
    return res.status(404).send({ error: "Product not found" });
  }

  const productInCart = desiredCart.products.find(
    (product) => product.product === pid
  );
  if (productInCart) {
    productInCart.quantity++;
  } else {
    desiredCart.products.push({ product: pid, quantity: 1 });
  }

  await fs.promises.writeFile(cartsPath, JSON.stringify(carts, null, 2));

  res.send({
    message: `Product with id ${pid} added to cart with id ${cid} successfully`,
  });
});

export default cartsRouter;
