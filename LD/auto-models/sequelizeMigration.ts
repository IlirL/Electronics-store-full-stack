import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface SequelizeMigrationAttributes {
  name: string;
}

export type SequelizeMigrationPk = "name";
export type SequelizeMigrationId = SequelizeMigration[SequelizeMigrationPk];
export type SequelizeMigrationCreationAttributes = SequelizeMigrationAttributes;

export class SequelizeMigration extends Model<SequelizeMigrationAttributes, SequelizeMigrationCreationAttributes> implements SequelizeMigrationAttributes {
  name!: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof SequelizeMigration {
    return SequelizeMigration.init({
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'sequelize_migrations',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "sequelize_migrations_pkey",
        unique: true,
        fields: [
          { name: "name" },
        ]
      },
    ]
  });
  }
}
