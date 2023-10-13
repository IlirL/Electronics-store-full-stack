export interface IUser {
  id?: string;
  email: string;
  password: string;
  active?: boolean;
  dataValues?: any;
  clients?: any;

  createdAt?: Date;
  updatedAt?: Date;
}
