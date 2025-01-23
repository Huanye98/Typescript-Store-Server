const { query } = require("express");
const db = require("../../db/index");

const queryAllProducts = async ()=>{
  const allQuery = "select * from products"

  try {
    const response = await db.query(allQuery)
    return response.rows
  } catch (error) {
    console.error("was not able to fetch all products",error)
    throw error
  }
}

const getProducts = async (filters = {}) => {
  //query selectors
  const {
    id,
    category,
    collection,
    sort,
    is_featured,
    page = 1,
    limit = 10,
    search,
  } = filters;

  let baseQuery = 
  ` from products 
  left join collections on products.collection_id = collections.id 
  where 1 = 1`;
  const values = [];
  let index = 1;

  if (id) {
    baseQuery += ` AND products.id = $${index++}`;
    values.push(id);
  }

  if (category) {
    baseQuery += ` AND products.category = $${index++}`;
    values.push(category);
  }
  if (is_featured){
    baseQuery += ` AND products.is_featured = $${index++}`;
    values.push(is_featured);
  }
  if (collection) {
    baseQuery += ` AND products.collection_id = $${index++}`;
    values.push(collection);
  }
  if (search) {
    baseQuery += ` AND products.name ILIKE $${index++}`;
    values.push(`%${search}%`);
  }
  const countQuery = `select count(*)${baseQuery}`;
  let queryText = `
  SELECT 
    products.*, 
    collections.name AS collection_name 
  ${baseQuery}
`;

  //sort
  if (sort) {
    const [column, direction] = sort.split(":");
    const validColumns = ["name", "price", "items_sold", "created_at"];
    const validDirections = ["asc", "desc"];

    if (
      validColumns.includes(column) &&
      validDirections.includes(direction.toLowerCase())
    ) {
      queryText += ` ORDER BY ${column} ${direction.toUpperCase()}`;
    } else {
      queryText += ` ORDER BY products.id ASC`;
    }
  } else {
    queryText += ` ORDER BY products.id ASC`;
  }

  //pagination

  const offset = (page - 1) * limit;
  queryText += ` LIMIT $${index++} OFFSET $${index++}`;
  values.push(limit, offset);

  try {
    const productRows = await db.query(queryText, values);

    const countValues = values.slice(0, values.length - 2);

    const countResult = await db.query(countQuery, countValues);

    const totalCount = parseInt(countResult.rows[0].count, 10);

    const products = productRows.rows
    products.forEach(product=>{
      if(product.discountvalue !== 1){
        product.finalPrice = product.price - (product.price*product.discountvalue)
      }else{
        product.finalPrice = product.price
      }
    })

    return { products, totalCount };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

const createProduct = async (
  name,
  price,
  description,
  isavaliable,
  discountvalue,
  imageurl,
  category,
  collection_id,
  is_featured,
  stock
) => {

  console.log(name, price, description,isavaliable,
    discountvalue,
    imageurl,
    category,
    collection_id,
    is_featured,
    stock)
  let query = `insert into products (name, price`;
  const values = [name, price];

  // Check each filter for inclusion in the query and values
  if (collection_id !== undefined) {
    query += `, collection_id`;
    values.push(collection_id);
  }
  if (description !== undefined) {
    query += `, description`;
    values.push(description);
  }
  if (isavaliable !== undefined) {
    query += `, isavaliable`;
    values.push(isavaliable);
  }
  if (category !== undefined) {
    query += `, category`;
    values.push(category);
  }
  if (discountvalue !== undefined) {
    query += `, discountvalue`;
    values.push(discountvalue);
  }
  if (imageurl !== undefined) {
    query += `, imageurl`;
    values.push(imageurl);
  }
  if (is_featured !== undefined) {
    query += `, is_featured`;
    values.push(is_featured);
  }
  if (stock !== undefined) {
    query += `, stock`;
    values.push(stock);
  }

  query += `) VALUES (${values.map((_, i) => `$${i + 1}`).join(", ")}) RETURNING *`;

  try {
    const res = await db.query(query, values);
    return res.rows[0];
  } catch (error) {
    console.error("Error creating product:", error.message);
    throw new Error("Failed to create product");
  }
};

const findAndDeleteProduct = async (id) => {
  if (!id) {
    throw new Error("Product ID is required for deletion.");
  }
  const query = `DELETE FROM products where id = $1 RETURNING *`;
  try {
    const { rows } = await db.query(query, [id]);
    if (rows.length === 0) {
      throw new Error(`Product with ID ${id} not found`);
    }
    return rows[0];
  } catch (error) {
    console.error("Error deleting product:", error.message);
    throw new Error("Failed to delete product");
  }
};

const patchProductInDB = async (productId, updates) => {
  if (!updates || Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No updates provided" });
  }
  const sanitizedUpdates = Object.fromEntries(
    Object.entries(updates).map(([key, value]) => [
      key,
      value === "" ? null : value,
    ])
  );
  try {
    const fields = Object.keys(sanitizedUpdates);
    const values = Object.values(sanitizedUpdates);

    const addToQuery = fields
      .map((field, index) => `${field} = $${index + 1}`)
      .join(", ");

    const query = `UPDATE products SET ${addToQuery} WHERE id = $${
      fields.length + 1
    }`;
    await db.query(query, [...values, productId]);

    return { message: "Product updated successfully" };
  } catch (error) {
    console.error("error updating product", error);
    throw new Error("Failed to update product");
  }
};

module.exports = {
  getProducts,
  createProduct,
  findAndDeleteProduct,
  patchProductInDB,
  queryAllProducts
};
