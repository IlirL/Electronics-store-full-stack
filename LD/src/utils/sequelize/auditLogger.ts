import Sequelize from 'sequelize';

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function toArray(value) {
  return Array.isArray(value) ? value : [value];
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function cloneAttrs(model, attrs, excludeAttrs) {
  const clone = {};
  const attributes = model.getAttributes() || model.attributes;
  for (const p in attributes) {
    if (excludeAttrs.indexOf(p) > -1) continue;
    const nestedClone = {};
    const attribute = attributes[p];
    for (const np in attribute) {
      if (attrs.indexOf(np) > -1) {
        nestedClone[np] = attribute[np];
      }
    }
    clone[p] = nestedClone;
  }
  return clone;
}

export enum RevisionType {
  CREATED = 1,
  UPDATED = 2,
  DELETED = 3,
}

const Hook = {
  AFTER_CREATE: 'afterCreate',
  AFTER_UPDATE: 'afterUpdate',
  AFTER_DESTROY: 'afterDestroy',
  AFTER_SAVE: 'afterSave',
  AFTER_BULK_CREATE: 'afterBulkCreate',
};

const defaults = {
  prefix: 'revision',
  attributePrefix: '',
  suffix: '',
  schema: '',
  namespace: null,
  sequelize: null,
  exclude: [],
  tableUnderscored: true,
  underscored: false,
  revisionAttributes: null,
};

function isEmpty(string) {
  return [undefined, null, NaN, ''].indexOf(string) > -1;
}

const hooks = [Hook.AFTER_CREATE, Hook.AFTER_UPDATE, Hook.AFTER_BULK_CREATE, Hook.AFTER_DESTROY];

const attrsToClone = ['type', 'field', 'get', 'set'];

function getRevisionType(hook) {
  switch (hook) {
    case Hook.AFTER_CREATE:
    case Hook.AFTER_BULK_CREATE:
      return RevisionType.CREATED;
    case Hook.AFTER_UPDATE:
      return RevisionType.UPDATED;
    case Hook.AFTER_DESTROY:
      return RevisionType.DELETED;
  }
  throw new Error('Revision type not found for hook ' + hook);
}

export function Revision(model, customOptions = {}) {
  const options = Object.assign({}, defaults, Revision.defaults, customOptions);

  const { prefix, suffix, namespace, exclude, tableUnderscored, underscored } = options;

  if (isEmpty(prefix) && isEmpty(suffix)) {
    throw new Error('Prefix or suffix must be informed in options.');
  }

  const sequelize = options.sequelize || model.sequelize;
  const schema = options.schema || model.options.schema;
  const attributePrefix = options.attributePrefix || options.prefix;
  const tableName = `${prefix ? `${prefix}${tableUnderscored ? '_' : ''}` : ''}${model.options.tableName || model.name}${
    suffix ? `${tableUnderscored ? '_' : ''}${suffix}` : ''
  }`;
  const revisionType = `${attributePrefix}${underscored ? '_t' : 'T'}ype`;
  const revisionModelName = `${capitalize(prefix)}${capitalize(model.name)}${capitalize(suffix)}`;

  const revisionAttrs = {
    revisionId: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    revisionType: {
      type: Sequelize.INTEGER,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue('revisionType');
        return rawValue ? RevisionType[rawValue] : 'UNKNOWN';
      },
    },
    revisionCreatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    revisionChangedFields: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    revisionUserId: {
      type: Sequelize.DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      allowNull: true,
    },
  };

  const cloneModelAttrs = cloneAttrs(model, attrsToClone, exclude);
  const revisionModelAttrs = Object.assign({}, cloneModelAttrs, revisionAttrs);

  const revisionModelOptions = {
    schema,
    tableName,
    timestamps: false,
  };

  const revisionModel = sequelize.define(revisionModelName, revisionModelAttrs, revisionModelOptions);

  hooks.forEach(hook => {
    model.addHook(hook, (instanceData, { transaction }) => {
      const cls = namespace || sequelize.cls;

      let revisionTransaction;

      if (sequelize === model.sequelize) {
        revisionTransaction = cls ? cls.get('transaction') || transaction : transaction;
      } else {
        revisionTransaction = cls ? cls.get('transaction') : undefined;
      }

      const revisionType = getRevisionType(hook);
      const instancesData: any = toArray(instanceData);
      let changedValues = null;
      if (instanceData?._changed && revisionType === RevisionType.UPDATED) {
        changedValues = [];
        instanceData?._changed.forEach(changedValue => {
          if (!changedValues.includes(changedValue)) {
            changedValues.push(changedValue);
          }
        });
      }
      const revisionData = instancesData.map(data => {
        return Object.assign({}, clone(data), {
          revisionType: revisionType,
          revisionChangedFields: changedValues,
          revisionCreatedAt: new Date(),
        });
      });
      console.log('Creating revision...');
      if (revisionTransaction) {
        return revisionTransaction.afterCommit(() => revisionModel.bulkCreate(revisionData));
      } else {
        return revisionModel.bulkCreate(revisionData);
      }
    });
  });

  revisionModel.addScope('created', {
    where: { [revisionType]: RevisionType.CREATED },
  });

  revisionModel.addScope('updated', {
    where: { [revisionType]: RevisionType.UPDATED },
  });

  revisionModel.addScope('deleted', {
    where: { [revisionType]: RevisionType.DELETED },
  });

  function getRevisions(params) {
    let revisionParams: any = {};
    const modelAttributes = model.getAttributes() || model.attributes;
    const primaryKeys = Object.keys(modelAttributes).filter(attr => modelAttributes[attr].primaryKey);

    if (primaryKeys.length) {
      revisionParams.where = primaryKeys.map(attr => ({ [attr]: this[attr] })).reduce((a, b) => Object.assign({}, a, b));
    }

    if (params) {
      if (params.where) revisionParams.where = Object.assign({}, params.where, revisionParams.where);
      revisionParams = Object.assign({}, params, revisionParams);
    }

    return revisionModel.findAll(revisionParams);
  }

  // Sequelize V4 and above
  if (model.prototype) {
    if (!model.prototype.hasOwnProperty('getRevisions')) {
      model.prototype.getRevisions = getRevisions;
    }

    //Sequelize V3 and below
  } else {
    const hooksForBind = hooks.concat([Hook.AFTER_SAVE]);

    hooksForBind.forEach(hook => {
      model.addHook(hook, instance => {
        const instances = toArray(instance);
        instances.forEach(i => {
          if (!i.getRevisions) i.getRevisions = getRevisions;
        });
      });
    });
  }

  if (!model.getRevisions) {
    model.getRevisions = params => revisionModel.findAll(params);
  }

  return revisionModel;
}

Revision.defaults = Object.assign({}, defaults);
Revision.RevisionType = RevisionType;
