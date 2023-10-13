import Sequelize from 'sequelize';
import cls from 'cls-hooked';
import config from '@config';
import { logger } from '@utils/logger';
import * as models from '@models';
import HttpException from '@exceptions/http/HttpException';
import _ from 'lodash';
// import { SequelizeAuto } from 'sequelize-auto';
const namespace = cls.createNamespace('accounting-namepsace');
Sequelize['useCLS'](namespace);

const options = {
  host: config.postgres.host,
  dialect: config.postgres.dialect as Sequelize.Dialect,
  timezone: '+00:00',
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    underscored: true,
    freezeTableName: true,
  },
  port: config.postgres.port,
  dialectOptions: config.postgres.dialectOptions,
  pool: config.postgres.pool,
  logQueryParameters: config.app.env === 'development',
  // logging: false,
  logging: (query, time) => {
    logger.info({
      message: 'SEQUELIZE',
      query: query?.replace('Executed (default): ', ''),
      duration: `${time}ms`,
      labels: { origin: 'database' },
    });
  },
  benchmark: true,
};
export const sequelize = new Sequelize.Sequelize(config.postgres.database, config.postgres.username, config.postgres.password, options);

sequelize.query = function () {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line prefer-rest-params
  return Sequelize?.prototype?.query?.apply(this, arguments).catch(err => {
    const message = [];
    const errors: any = {};
    if (err instanceof Sequelize.ValidationError) {
      err.errors.forEach(error => {
        const errorMessage = _.capitalize(error.message);
        message.push(errorMessage);
        errors[error.path] = errorMessage;
      });
      throw new HttpException(400, message.join(', '), errors);
    }
    throw new HttpException(400, err.message, err);
  });
};

sequelize
  .authenticate()
  .then(async () => {
    // new SequelizeAuto(config.postgres.database, config.postgres.username, config.postgres.password, {
    //   host: config.postgres.host,
    //   dialect: config.postgres.dialect as Sequelize.Dialect,
    //   port: config.postgres.port,
    //   caseModel: 'p',
    //   caseFile: 'c',
    //   caseProp: 'c',
    //   lang: 'ts',
    //   singularize: true,
    //   useDefine: false,
    //   directory: './auto-models',
    //   // noWrite: true,
    // }).run();

    logger.info({ message: `Database connection established successfully`, labels: { origin: 'database' } });
  })
  .catch((error: Error) => {
    logger.error({ message: `Unable to connect to the database. error=${error}`, labels: { origin: 'database' } });
  });

const initiatedModels: any = {};
Object.keys(models).forEach(key => {
  const currentModel = models[key];
  initiatedModels[key] = currentModel.initModel(sequelize);
});

Object.keys(initiatedModels).forEach(modelName => {
  if (initiatedModels[modelName] && initiatedModels[modelName].associate) {
    initiatedModels[modelName].associate(initiatedModels);
  }
});

export const db = {
  ...initiatedModels,
  sequelize,
  Sequelize, // library
};
export default db;
