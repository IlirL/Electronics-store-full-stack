import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface UserAttributes {
  id: string;
  email?: string;
  password?: string;
  fullName?: string;
  role?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserPk = "id";
export type UserId = User[UserPk];
export type UserOptionalAttributes = "id" | "email" | "password" | "fullName" | "role" | "createdAt" | "updatedAt";
export type UserCreationAttributes = Optional<UserAttributes, UserOptionalAttributes>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  id!: string;
  email?: string;
  password?: string;
  fullName?: string;
  role?: number;
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
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    fullName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'full_name'
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: true
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
