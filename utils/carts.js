import fs from "fs";
import path from "path";
import __dirname from "./__dirname.js";

/**
 * Returns the array of all the carts from the data/carts.json file.
 *
 * @returns {Promise<Array>} - An array of carts
 */
export async function getCarts() {
  const cartsPath = path.join(__dirname, "../data/carts.json");
  let carts = await fs.promises.readFile(cartsPath, "utf-8");
  carts = JSON.parse(carts);
  return carts;
}

/**
 * Saves the array of carts received as a parameter to the data/carts.json file.
 *
 * @param {Array} carts - The array of carts to save
 */
export async function saveCarts(carts) {
  const cartsPath = path.join(__dirname, "../data/carts.json");
  await fs.promises.writeFile(cartsPath, JSON.stringify(carts, null, 2));
}
