import { Router } from "express";
import {
  prepareProductCreation,
  validateProductCreation,
} from "../middleware/products.middleware.js";
import { addProduct, getProducts } from "../utils/products.js";

const viewsRouter = Router();

// middleware to add the products to the request object to refresh the products when refreshing the page in /realtimeproducts
viewsRouter.use(async (req, res, next) => {
  const result = await getProducts();
  req.products = result.docs;
  next();
});

/**
 * GET /products - Returns the home view with the products.
 */
viewsRouter.get("/products", async (req, res) => {
  // convert the products to plain objects to avoid problems with the Handlebars template engine
  const plainProducts = req.products.map((product) => product.toObject());
  res.render("home", { products: plainProducts });
});

/**
 * GET /realtimeproducts - Returns the realtimeproducts view with the products.
 */
viewsRouter.get("/realtimeproducts", async (req, res) => {
  const plainProducts = req.products.map((product) => product.toObject());
  res.render("realtimeproducts", { products: plainProducts });
});

/**
 * POST /realtimeproducts - Adds a new product to the products array, from the form in the realtimeproducts view.
 */
viewsRouter.post(
  "/realtimeproducts",
  prepareProductCreation,
  validateProductCreation,
  async (req, res) => {
    await addProduct(req.body);
    // redirect the users to the realtimeproducts page after adding a new product from the form
    res.redirect("/realtimeproducts");
  }
);

export default viewsRouter;
