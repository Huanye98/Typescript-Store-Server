const pool = require("../../db/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const createUser = async (email, password) => {
  const salt = 10;
  const hashPassword = await bcrypt.hash(password, salt);

  const res = await pool.query(
    "INSERT INTO users(email,password) VALUES ($1, $2) RETURNING *",
    [email, hashPassword]
  );
  const cartRes = await pool.query(
    "insert into cart(user_id) values ($1) returning *",
    [res.rows[0].id]
  );
  await pool.query("update users set cart_id = $1 where id = $2", [cartRes.rows[0].id,res.rows[0].id]);
  return res.rows[0];
};

const getAllUsers = async () => {
  // const response = await pool.query("SELECT * FROM users");
  const query = `
  SELECT users.id AS user_id, 
         users.email, 
         users.role,
         users.address, 
         users.name, 
         users.created_at, 
         cart.id AS cart_id,
         ARRAY_AGG(
           JSON_BUILD_OBJECT(
             'product_name', products.name, 
             'product_id', cart_items.product_id, 
             'quantity', cart_items.quantity
           )
         ) AS cart_items
  FROM users
  LEFT JOIN cart ON users.cart_id = cart.id
  LEFT JOIN cart_items ON cart.id = cart_items.cart_id
  LEFT JOIN products ON cart_items.product_id = products.id
  GROUP BY users.id, cart.id;
`;

  const response = await pool.query(query);
  return response.rows;
};

// receieves request w/ email and password and check the database if it exists in the db if so a new jwt is created
const login = async (email, password) => {
  const res = await pool.query(" select * from users where email = $1 ", [
    email,
  ]);
  //check email
  const user = res.rows[0];
  if (!user) {
    throw new Error("invalid email");
  }
  //check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("invalid password");
  }
  //create token
  const token = jwt.sign(
    { userId: user.id, 
      role: user.role,
      cartId : user.cart_id},
      process.env.JWT_SECRET,
    { expiresIn: "48h" }
  );
  return { token, user: { id: user.id, email: user.email, role: user.role, cartId: user.cart_id } };
};

const addProductToUserCartDb = async (product_id, quantity, user_id, cart_id) => {
  if (!product_id) {
    return { message: "Missing required field: productId" };
  }
  if (!quantity) {
    return { message: "Missing required field: quantity" };
  }
  if (!user_id) {
    return{ message: "Missing required field: userId" };
  }
  if (!cart_id) {
    return { message: "Missing required field: cart_id" };
  }
  const userCheckQuery = "SELECT * FROM users WHERE id = $1";
  const userResponse = await pool.query(userCheckQuery, [user_id]);
  if (userResponse.rows.length === 0) {
    console.log("User does not exist");
    return;
  }

  const checkIfProductExists =
    "select * from cart_items where user_id = $1 and product_id = $2 ";
  const addProduct =
    "insert into cart_items (user_id, product_id, quantity,cart_id) values($1, $2, $3, $4)";
  const updateProductQuantity =
    " UPDATE cart_items SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3";

  try {
    const response = await pool.query(checkIfProductExists, [
      user_id,
      product_id,
    ]);
    if (response.rows.length > 0) {
      await pool.query(updateProductQuantity, [quantity, user_id, product_id]);
      console.log("Product successfully updated in the cart");
    } else {
      await pool.query(addProduct, [user_id, product_id, quantity,cart_id]);
      console.log("Product successfully added in the cart");
    }
  } catch (error) {
    console.error("failed to add to cart", error);
  }
};
const removeProductFromUserCartDb = async (product_id, quantity, user_id) => {
  if (!product_id) {
    return res
      .status(400)
      .json({ message: "Missing required field: productId" });
  }
  if (!quantity) {
    return res
      .status(400)
      .json({ message: "Missing required field: quantity" });
  }
  if (!user_id) {
    return res.status(400).json({ message: "Missing required field: userId" });
  }
  //checks if user exists in the db
  const userCheckQuery = "SELECT * FROM users WHERE id = $1";
  const userResponse = await pool.query(userCheckQuery, [user_id]);
  if (userResponse.rows.length === 0) {
    console.log("User does not exist");
    return;
  }

  // depending on if the product exists on the users cart, it will delete or remove quantity
  const checkIfProductExists =
    "select * from cart_items where user_id = $1 and product_id = $2 ";
  const removeProduct =
    "delete from cart_items where user_id = $1 and product_id = $2 ";
  const updateProductQuantity =
    " UPDATE cart_items SET quantity = quantity - $1 WHERE user_id = $2 AND product_id = $3";

  try {
    const response = await pool.query(checkIfProductExists, [
      user_id,
      product_id,
    ]);
    if (response.rows.length > 0) {
      const currentQuantity = response.rows[0].quantity;
      const newQuantity = currentQuantity - quantity;

      if (newQuantity <= 0) {
        await pool.query(removeProduct, [user_id, product_id]);
        console.log("Product successfully updated from the cart");
      } else {
        await pool.query(updateProductQuantity, [quantity,user_id,product_id]);
        console.log("Product successfully removed from the cart");
      }
    } else {
      console.log("Product not found in cart");
    }
  } catch (error) {
    console.error("failed to remove from cart", error);
  }
};

