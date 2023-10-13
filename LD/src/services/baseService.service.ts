import { isEmpty } from 'class-validator';
import type { CreateOptions, DestroyOptions, FindOptions, UpdateOptions } from 'sequelize';
import { ServiceType, camelCaseToUpperCase, extractSequelizeModelName, sanitizeWhere, services } from '@utils/utils';

class BaseService {
  public model: any;
  public services?: ServiceType;

  public constructor(model?: any) {
    this.model = model;
    this.services = services();
  }

  public async findAll(options?: FindOptions): Promise<any> {
    return await this.model.findAll(sanitizeWhere(options));
  }

  public async findById(id: string, options?: FindOptions): Promise<any | null> {
    if (isEmpty(id)) throw new Error('Missing id');

    return await this.model.findByPk(id, sanitizeWhere(options));
  }

  public async find(options?: FindOptions): Promise<any | null> {
    return await this.model.findOne(sanitizeWhere(options));
  }

  public async create(data: any, options?: CreateOptions): Promise<any | null> {
    return await this.model.create(data, sanitizeWhere(options));
  }

  public async edit(data: any, options?: UpdateOptions): Promise<any | null> {
    return await this.model.update(data, sanitizeWhere(options));
  }

  public async findAndEdit(data: any, options?: any): Promise<any | null> {
    const currentModel = await this.find(options);
    if (!currentModel) throw new Error(`${camelCaseToUpperCase(extractSequelizeModelName(this.model.name))} not found`);
    return await currentModel.update(data, sanitizeWhere(options));
  }

  public async delete(options: DestroyOptions | any): Promise<any | null> {
    return await this.model.destroy(options);
  }

  public async findAndDelete(options?: DestroyOptions | any): Promise<any | null> {
    const currentModel = await this.find(options);
    if (!currentModel) throw new Error(`${camelCaseToUpperCase(extractSequelizeModelName(this.model.name))} not found`);
    await currentModel.destroy();
    return currentModel;
  }

  public async findAndDeleteWithModel(model: any, options: any): Promise<any> {
    const modelToDelete = await model.findOne(options);
    await model.destroy(options);

    return modelToDelete;
  }
  public async findAndDeleteAll(model: any, options: any): Promise<any> {
    const modelsToDelete = await model.findAll(options);
    await model.destroy(options);

    return modelsToDelete;
  }
}

export default BaseService;
