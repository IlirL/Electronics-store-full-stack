import { HttpError } from '@exceptions/http/HttpError';
import { HttpErrorParams } from '@interfaces/httpErrorParams.interface';
import { logger } from '@utils/logger';
import { NextFunction, Response } from 'express';
import 'express-async-errors';
import { IRequestWithUser } from '@interfaces/auth.interface';
import { v4 } from 'uuid';
import config from '@config';

export type HttpErrorResponse = Required<Pick<HttpErrorParams, 'status' | 'message'> & { code: string; traceId?: string; traceUrl?: string }> &
  Pick<HttpErrorParams, 'errors' | 'stack'>;

export function errorHandler(err: HttpError, req: IRequestWithUser, res: Response, next: NextFunction): void {
  const id: string = v4();
  const response: HttpErrorResponse = {
    status: err?.errors?.status || 500,
    code: err.name,
    message: err.message,
    errors: err?.errors?.errors || {},
    traceId: id,
    traceUrl: config.grafana.url + '/d/YkZVCuL4z/accountx-logs?orgId=1&var-level=error&var-error_id=' + id,
  };

  logger.error({
    method: req.method,
    url: req.originalUrl,
    status: err.status,
    message: err.message,
    code: err.name,
    stack: err.stack,
    id: response.traceId,
    labels: { origin: 'api' },
    // message: `method="${req.method}"  url="${req.originalUrl}". status="${err.status}" message="${err.message} code=${err.name} stack=${err.stack} id=${response.traceId}"`,
  });

  res.status(response.status);
  res.json(response);

  next();
}
