import { NextFunction, Response } from 'express';
import responsePreparer from '@middlewares/responseHandler.middleware';
import BaseController from './baseController.controller';
import { IRequestWithUser } from '@interfaces/auth.interface';

class ProductController extends BaseController {
    public getProducts = async(req:IRequestWithUser, res:Response, next:NextFunction) => {
        try {
            const queryParams = req.query
            
            const products = await this.services.productService.getProducts(queryParams);

            return responsePreparer(200, products)(req,res,next);
        } catch (error) {
            next(error);
        }
    }

    public getProduct = async(req:IRequestWithUser, res:Response, next:NextFunction) => {
        try {
            const {adminProductId, productId}  = req.params
            
            const product = await this.services.productService.getProduct( productId);

            return responsePreparer(200, product)(req,res,next);
        } catch (error) {
            next(error);
        }
    }

    public createProduct = async(req:IRequestWithUser, res:Response, next:NextFunction) => {
        try {
            const {user} = req;
            const data = req.body;
            const product = await this.services.productService.createProduct(user.id, data);

            return responsePreparer(200, product)(req,res,next);

        } catch (error) {
            next(error)
        }
    }
    public editProduct = async(req:IRequestWithUser, res:Response, next:NextFunction) => {
        try {
            const { productId} = req.params;
            const data = req.body;
            const {user} = req;
            const product = await this.services.productService.editProduct( productId, data);

            return responsePreparer(200, product)(req,res,next);

        } catch (error) {
            next(error)
        }
    }

    public deleteProduct =  async(req:IRequestWithUser, res:Response, next:NextFunction) => {
        try {
            const {adminProductId, productId} = req.params;

            const product = await this.services.productService.deleteProduct( productId);

            return responsePreparer(200, product)(req,res,next);
        } catch (error) {
            next(error)
        }
    }
}

export default ProductController;
