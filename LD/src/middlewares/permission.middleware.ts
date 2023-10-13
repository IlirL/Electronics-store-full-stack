import { NextFunction, RequestHandler, Response } from 'express';
import HttpException from '@exceptions/http/HttpException';
import { IRequestWithUser } from '@interfaces/auth.interface';

const permissionMiddleware = (roles:string[]): RequestHandler => {
  return async (req: IRequestWithUser, res: Response, next: NextFunction) => {
      
    try{
      const {user} = req;
      if(!roles.includes(user.role))
        throw new Error('Action unauthorized')
      return next();
    } catch (error) {
      console.log('[AUTH MIDDLEWARE]', error);
      return next(new HttpException(403, `Action unauthorised`));
    }
  };
};

export default permissionMiddleware;
