import express, { Request, Response, NextFunction } from "express";


export const likesRouter = express.Router();



likesRouter.use((req: Request, res: Response, next: NextFunction) => {
  next();
});


