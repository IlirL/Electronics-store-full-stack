import { RequestHandler } from 'express';
import HttpException from '@exceptions/http/HttpException';

const requestParamBodyChecker = (whatToCheck = []): RequestHandler => {
  return (req, res, next) => {
    try {
      const errors: any = {};
      for (let i = 0; i < whatToCheck.length; i++) {
        const keys = Object.keys(whatToCheck[i]);
        const check1 = whatToCheck[i][keys[0]];
        const check2 = whatToCheck[i][keys[1]];
        let param1 = req[keys[0]][check1];
        let param2 = req[keys[1]][check2];
        if (keys[0] === 'params' || keys[1] === 'params') {
          param1 = param1.toString();
          param2 = param2.toString();
        }

        if (!param1 || !param2 || param1 !== param2) {
          console.log('No match', keys[0], keys[1], whatToCheck[i]);
          errors[check1] = `${check1} must match param ${check2}`;
        }
      }
      if (Object.keys(errors).length > 0) {
        next(new HttpException(500, 'Request params miss-match', errors));
      }
      next();
    } catch (e) {
      console.log('[VALIDATION] Error:', e);
      next(new HttpException(500, e.message));
    }
  };
};
export default requestParamBodyChecker;
