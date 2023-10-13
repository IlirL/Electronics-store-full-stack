import { NextFunction, Request, Response } from 'express';
import responsePreparer from '@middlewares/responseHandler.middleware';
import Services from '@services';
import { HttpBadRequest } from '@exceptions/http/HttpBadRequest';
import { User, UserAttributes } from 'database/models/user.model';
class AuthController extends Services {
  public login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    let token: any = req.headers['token'] || null;
    try {
      // call login services
      let user: UserAttributes = null;
      if (token) user = await this.services.authService.loginWithToken(token);
      else {
        if (!email || !password) throw new HttpBadRequest();
        user = await this.services.authService.login(email, password);
        token = this.services.authService.createToken({
          id: user.id,
          email: user.email,
        });
      }
      console.log(user, token)
      return responsePreparer(200, { token, user })(req, res, next);
    } catch (error) {
      next(error);
    }
  };
  public signUp =  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body as User;
      const user = await this.services.authService.signUp(data);
      return responsePreparer(200, 'ok')(req,res,next);
    } catch (error) {
      next(error)
    }
  }
}

export default AuthController;
