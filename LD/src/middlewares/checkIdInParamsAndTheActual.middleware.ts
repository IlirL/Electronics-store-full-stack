import { NextFunction, RequestHandler, Response } from 'express';
import HttpException from '@exceptions/http/HttpException';
import { IRequestWithUser } from '@interfaces/auth.interface';

const checkIdParamsAndActual = ( idInParams:string): RequestHandler => {
  return async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    try {
      if(req.params[idInParams] !== req.user.id)
        throw new Error('You are not the user you claim to be');
      next();
    } catch (error) {
      console.log('[NAMESPACE MIDDLEWARE]', error);
      next(new HttpException(500, error?.message));
    }
  };
};

export default checkIdParamsAndActual;
