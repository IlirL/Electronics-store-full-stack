import _ from 'lodash';
import db from '@database';
import UserService from './user.service';
import ProductService from './product.service';
import AuthService from './auth.service';



export type Service = {
  getInstance?: any;
  userService?:UserService;
  productService?:ProductService;
  authService?:AuthService;
};

const allServices = {
  UserService,
  ProductService,
  AuthService
};

class Services {
  private static instance: Service = {};
  public services?: Service;
  public db: any;

  public constructor() {
    this.services = Services.getInstance();
    this.db = db;
  }

  public static getInstance(): Service {
    Object.values(allServices).forEach(async classService => {
      if (classService) {
        const name = _.camelCase(classService.name);
        if (!this.instance[name]) {
          this.instance[name] = {};
          this.instance[name] = new classService();
        }
      }
    });
    return this.instance;
  }
}

export default Services;
