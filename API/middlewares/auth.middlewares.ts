import { Request,Response,NextFunction } from "express";
const jwt = require("jsonwebtoken");
import {User} from "../../types/Users"

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ errorMessage: "Token is missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as User;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ errorMessage: "Invalid or expired token" });
  }
}

export function roleValidation(requiredRole: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    if(!user){
        return res
        .status(401)
        .json({ errorMessage: "no req.user" });
    }
    
    if ( user?.role !== requiredRole) {
      return res
        .status(401)
        .json({ errorMessage: "Access denied, not enough clearance" });
    }
    
    next();
  };
}

