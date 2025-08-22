import { Request, Response, NextFunction } from 'express';

export const getUserData = async (req:Request, res:Response, next:NextFunction) => {
  try {
    res.status(200).json({
        message:"User data retrieved",
        user:req.user,
    });
  } catch (error) {
    next(error);
  }
};
export const getAdminData = async (req:Request, res:Response, next:NextFunction) => {
  try {
    res.status(200).json({
        message:"Admin data retrieved",
        user:req.user,
    });
  } catch (error) {
    next(error);
  }
};
