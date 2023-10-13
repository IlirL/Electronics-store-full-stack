import { Response } from 'express';
import { logger } from '@utils/logger';
import { IRequestWithUser } from '@interfaces/auth.interface';
import requestIp from 'request-ip';
import * as uuid from 'uuid';

const requestLoggerMiddleware = (req: IRequestWithUser, res: Response, time: string | number): void => {
  try {
    const method = req.method;
    const url = req.url;
    const status = res.statusCode;
    req.userIP = requestIp.getClientIp(req) || null;
    req.id = uuid.v4();

    logger.info({
      message: method,
      method,
      url,
      status,
      duration: `${time}ms`,
      ip: req.userIP,
      id: req.id,
      labels: { origin: 'api' },
    });
  } catch (error) {
    console.log('[REQUEST LOGGER MIDDLEWARE] Error:', error);
  }
};
export default requestLoggerMiddleware;
