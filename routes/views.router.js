import { Router } from "express";
import {
  prepareProductCreation,
  validateProductCreation,
} from "../middleware/products.middleware.js";
import generateID from "../utils/generateID.js";
import { getProducts, saveProducts } from "../utils/products.js";

const viewsRouter = Router();

// This middleware will add the products to the request object to refresh the products when refreshing the page in /realtimeproducts
viewsRouter.use(async (req, res, next) => {
  req.products = await getProducts();
  next();
});

/**
 * GET / - Returns the home view with the products.
 */
viewsRouter.get("/", async (req, res) => {
  res.render("home", { products: req.products });
});

/**
 * GET /realtimeproducts - Returns the realtimeproducts view with the products.
 */
viewsRouter.get("/realtimeproducts", async (req, res) => {
  res.render("realtimeproducts", { products: req.products });
});

/**
 * POST /realtimeproducts - Adds a new product to the products array, from the form in the realtimeproducts view.
 */
viewsRouter.post(
  "/realtimeproducts",
  prepareProductCreation,
  validateProductCreation,
  async (req, res) => {
    const { title, description, code, price, status, stock, category } =
      req.body;

    const products = await getProducts();

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
    await saveProducts(products);
    // To redirect the users to the realtimeproducts page after adding a new product from the form
    res.redirect("/realtimeproducts");
  }
);

export default viewsRouter;
