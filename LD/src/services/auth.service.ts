import jwt from 'jsonwebtoken';
import BaseService from './baseService.service';
import { comparePassword } from '@utils/utils';
import config from '@config';
import { HttpNotFound } from '@exceptions/http/HttpNotFound';
import { HttpBadRequest } from '@exceptions/http/HttpBadRequest';
import { User } from 'database/models/user.model';
import { HttpError } from '@exceptions/http/HttpError';

const auth = config.auth;

class AuthService extends BaseService {
  public createToken(user: any): string {
    const dataStoredInToken = user;
    const secret: string = config.auth.secret || '';
    const expiresIn: number = 60 * config.auth.validMins;

    return jwt.sign(dataStoredInToken, secret, { expiresIn });
  }

  public async login(email: string, password: string): Promise<User> {
    const user = await User.findOne({ where: { email } });

    if (!user) throw new HttpNotFound();
    console.log("users password", user.password)
    console.log('password', password)
    const correctPassword = await comparePassword(password, user.password);
    console.log(correctPassword);

    if (!correctPassword) throw new HttpBadRequest('Incorrect password!');

    return await this.services.userService.getById( user.id);
  }

  public async loginWithToken(token: any): Promise<User> {
    let authUser: User = null;

    try {
      authUser = jwt.verify(token, auth?.secret) as User;
    } catch (error) {
      throw new User();
    }

    const user = await User.findOne({ where: { id: authUser?.id } });

    if (!user) throw new HttpNotFound();

    return await this.services.userService.getById( user.id);
  }

  public async signUp(data:User): Promise<User> {
    try {
      return await User.create({...data, role:'USER'})
    } catch (error) {
      console.log(error)
      throw new HttpError({message:'Could not create', errors:error})
    }
   
  }

}

export default AuthService;
