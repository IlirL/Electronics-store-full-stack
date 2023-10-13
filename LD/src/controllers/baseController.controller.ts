import { NextFunction, Request, Response } from 'express';
import { IQuerySearchParams } from '@interfaces/paginate.interface';
import { extractSequelizeModelName, formatPaginate, splitCamelCase } from '@utils/utils';
import { IRequestWithUser } from '@interfaces/auth.interface';
import responsePreparer from '@middlewares/responseHandler.middleware';
import Services from '@services';
import _ from 'lodash';

class BaseController extends Services {
  public service: any;
  public modelName: string;

  public constructor() {
    super();
    const serviceName = splitCamelCase(this.constructor.name)[0];
    this.service = this.services[_.camelCase(serviceName + 'Service')];
    this.modelName = this?.service?.model?.name ? extractSequelizeModelName(this.service.model.name) : '';
  }

  public getAll = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { limit, offset, order, orderBy }: IQuerySearchParams = formatPaginate(req.query);

      const findAll = await this.service.findAll({
        limit,
        offset,
        order: [[orderBy, order]],
      });
      return responsePreparer(200, findAll)(req, res, next);
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: IRequestWithUser | Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const find = await this.service.findById(id);
      return responsePreparer(200, find)(req, res, next);
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const create = await this.service.create(data);
      return responsePreparer(201, create)(req, res, next);
    } catch (error) {
      console.log('[ERROR] BaseController create:', error);
      next(error);
    }
  };

  public edit = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    try {
      const id = req.params[`${this.modelName}Id`] || req.params.id || null;
      const data = req.body;
      // const edited = await this.service.edit(id, data);
      const edited = await this.service.edit(data, { where: { id } });
      return responsePreparer(200, edited)(req, res, next);
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    try {
      const id = req.params[`${this.modelName}Id`] || req.params.id || null;
      const deleted = await this.service.delete(id);
      return responsePreparer(200, deleted)(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

export default BaseController;
