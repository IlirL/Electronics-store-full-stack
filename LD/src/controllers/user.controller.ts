import { NextFunction, Response, response } from 'express';
import responsePreparer from '@middlewares/responseHandler.middleware';
import BaseController from './baseController.controller';
import { IRequestWithUser } from '@interfaces/auth.interface';

class UserController extends BaseController {
    public getUsers = async(req:IRequestWithUser, res:Response, next:NextFunction) => {
        try {
            const queryParams = req.query
            
            const users = await this.services.userService.getUsers(queryParams);

            return responsePreparer(200, users)(req,res,next);
        } catch (error) {
            next(error);
        }
    }

    public getUser = async(req:IRequestWithUser, res:Response, next:NextFunction) => {
        try {
            const {adminUserId, userId}  = req.params
            
            const user = await this.services.userService.getUser( userId);

            return responsePreparer(200, user)(req,res,next);
        } catch (error) {
            next(error);
        }
    }

    public createUser = async(req:IRequestWithUser, res:Response, next:NextFunction) => {
        try {
            const {adminUserId} = req.params;
            const data = req.body;
            const user = await this.services.userService.createUser(adminUserId, data);

            return responsePreparer(200, user)(req,res,next);

        } catch (error) {
            next(error)
        }
    }
    public editUser = async(req:IRequestWithUser, res:Response, next:NextFunction) => {
        try {
            const {adminUserId, userId} = req.params;
            const data = req.body;

            const user = await this.services.userService.editUser( userId, data);

            return responsePreparer(200, user)(req,res,next);

        } catch (error) {
            next(error)
        }
    }

    public deleteUser =  async(req:IRequestWithUser, res:Response, next:NextFunction) => {
        try {
            const {adminUserId, userId} = req.params;

            const user = await this.services.userService.deleteUser( userId);

            return responsePreparer(200, user)(req,res,next);
        } catch (error) {
            next(error)
        }
    }

    public getDashboard =  async(req:IRequestWithUser, res:Response, next:NextFunction) => {
        try {
            const dashboard = await this.services.userService.getDashboard();

            return responsePreparer(200, dashboard)(req,res,next);
        } catch (error) {
            next(error)
        }
    }
}

export default UserController;
