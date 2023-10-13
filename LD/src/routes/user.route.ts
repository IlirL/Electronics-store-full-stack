import UserController from "@controllers/user.controller";
import { UserAddDTO, UserEditDTO } from "@dtos/user.dto";
import IRoute from "@interfaces/routes.interface";
import authMiddleware from "@middlewares/auth.middleware";
import permissionMiddleware from "@middlewares/permission.middleware";
import validationMiddleware from "@middlewares/validation.middleware";
import { Router } from "express";


class UserRoute implements IRoute {
  public path;
  public router = Router();
  public userController = new UserController();

  constructor(path) {
    this.path = path;
    this.initializeRoutes(this.path || '');
  }

  private initializeRoutes(path) {
    this.router.get(`${path}`,authMiddleware(), permissionMiddleware(['ADMIN']), this.userController.getUsers);
    this.router.get(`${path}/:userId`,authMiddleware(), permissionMiddleware(['ADMIN']), this.userController.getUser);
    this.router.post(`${path}`,authMiddleware(), permissionMiddleware(['ADMIN']),validationMiddleware(UserAddDTO), this.userController.createUser);
    this.router.put(`${path}/:userId`,authMiddleware(), permissionMiddleware(['ADMIN']), validationMiddleware(UserEditDTO) ,this.userController.editUser);
    this.router.delete(`${path}/:userId`,authMiddleware(),  permissionMiddleware(['ADMIN']),this.userController.deleteUser)
    this.router.get(`${path}/statistic/dashboard`, authMiddleware(), permissionMiddleware(['ADMIN']), this.userController.getDashboard )
  }
}

export default UserRoute;
