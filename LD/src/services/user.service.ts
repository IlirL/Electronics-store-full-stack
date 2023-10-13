import { db, sequelize } from '@database';
import BaseService from './baseService.service';
import { User } from 'database/models/user.model';
import { sequelizeQueryBuilder } from '@utils/utils';
import { HttpError } from '@exceptions/http/HttpError';
import { Product } from '@models';



class UserService extends BaseService {
  constructor() {
    super(db.User);
  }

  public getUsers = async ( params:any) : Promise<{rows:User[], count:number}> => {
    try {
        const options = sequelizeQueryBuilder({}, params, ['name', 'email', 'role']);
        return await User.findAndCountAll(options)
    } catch (error) {
        throw new HttpError({message:'Could not get all users!', errors:error})
    }
  }

  public getUser = async (userId:any) : Promise<User> => {
    try {
        return await User.findOne(
          {
            where:{id:userId},
        }
      )
    } catch (error) {
        console.log(error)
        throw new HttpError({message:'Could not get user!', errors:error})
    }
  }

  public getById = async(id:any) => {
    try {
      return await User.findOne({where:{id}})
    } catch (error) {
      throw new HttpError({message:"Could not user by id!", errors:error})
    }
  }

  public createUser = async (adminUserId:any, data:any) : Promise<User> => {
    try {
      return await sequelize.transaction(async() => {
       const user = await User.create({...data, userId:adminUserId}); 
        return await this.getUser( user.id);
      })
      
    } catch (error) {
        console.log(error)
        throw new HttpError({message:'Could not create user!', errors:error})
    }
  }
   public editUser = async ( id:any, data:any) : Promise<User> => {
    try {

      return await sequelize.transaction(async() => {
        await User.update(data, {where:{id}});
        return await this.getUser( id);
      })
       
    } catch (error) {
        throw new HttpError({message:'Could not create user!', errors:error})
    }
  }

  public deleteUser = async( id:any) => {
    try {
      const user = await this.getUser( id);
      await User.destroy({where:{id}})
      return user
    } catch (error) {
      throw new HttpError({message:'Could not delete user!', errors:error})
    }
  }

  public getDashboard = async () => {
    try {
      return await sequelize.transaction(async() => {
        const numberOfUsers = await User.count();
        const numberOfProducts = await Product.count();

        return {numberOfUsers, numberOfProducts}
      })
    } catch (error) {
      throw new HttpError({message:'Could not get dashboard!', errors:error})
    }
  }
}

export default UserService;
