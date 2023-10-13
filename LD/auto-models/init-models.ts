import type { Sequelize } from "sequelize";
import { Product as _Product } from "./product";
import type { ProductAttributes, ProductCreationAttributes } from "./product";
import { SequelizeMigration as _SequelizeMigration } from "./sequelizeMigration";
import type { SequelizeMigrationAttributes, SequelizeMigrationCreationAttributes } from "./sequelizeMigration";
import { User as _User } from "./user";
import type { UserAttributes, UserCreationAttributes } from "./user";

export {
  _Product as Product,
  _SequelizeMigration as SequelizeMigration,
  _User as User,
};

export type {
  ProductAttributes,
  ProductCreationAttributes,
  SequelizeMigrationAttributes,
  SequelizeMigrationCreationAttributes,
  UserAttributes,
  UserCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const Product = _Product.initModel(sequelize);
  const SequelizeMigration = _SequelizeMigration.initModel(sequelize);
  const User = _User.initModel(sequelize);


  return {
    Product: Product,
    SequelizeMigration: SequelizeMigration,
    User: User,
  };
}
