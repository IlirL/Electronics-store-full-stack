import { db, sequelize } from '@database';
import BaseService from './baseService.service';
import { Product } from 'database/models/product.model';
import { sequelizeQueryBuilder } from '@utils/utils';
import { HttpError } from '@exceptions/http/HttpError';



class ProductService extends BaseService {
  constructor() {
    super(db.Product);
  }

  public getProducts = async ( params:any) : Promise<{rows:Product[], count:number}> => {
    try {
        const options = sequelizeQueryBuilder({}, params, ['name', 'description']);
        return await Product.findAndCountAll(options)
    } catch (error) {
        throw new HttpError({message:'Could not get all products!', errors:error})
    }
  }

  public getProduct = async (productId:any) : Promise<Product> => {
    try {
        return await Product.findOne(
          {
            where:{id:productId},
        }
      )
    } catch (error) {
        console.log(error)
        throw new HttpError({message:'Could not get product!', errors:error})
    }
  }

  public getById = async(id:any) => {
    try {
      return await Product.findOne({where:{id}})
    } catch (error) {
      throw new HttpError({message:"Could not product by id!", errors:error})
    }
  }

  public createProduct = async (userId:any, data:any) : Promise<Product> => {
    try {
      return await sequelize.transaction(async() => {
       const product = await Product.create(data); 
        return await this.getProduct( product.id);
      })
      
    } catch (error) {
        console.log(error)
        throw new HttpError({message:'Could not create product!', errors:error})
    }
  }
   public editProduct = async ( id:any, data:any) : Promise<Product> => {
    try {

      return await sequelize.transaction(async() => {
        await Product.update(data, {where:{id}});
        return await this.getProduct( id);
      })
       
    } catch (error) {
        throw new HttpError({message:'Could not create product!', errors:error})
    }
  }

  public deleteProduct = async( id:any) => {
    try {
      const product = await this.getProduct( id);
      await Product.destroy({where:{id}})
      return product;
    } catch (error) {
      throw new HttpError({message:'Could not delete product!', errors:error})
    }
  }
}

export default ProductService;