const modifyUserDataDB = async (email, address, password, user_id) => {
  try {
    // Initialize the base query
    let baseQuery = "UPDATE users SET ";
    let values = [];

    // Build the query dynamically based on the provided fields
    if (email) {
      baseQuery += "email = $1  ";
      values.push(email);
    }
    if (address) {
      baseQuery += "address = $1 ";
      values.push(address);
    }
    if (password) {
      const salt = 10;
      const hashPassword = await bcrypt.hash(password, salt);
      baseQuery += "password = $1 ";
      values.push(hashPassword);
    }

    // Add the WHERE clause with the user_id
    baseQuery += " WHERE id = $2";
    values.push(user_id);
    console.log(baseQuery,values)
    // Execute the query
    const response = await pool.query(baseQuery, values);
    console.log("User data successfully updated",response);
  } catch (error) {
    console.error("Error updating user data:", error);
  }
};

const getUserById = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM Users WHERE id = $1", [id]);
    return result.rows[0];
  } catch (error) {
    console.log("was not able to get user", error);
  }
};
const deleteUserFromDB = async (userRole) => {
  try {
    const query = `delete from users where id = 1$ `;
    const response = await pool.query(query, userRole);
    return response.rows[0];
  } catch (error) {
    console.log("was not able to delete user", error);
  }
};

const userGetTheirData = async (id) => {
  try {
    const query = `
    SELECT 
      users.id AS user_id,
      users.email AS user_email,
      users.address AS user_address,
      users.name AS user_name,
      ARRAY_AGG(
        JSON_BUILD_OBJECT(
          'imageurl', products.imageurl,
          'product_name', products.name, 
          'product_price', products.price,
          'product_id', cart_items.product_id, 
          'quantity', cart_items.quantity,
          'discount', products.discountvalue,  -- Updated to 'discountvalue'
          'final_price',
          CASE 
            WHEN products.discountvalue < 0 OR products.discountvalue > 1 THEN products.price 
            WHEN products.discountvalue > 0 AND products.discountvalue < 1 THEN products.price - (products.price * products.discountvalue)  
            ELSE products.price  
          END
        )
      ) AS cart_items
    FROM users
    LEFT JOIN cart ON users.cart_id = cart.id
    LEFT JOIN cart_items ON cart.id = cart_items.cart_id
    LEFT JOIN products ON cart_items.product_id = products.id
    WHERE users.id = $1
    GROUP BY users.id;
  `;
  
    const response = await pool.query(query, [id]);
    const cart  = response.rows[0].cart_items
    const cartPrice = Object.values(cart).reduce((accumulator,item)=>{
      return accumulator + item.final_price * item.quantity
    },0)
    response.rows[0].stripePrice = cartPrice*100
    response.rows[0].cartPrice = cartPrice
    
    return response.rows;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw new Error("Could not retrieve user data");
  }
};

module.exports = {
  createUser,
  getAllUsers,
  login,
  addProductToUserCartDb,
  removeProductFromUserCartDb,
  deleteUserFromDB,
  getUserById,
  modifyUserDataDB,
  userGetTheirData,
};
