import { NextFunction, RequestHandler, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IRequestWithUser } from '@interfaces/auth.interface';
import config from '@config';
import Services from '@services';
import { HttpBadRequest } from '@exceptions/http/HttpBadRequest';
import { HttpNotFound } from '@exceptions/http/HttpNotFound';
import { HttpUnauthorized } from '@exceptions/http/HttpUnauthorized';
import { UserAttributes } from 'database/models/user.model';

const auth = config.auth;

const authMiddleware = (check?: 'USER' | 'CLIENT' | 'ACCOUNTANT'): RequestHandler => {
  return async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    const services = Services.getInstance();
    const { clientId } = req.params;

    try {
      /** get JWT from header */
      const token: string = req.headers['token'] || null;
      /** Check if userModel has authentication token */
      if (!token) {
        next(new HttpBadRequest('No authentication token provided'));
      } else {
        /** Verify authentication token */
        const authUser: UserAttributes = jwt.verify(token, auth?.secret) as UserAttributes;
        const user = await services.userService.getById(authUser?.id);
        req.user = user;
        return next();
      }
    } catch (error) {
      console.log('[AUTH MIDDLEWARE]', error);
      next(new HttpUnauthorized('Wrong authentication token'));
    }
  };
};

export default authMiddleware;
