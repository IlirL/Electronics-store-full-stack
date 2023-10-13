import { IQuerySearchParams } from '@interfaces/paginate.interface';
import { FindOptions, Op } from 'sequelize';
import _ from 'lodash';
import uuidParser from 'uuid-parse';
import { validate } from 'uuid';
import db from '@database';
import SearchBuilder from '@utils/sequelize/searchBuilder';
import moment from 'moment';
import bcrypt from 'bcrypt';
import Services, { Service } from '@services';

export const toUnderscored = obj => {
  _.forEach(obj, (k, v) => {
    obj[k] = v.replace(/(?:^|\.?)([A-Z])/g, (x, y) => `_${y.toLowerCase()}`).replace(/^_/, '');
  });
  return obj;
};

export const diffToString = val => {
  if (typeof val === 'undefined' || val === null) {
    return '';
  }
  if (val === true) {
    return '1';
  }
  if (val === false) {
    return '0';
  }
  if (typeof val === 'string') {
    return val;
  }
  if (!Number.isNaN(Number(val))) {
    return `${String(val)}`;
  }
  if ((typeof val === 'undefined' ? 'undefined' : typeof val) === 'object') {
    return `${JSON.stringify(val)}`;
  }
  if (Array.isArray(val)) {
    return `${JSON.stringify(val)}`;
  }
  return '';
};

export const isEmpty = (value: any): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (value === 'undefined' || value === undefined) {
    return true;
  } else return value !== null && typeof value === 'object' && !Object.keys(value).length;
};

export function formatPaginate(query: IQuerySearchParams): IQuerySearchParams {
  const defaultLimit = 1000;
  const order: string = query.order || 'DESC';
  const orderBy: string = query.orderBy || 'createdAt';
  const search: string = query.search || '';
  const limit = Number(query.limit) || defaultLimit;
  const offset = Number(query.offset) || 0;

  return { limit, offset, order, orderBy, search };
}

export function formatUsername(name: string): string {
  return name
    ? name
        .toLowerCase()
        .replace(/ /g, '_')
        .replace(/[^a-zA-Z0-9_ ]/g, '')
    : null;
}

export function isEmail(email: string): boolean {
  const emailRegexp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return email ? emailRegexp.test(email) : false;
}

export function getObjectDifference(a, b) {
  return _.reduce(
    a,
    function (result, value, key) {
      if (value && typeof value === 'object') {
        value = JSON.stringify(value);
      }
      if (b[key] && typeof b[key] === 'object') {
        b[key] = JSON.stringify(b[key]);
      }
      return value == b[key] ? result : result.concat(key);
    },
    [],
  );
}

export function getArrayKeysDifference(a, b) {
  return _.reduce(
    b,
    function (result, value) {
      return a.includes(value) ? result : result.concat(value);
    },
    [],
  );
}

export function removeRequestUnwantedProperties(a: any, b: any) {
  const results = {};

  for (let i = 0; i <= a.length; i++) {
    // check if request is in DTO
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if ([a[i]] !== undefined && b[a[i]] !== undefined) {
      results[a[i]] = b[a[i]];
    }
  }
  return results;
}

// search the database rows for given conditions,keyword and searchBy
export const searchGenerator = (options: any, keyword: string, searchBy = ['name']) => {
  const searchByWhat = [];
  searchBy.forEach(key =>
    searchByWhat.push({
      [key]: { [Op.iLike]: `%${keyword}%` },
    }),
  );

  options = {
    ...options,
    where: {
      ...options.where,
      [Op.or]: searchByWhat,
    },
  };

  return options;
};

export const formatIncludes = include => {
  const relationships = [];
  if (include && include.length > 0) {
    const associations = include.split(',');
    for (const association of associations) {
      if (association) relationships.push({ include: [], required: false, where: {}, association });
    }
  }
  return relationships;
};

export const dynamicOperator = a => str => b => {
  switch (str) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '/':
      return a / b;
    case '*':
      return a * b;
    case '<':
      return a < b;
    case '=':
      return a === b;
    case '>':
      return a > b;
    default:
      return 'Invalid operation';
  }
};

export const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);

export const camelCaseToUpperCase = (text: string): string | null => {
  return _.upperFirst(_.startCase(text).toLowerCase());
};

export const formatErrorText = (errors: string[]): string[] => {
  return errors.map(err => camelCaseToUpperCase(err));
};

export const extractSequelizeModelName = (modelName: string): string | null => {
  return modelName ? _.camelCase(modelName.split('Model')[0]) : null;
};

export const sanitizeWhere = obj => {
  if (obj && obj.where) {
    for (const key in obj.where) {
      if (obj.where[key] === undefined) {
        delete obj.where[key];
      }
    }
  }
  return obj;
};

export const delay = ms => new Promise(res => setTimeout(res, ms));

export const convertJSONKeys = (object, keys, invert = true) => {
  const newObject = {};
  if (invert) {
    keys = _.invert(keys);
  }
  Object.entries(object).forEach((o: any[]) => {
    newObject[keys[o[0]] ?? o[0]] = o[1];
  });
  return newObject;
};

export const hexToUUID = (hexString, invalidStringMsg = '') => {
  if (validate(hexString)) {
    return hexString;
  }
  const parsedHexString = hexString.replace(new RegExp('^0x'), '');

  if (!/[0-9A-Fa-f]{6}/g.test(parsedHexString)) {
    throw new Error(invalidStringMsg || 'Value is not valid hexadecimal number');
  }
  //Allocate 16 bytes for the uuid bytes representation
  const hexBuffer = Buffer.from(parsedHexString, 'hex');

  //Parse uuid string representation and send bytes into buffer
  const uuidResultBuffer = uuidParser.unparse(hexBuffer);

  //Create uuid utf8 string representation
  return uuidResultBuffer.toString('utf8');
};

export const sequelizeQueryBuilder = (options: FindOptions, queryParams: any, allowedKeys = ['name']) => {
  if (queryParams?.filter) {
    queryParams.filter = _.pickBy(queryParams.filter, (_value, key) => allowedKeys.includes(key));
  } else {
    queryParams.filter = {};
  }

  const generatedOptions = new SearchBuilder(db.sequelize, queryParams).getFullQuery();

  generatedOptions.where = {
    ...generatedOptions.where,
    ...options.where,
  };

  console.log('Generated options', generatedOptions);
  return generatedOptions;
};

export class StatisticUtils {
  static groupByRestaurant(orderPackages: any[]) {
    const fromDate = moment('2018-05-01', 'YYYY-MM-DD');
    const toDate = moment('2018-07-01', 'YYYY-MM-DD');
    const monthData = [];

    while (toDate > fromDate || fromDate.format('M') === toDate.format('M')) {
      monthData.push(fromDate.format('YYYY-MM'));
      fromDate.add(1, 'month');
    }

    return (
      _.chain(orderPackages)
        // Group the elements of Array based on `color` property
        .groupBy('month')
        // `key` is group's name (color), `value` is the array of objects
        .map((value, key) => ({ month: key, data: value }))
        .value()
    );
  }
}

export const splitCamelCase = (string: string) => string.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ');

export async function hashPassword(password, saltRounds = 10) {
  return await bcrypt.hash(password, saltRounds);
}
export function hashSyncPassword(password, saltRounds = 10) {
  return bcrypt.hashSync(password, saltRounds);
}

export async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

export function getDTOvalues(dto: any) {
  return Object.values(dto).filter(value => typeof value === 'string');
}



export const services = () => Services.getInstance();
export type ServiceType = Service;

