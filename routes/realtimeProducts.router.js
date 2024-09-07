import { Router } from "express";
import { validateProductCreation } from "../middleware/validateProduct.js";
import generateID from "../utils/generateID.js";
import { getProducts, saveProducts } from "../utils/products.js";
const realtimeProductsRouter = Router();

/**
 * Middleware to parse the price, stock from the form to numbers. This also adds the status: true, to the new product. This is required for the product creation validation process.
 *
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next middleware function
 */
async function prepareProductCreation(req, res, next) {
  const { price, stock } = req.body;
  req.body.price = parseInt(price);
  req.body.stock = parseInt(stock);
  req.body.status = true;
  next();
}

/**
 * GET /realtimeproducts - Returns the realtimeproducts view with the products.
 */
realtimeProductsRouter.get("/", async (req, res) => {
  res.render("realtimeproducts", { products: req.products });
});

/**
 * POST /realtimeproducts - Adds a new product to the products array, from the form in the realtimeproducts view.
 */
realtimeProductsRouter.post(
  "/",
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

export default realtimeProductsRouter;
