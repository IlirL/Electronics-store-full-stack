import { AllUserRoles } from '@dtos/user.dto';
import { hashSyncPassword } from '@utils/utils';
import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface UserAttributes {
  id?: string;
  email?: string;
  password?: string;
  fullName?: string;
  role?: number | string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserPk = "id";
export type UserId = User[UserPk];
export type UserOptionalAttributes = "id" | "email" | "password" | "fullName" | "role" | "createdAt" | "updatedAt";
export type UserCreationAttributes = Optional<UserAttributes, UserOptionalAttributes>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  id?: string;
  email?: string;
  password?: string;
  fullName?: string;
  role?: number | string;
  createdAt?: Date;
  updatedAt?: Date;


  static initModel(sequelize: Sequelize.Sequelize): typeof User {
    return User.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
      set(value:string){
        this.setDataValue('password', hashSyncPassword(value))
      }
    },
    fullName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'full_name'
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: true,
      get(){
        return AllUserRoles[this.getDataValue('role')]
      },
      set(value:string){
        return this.setDataValue('role', AllUserRoles[value])
      }
    }
  }, {
    sequelize,
    tableName: 'users',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "users_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
