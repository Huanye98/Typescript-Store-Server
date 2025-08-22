"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pool = require("../../db/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const checkIfEmailIsUsed = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = "select * from users where email = $1";
        const response = yield pool.query(query, [email]);
        return response.rows.length > 0;
    }
    catch (error) {
        let errorMessage = "Unknown error";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        throw new Error(`Database Error: Failed to check email. ${errorMessage}`);
    }
});
const createUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!email || !password) {
            throw new Error("Email and password are obligatory");
        }
        const isEmailUsed = yield checkIfEmailIsUsed(email);
        if (isEmailUsed) {
            throw new Error("Email is already in use");
        }
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
        if (passwordRegex.test(password) === false) {
            throw new Error(" The password must be 8 characters minimun,have an upper and lowercase, and a special character");
        }
        const salt = 10;
        const hashPassword = yield bcrypt.hash(password, salt);
        const userRes = yield pool.query("INSERT INTO users(email,password) VALUES ($1, $2) RETURNING *", [email, hashPassword]);
        const cartRes = yield pool.query("insert into cart(user_id) values ($1) returning *", [userRes.rows[0].id]);
        yield pool.query("update users set cart_id = $1 where id = $2", [
            cartRes.rows[0].id,
            userRes.rows[0].id,
        ]);
        return userRes.rows[0];
    }
    catch (error) {
        let errorMessage = "Unknown error";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        throw new Error(`Database Error: Failed to create user. ${errorMessage}`);
    }
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
        const response = yield pool.query(query);
        return response.rows;
    }
    catch (error) {
        let errorMessage = "Unknown error";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        throw new Error(`Database Error: Failed to query users. ${errorMessage}`);
    }
});
const login = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield pool.query(" select * from users where email = $1 ", [
            email,
        ]);
        const user = res.rows[0];
        if (!user) {
            throw new Error("invalid email");
        }
        if (user.is_verified === false) {
            throw new Error("Email not verified");
        }
        const isPasswordValid = yield bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("invalid password");
        }
        const token = jwt.sign({ userId: user.id, role: user.role, cartId: user.cart_id }, process.env.JWT_SECRET, { expiresIn: "48h" });
        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                cartId: user.cart_id,
            },
        };
    }
    catch (error) {
        let errorMessage = "Unknown error";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        throw new Error(`Authentication Error: ${errorMessage}`);
    }
});
const addProductToUserCartDb = (cartData) => __awaiter(void 0, void 0, void 0, function* () {
    const { product_id, quantity, user_id, cart_id } = cartData;
    if (!product_id) {
        return { message: "Missing required field: productId" };
    }
    if (!quantity) {
        return { message: "Missing required field: quantity" };
    }
    if (!user_id) {
        return { message: "Missing required field: userId" };
    }
    if (!cart_id) {
        return { message: "Missing required field: cart_id" };
    }
    const userCheckQuery = "SELECT * FROM users WHERE id = $1";
    const userResponse = yield pool.query(userCheckQuery, [user_id]);
    if (userResponse.rows.length === 0) {
        console.log("User does not exist");
        return;
    }
    const checkIfProductExists = "select * from cart_items where user_id = $1 and product_id = $2 ";
    const addProduct = "insert into cart_items (user_id, product_id, quantity,cart_id) values($1, $2, $3, $4)";
    const updateProductQuantity = " UPDATE cart_items SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3";
    try {
        const response = yield pool.query(checkIfProductExists, [
            user_id,
            product_id,
        ]);
        if (response.rows.length > 0) {
            yield pool.query(updateProductQuantity, [quantity, user_id, product_id]);
            console.log("Product successfully updated in the cart");
        }
        else {
            yield pool.query(addProduct, [user_id, product_id, quantity, cart_id]);
            console.log("Product successfully added in the cart");
        }
    }
    catch (error) {
        let errorMessage = "Unknown error";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        throw new Error(`Database Error: Failed add product to cart: ${errorMessage}`);
    }
});
const removeProductFromUserCartDb = (product_id, quantity, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!product_id) {
        throw new Error("Missing required field: productId");
    }
    if (!quantity) {
        throw new Error("Missing required field: quantity");
    }
    if (!user_id) {
        throw new Error("Missing required field: userId");
    }
    const userCheckQuery = "SELECT * FROM users WHERE id = $1";
    const userResponse = yield pool.query(userCheckQuery, [user_id]);
    if (userResponse.rows.length === 0) {
        console.log("User does not exist");
        return;
    }
    const checkIfProductExists = "select * from cart_items where user_id = $1 and product_id = $2 ";
    const removeProduct = "delete from cart_items where user_id = $1 and product_id = $2 ";
    const updateProductQuantity = " UPDATE cart_items SET quantity = quantity - $1 WHERE user_id = $2 AND product_id = $3";
    try {
        const response = yield pool.query(checkIfProductExists, [
            user_id,
            product_id,
        ]);
        if (response.rows.length > 0) {
            const currentQuantity = response.rows[0].quantity;
            const newQuantity = currentQuantity - quantity;
            if (newQuantity <= 0) {
                yield pool.query(removeProduct, [user_id, product_id]);
                console.log("Product successfully updated from the cart");
            }
            else {
                yield pool.query(updateProductQuantity, [
                    quantity,
                    user_id,
                    product_id,
                ]);
                console.log("Product successfully removed from the cart");
            }
        }
        else {
            console.log("Product not found in cart");
        }
    }
    catch (error) {
        let errorMessage = "Unknown error";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        throw new Error(`Database Error: failed to remove from cart ${errorMessage}`);
    }
});
const modifyUserDataDB = (email, address, password, user_id, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let baseQuery = "UPDATE users SET ";
        let values = [];
        if (name) {
            baseQuery += "name = $1 ";
            values.push(name);
        }
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
            const hashPassword = yield bcrypt.hash(password, salt);
            baseQuery += "password = $1 ";
            values.push(hashPassword);
        }
        baseQuery += " WHERE id = $2";
        values.push(user_id);
        console.log(baseQuery, values);
        const response = yield pool.query(baseQuery, values);
        console.log("User data successfully updated", response);
    }
    catch (error) {
        let errorMessage = "Unknown error";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        throw new Error(`Database Error: Was not able to modify user. ${errorMessage}`);
    }
});
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield pool.query("SELECT * FROM Users WHERE id = $1", [id]);
        return result.rows[0];
    }
    catch (error) {
        let errorMessage = "Unknown error";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        throw new Error(`Database Error: was not able to get selected user. ${errorMessage}`);
    }
});
const deleteUserFromDB = (user_id, cart_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `delete from users where id = $1;`;
        const query2 = `delete from cart where id = $1;`;
        const response = yield pool.query(query, [user_id]);
        yield pool.query(query2, [cart_id]);
        return response.rows[0];
    }
    catch (error) {
        let errorMessage = "Unknown error";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        throw new Error(`Database Error: was not able to delete user ${errorMessage}`);
    }
});
const userGetTheirData = (id) => __awaiter(void 0, void 0, void 0, function* () {
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
          'discount', products.discountvalue,
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
        const response = yield pool.query(query, [id]);
        const cart = response.rows[0].cart_items || [];
        const cartPrice = Object.values(cart).reduce((accumulator, item) => {
            return accumulator + item.final_price * item.quantity;
        }, 0);
        response.rows[0].stripePrice = cartPrice * 100;
        response.rows[0].cartPrice = cartPrice;
        return response.rows;
    }
    catch (error) {
        let errorMessage = "Unknown error";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        throw new Error(`Database Error: Could not retrieve user data. ${errorMessage}`);
    }
});
const emptyCartFromDb = (cart_id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!cart_id) {
        throw new Error("No cart_id");
    }
    try {
        const query = "Delete from cart_items where cart_id = $1";
        yield pool.query(query, [cart_id]);
    }
    catch (error) {
        let errorMessage = "Unknown error";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        throw new Error(`Database Error: was not able to empty cart. ${errorMessage}`);
    }
});
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
    emptyCartFromDb,
};
