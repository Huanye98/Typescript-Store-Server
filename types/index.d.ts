import { Express } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        role: "admin" | "user";
        cartId?: number;
      };
    }
  }
}