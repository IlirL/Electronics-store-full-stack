
import ProductController from "@controllers/product.controller";
import { ProductAddDTO } from "@dtos/product.dto";
import IRoute from "@interfaces/routes.interface";
import authMiddleware from "@middlewares/auth.middleware";
import permissionMiddleware from "@middlewares/permission.middleware";
import validationMiddleware from "@middlewares/validation.middleware";
import { Router } from "express";


class ProductRoute implements IRoute {
  public path;
  public router = Router();
  public productController = new ProductController();

  constructor(path) {
    this.path = path;
    this.initializeRoutes(this.path || '');
  }

  private initializeRoutes(path) {
    this.router.get(`${path}`,authMiddleware(), permissionMiddleware(['ADMIN', 'EMPLOYEE', 'USER']), this.productController.getProducts);
    this.router.get(`${path}/:productId`,authMiddleware(), permissionMiddleware(['ADMIN', 'EMPLOYEE', 'USER']), this.productController.getProduct);
    this.router.post(`${path}`,authMiddleware(), permissionMiddleware(['ADMIN', 'EMPLOYEE']),validationMiddleware(ProductAddDTO), this.productController.createProduct);
    this.router.put(`${path}/:productId`,authMiddleware(), permissionMiddleware(['ADMIN', 'EMPLOYEE']), validationMiddleware(ProductAddDTO) ,this.productController.editProduct);
    this.router.delete(`${path}/:productId`,authMiddleware(),  permissionMiddleware(['ADMIN', 'EMPLOYEE']),this.productController.deleteProduct)
  }
}

export default ProductRoute;
