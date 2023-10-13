import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface ProductAttributes {
  id: string;
  name?: string;
  description?: string;
  quantity?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProductPk = "id";
export type ProductId = Product[ProductPk];
export type ProductOptionalAttributes = "id" | "name" | "description" | "quantity" |  "createdAt" | "updatedAt";
export type ProductCreationAttributes = Optional<ProductAttributes, ProductOptionalAttributes>;

export class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  id!: string;
  name?: string;
  description?: string;
  quantity?: number;
  createdAt?: Date;
  updatedAt?: Date;

 

  static associate = (models:any) => {

  }

  static initModel(sequelize: Sequelize.Sequelize): typeof Product {
    return Product.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    quantity: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    
  }, {
    sequelize,
    tableName: 'products',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "products_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
