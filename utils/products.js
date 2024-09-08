import { productsModel } from "../models/products.model.js";

/**
 * Returns the array of all the products from the database.
 *
 * @returns {Promise<Array>} - An array of products
 */
export async function getProducts() {
  try {
    const products = await productsModel.find();
    return products;
  } catch (err) {
    console.error("Error getting products from the database");
  }
}

/**
 * PRE-CONDITION: The product recieved as a parameter is correctly formatted.
 * Adds the product received as a parameter to the database.
 *
 * @param {Object} product - The product to add
 *
 * @returns {Promise<string>} The _id of the added product
 */
export async function addProduct(product) {
  try {
    const newProduct = new productsModel(product);
    const savedProduct = await newProduct.save();
    return savedProduct._id;
  } catch (err) {
    console.error("Error adding product to the database");
  }
}

/**
 * Returns the product with the given id from the database.
 * If the product does not exist, returns null.
 *
 * @param {import("mongoose").ObjectId} id - The id of the product to search for
 *
 * @returns {Promise<Object>} - The product with the given id
 */
export async function getProductById(id) {
  try {
    const product = await productsModel.findById(id);
    return product;
  } catch (err) {
    console.error(`Error getting product with id: ${id} from the database`);
  }
}

/**
 * PRE-CONDITION: The product recieved as a parameter is correctly and completely formatted.
 * PRE-CONDITION: The id recieved as a parameter is a valid id of an existing product.
 * Updates the product with the given id with the new data.
 *
 * @param {string} id - The id of the product to update
 * @param {Object} newData - The new data to update the product with
 *
 * @returns {Promise<Object>} - The updated product
 */
export async function updateProduct(id, newData) {
  try {
    await productsModel.findByIdAndUpdate(id, newData);
  } catch (err) {
    console.error(`Error updating product with id: ${id}`);
  }
}

/**
 * PRE-CONDITION: The id recieved as a parameter is a valid id of an existing product.
 *
 * Deletes the product with the given id from the database.
 *
 * @param {string} id - The id of the product to delete
 *
 * @returns {Promise<void>}
 */
export async function deleteProduct(id) {
  try {
    await productsModel.findByIdAndDelete(id);
  } catch (err) {
    console.error(`Error deleting product with id: ${id}`);
  }
}
