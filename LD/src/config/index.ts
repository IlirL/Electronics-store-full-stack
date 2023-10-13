const cfg = {
  app: {
    port: parseInt(process.env.PORT) || 3000,
    env: process.env.NODE_ENV || 'development',
    sequelize: {
      searchBuilder: {
        logging: false,
        fields: {
          filter: 'filter',
          order: 'order',
          limit: 'limit',
          offset: 'offset',
        },
        defaultLimit: 50,
      },
    },
    baseUrl: process.env.BASE_URL,
    generalS3Folder: process.env.GENERAL_S3_FOLDER,
  },
  auth: {
    secret: process.env.JWT_SECRET,
    issuer: process.env.JWT_ISSUER,
    validMins: process.env.JWT_VALID_MINS ? parseInt(process.env.JWT_VALID_MINS) : 3600,
    exchangeRateAPI: process.env.CURRENCY_EXCHAGE_RATES_API_KEY,
  },
  postgres: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
    port: parseInt(process.env.POSTGRES_PORT),
    dialectOptions:
      process.env.POSTGRES_SSL_REQUIRE === 'true'
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: process.env.POSTGRES_SSL_REJECTUNAUTH === 'true',
            },
          }
        : {},
    pool: process.env.POSTGRES_POOL_MAX // only configure pool if one of the pool envars is set
      ? {
          max: parseInt(process.env.POSTGRES_POOL_MAX),
          min: parseInt(process.env.POSTGRES_POOL_MIN),
          acquire: parseInt(process.env.POSTGRES_POOL_ACQUIRE),
          idle: parseInt(process.env.POSTGRES_POOL_IDLE),
        }
      : {},
  },
  redis: {
    password: process.env.REDIS_PASSWORD,
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
  },
  grafana: {
    url: process.env.GRAFANA_URL,
    lokiUrl: process.env.GRAFANA_LOKI_URL,
  },
};

export default cfg;
