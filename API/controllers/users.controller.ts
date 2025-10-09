import { Request,Response,NextFunction } from "express";
const Users = require("../models/Users.model");

declare module "express" {
  interface Request {
    user?: {
      userId: number;
      role: "admin" | "user";
      cartId?: number;
    };
  }
}

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allUsers = await Users.getAllUsers();
    res.status(200).json(allUsers);
  } catch (error) {
    next(error);
  }
};
const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const newUser = await Users.createUser(email, password);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, role } = req.body;
  try {
    const { token, user } = await Users.login(email, password, role);
    res.status(200).json({ token, user });
  } catch (error) {
    next(error);
  }
};

const addProductToCart = async (req: Request, res: Response, next: NextFunction) => {
  const cartData = req.body;
  console.log(req.body);
  if (!cartData.product_id) {
    return res
      .status(400)
      .json({ message: "Missing required field: productId" });
  }
  if (!cartData.quantity) {
    return res
      .status(400)
      .json({ message: "Missing required field: quantity" });
  }
  if (!cartData.user_id) {
    return res.status(400).json({ message: "Missing required field: userId" });
  }
  if (!cartData.cart_id) {
    return res.status(400).json({ message: "Missing required field: cart_id" });
  }

  try {
    const response = await Users.addProductToUserCartDb(cartData);
    res.status(200).json({ message: "product added successfully", response });
  } catch (error) {
    next(error);
  }
};

const removeProductFromCart = async (req: Request, res: Response, next: NextFunction) => {
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

const modifyUserData = async (req: Request, res: Response, next: NextFunction) => {
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

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if(!req.user){
    return res.status(401).json({ errorMessage: "Unauthorized" });
  }
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

const userGetsData = async (req: Request, res: Response, next: NextFunction) => {
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
const emptyCart = async (req: Request, res: Response, next: NextFunction) => {
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
