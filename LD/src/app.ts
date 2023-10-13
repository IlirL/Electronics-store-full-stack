import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import Routes from '@interfaces/routes.interface';
import { logger, stream } from '@utils/logger';
import config from '@config';
import cors from 'cors';
import bodyParser from 'body-parser';
import successMiddleware from '@middlewares/success.middleware';
import swagger from './swagger';
import path from 'path';
import { errorHandler } from '@middlewares/errorHandler.middleware';
import responseTime from 'response-time';
import requestLoggerMiddleware from '@middlewares/requestLogger.middleware';

class App {
  public app: express.Application;
  public port: string | number;
  public env: string;

  constructor(routes: Routes[]) {
    this.app = express();
    this.port = config.app.port;
    this.env = config.app.env;

    this.initializeMiddlewares();
    this.initializeRoutes(routes,);
    this.initializeSwagger();
    this.initializeErrorHandling();
    this.initializeStaticRoutes();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info({ message: `App listening on the port: ${this.port}`, labels: { origin: 'app' } });
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
  this.app.use(responseTime(requestLoggerMiddleware));

  if (this.env === 'production') {
    this.app.use(morgan('combined', { stream }));
  } else if (this.env === 'development') {
    this.app.use(morgan('dev', { stream }));
  }

  this.app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );
  this.app.use(compression());
  this.app.use(bodyParser.json());
  this.app.use(express.urlencoded({ extended: true }));
  this.app.use(cookieParser());

  // Configure CORS middleware
  const corsOptions = {
    origin: 'http://localhost:3000', // Allow requests from your frontend
    credentials: true, // Allow credentials (e.g., cookies) to be sent with requests
    maxAge: 86400, // Optional: set a maximum age for CORS preflight requests
  };

  this.app.use(cors(corsOptions));
}

  private initializeStaticRoutes() {
    this.app.use('/public', express.static(path.join(__dirname, 'public')));
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/api', route.router);
    });
  }

  private initializeSwagger() {
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger));
  }

  private initializeErrorHandling() {
    this.app.use(successMiddleware);
    this.app.use(errorHandler);
  }


}

export default App;
