import { Request,Response,NextFunction } from "express";
const router = require("express").Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json("All good in here");
});

const productRouter = require("./products.routes")
router.use("/products", productRouter)

const usersRouter = require("./users.routes")
router.use("/users", usersRouter)


const authRouter = require("./auth.routes")
router.use("/auth", authRouter)

const stripeRouter = require("./stripe.routes")
router.use("/payment", stripeRouter)

const cloudinaryRouter = require("./cloudinary.routes")
router.use("/upload",cloudinaryRouter)

export default router;