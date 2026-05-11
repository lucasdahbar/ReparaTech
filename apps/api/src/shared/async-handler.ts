import type { NextFunction, Request, RequestHandler, Response } from 'express';

type ControladorAssincrono = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const asyncHandler = (controlador: ControladorAssincrono): RequestHandler => {
  return (req, res, next) => {
    void controlador(req, res, next).catch(next);
  };
};
