import { bool, cleanEnv, host, port, str } from 'envalid';

function validateEnv() {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    POSTGRES_USER: str(),
    POSTGRES_PASSWORD: str(),
    POSTGRES_HOST: host(),
    POSTGRES_PORT: port(),
    POSTGRES_DATABASE: str(),
    POSTGRES_SSL_REQUIRE: bool(),
    POSTGRES_SSL_REJECTUNAUTH: bool(),
    S3_ENDPOINT: host(),
    S3_PORT: port(),
    S3_USE_SSL: bool(),
    S3_BUCKET: str(),
    S3_ACCESS_KEY: str(),
    S3_SECRET_KEY: str(),
    REDIS_HOST: host(),
    REDIS_PORT: port(),
    JWT_SECRET: str(),
    JWT_ISSUER: str(),
    JWT_VALID_MINS: str(),
    GRAFANA_URL: str(),
    GRAFANA_LOKI_URL: str(),
    BASE_URL: str(),
    GENERAL_S3_FOLDER: str(),
  });
}

export default validateEnv;
