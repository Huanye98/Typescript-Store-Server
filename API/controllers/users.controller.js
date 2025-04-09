const Users = require("../models/Users.model");

const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await Users.getAllUsers();
    res.status(200).json(allUsers);
  } catch (error) {
    next(error);
  }
};
const createUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const newUser = await Users.createUser(email, password);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password, role } = req.body;
  try {
    const { token, user } = await Users.login(email, password, role);
    res.status(200).json({ token, user });
  } catch (error) {
    next(error);
  }
};

const addProductToCart = async (req, res, next) => {
  const { product_id, quantity, user_id, cart_id } = req.body;
  console.log(req.body);
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
  if (!cart_id) {
    return res.status(400).json({ message: "Missing required field: cart_id" });
  }

  try {
    const response = await Users.addProductToUserCartDb(
      product_id,
      quantity,
      user_id,
      cart_id
    );
    res.status(200).json({ message: "product added successfully", response });
  } catch (error) {
    next(error);
  }
};

const removeProductFromCart = async (req, res, next) => {
  const { product_id, quantity, user_id } = req.body;

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

  try {
    const response = await Users.removeProductFromUserCartDb(
      product_id,
      quantity,
      user_id
    );
    res.status(200).json({ message: "product removed successfully", response });
  } catch (error) {
    next(error);
  }
};

const modifyUserData = async (req, res, next) => {
  const { email, address, password, name } = req.body;
  const user_id = req.params.id;
  console.log(name)
  try {
    await Users.modifyUserDataDB(email, address, password, user_id, name);
    res.status(200).json({ message: "User data modified successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const cart_id = req.user.cartId;
  const userRole = req.user.role;

  try {
    const userToDelete = await Users.getUserById(id);
    if (!userToDelete) {
      return res.status(404).json({ error: "user not found" });
    }
    if (userRole !== "admin" && userToDelete.role === "admin") {
      return res.status(403).json({ error: "you cannot delete this account" });
    }
    if (userRole !== "admin" && userId !== parseInt(id)) {
      return res
        .status(403)
        .json({ error: "you cannot delete this account" });
    }

    const deletedUser = await Users.deleteUserFromDB(id, cart_id);

    return res
      .status(200)
      .json({ message: "user deleted succesfully", deletedUser });
  } catch (error) {
    next(error);
  }
};

const userGetsData = async (req, res, next) => {
  const { id } = req.params;
  try {
    const response = await Users.userGetTheirData(id);
    res
      .status(200)
      .json({ message: " fetched user data successfully", response });
  } catch (error) {
    next(error);
  }
};
const emptyCart = async (req, res, next) => {
  const { cart_id } = req.params;
  try {
    await Users.emptyCartFromDb(cart_id);
    res.status(200).json({ message: "Cart emptied correctly" });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getAllUsers,
  createUser,
  login,
  deleteUser,
  addProductToCart,
  removeProductFromCart,
  modifyUserData,
  userGetsData,
  emptyCart,
};
