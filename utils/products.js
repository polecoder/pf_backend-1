import fs from "fs";
import path from "path";
import __dirname from "./__dirname.js";

/**
 * Returns the array of all the products from the data/products.json file.
 *
 * @returns {Promise<Array>} - An array of products
 */
export async function getProducts() {
  const productsPath = path.join(__dirname, "../data/products.json");
  let products = await fs.promises.readFile(productsPath, "utf-8");
  products = JSON.parse(products);
  return products;
}

/**
 * Saves the array of products received as a parameter to the data/products.json file.
 *
 * @param {Array} products - The array of products to save
 *
 * @returns {Promise<void>}
 */
export async function saveProducts(products) {
  const productsPath = path.join(__dirname, "../data/products.json");
  await fs.promises.writeFile(productsPath, JSON.stringify(products, null, 2));
}
