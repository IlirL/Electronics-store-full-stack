import { Request } from 'express';
import { Accountant } from '@models';

export interface ITokenData {
  token: string;
  expiresIn: number;
}

export interface IRequestWithUser extends Request {
  user: any;
  apiKey?: any;
  manufacturer?: any;
  headers: any;
  query: any;
  params: any;
  body: any;
  data?: any;
  status?: number;
  userIP?: string;

  accountant?: Accountant;

  namespace?: string;

  id?: string;
  ledger?: any;
  file?: any;
}
