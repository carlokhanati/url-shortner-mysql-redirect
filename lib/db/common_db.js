'use strict';

const _ = require('lodash');
const errorUtil = require('../errors/utils');

// resolve: return true when removed correctly.
function exist(collection, params) {
  return new Promise((resolve, reject) => {
    collection.findOne(params || {}, (error, result) => {
      if (error) {
        reject(error);
      }

      if (_.isNull(result)) {
        resolve(false);
      }
      else {
        resolve(true);
      }
    });
  });
}


// findById: return a promise.
// resolve: get back a document by id.
function findById(collection, id) {
  return new Promise((resolve, reject) => {
    collection.findById(id, (error, result) => {
      if (_.isEmpty(id)) {
        reject(errorUtil.makeError('id shouldn\'t be empty.', 500));
      }

      if (error) {
        reject(error);
      }
      else {
        resolve(result);
      }
    });
  });
}

// find: return a promise.
// resolve: get back a documents.
function find(collection, params, sort = {}, includeFields = {}) {
  return new Promise((resolve, reject) => {
    collection.find(params, includeFields).sort(sort).toArray((error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
      }
    });
  });
}

// insert: return a promise with mongodb insert/return.
// resolve: return document.
// catch: database error.
function insert(collection, body) {
  return new Promise((resolve, reject) => {
    collection.insert(body, {}, (error, result) => {
      if (error) {
        reject(handleError(error));
      }
      else {
        resolve(result);
      }
    });
  });
}

// update: return a promise with mongodb update/return.
// resolve: return updated Records.
// catch: database error.
function updateById(collection, id, body) {
  if (_.isEmpty(id)) throw errorUtil.makeError('Missing id parameter', 500);
  if (_.isEmpty(collection)) throw errorUtil.makeError('Missing Collection', 500);

  return new Promise((resolve, reject) => {
    collection.updateById(id, {
      $set: body || {}
    }, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
      }
    });
  });
}

// update: return a promise with mongodb update/return.
// resolve: return document.
// catch: database error.
function update(collection, query, body) {
  return new Promise((resolve, reject) => {
    collection.update(query, { $set: body }, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
      }
    });
  });
}


function updatePushById(collection, id, body) {
  if (_.isEmpty(id)) {
    throw errorUtil.makeError('Missing id parameter', 500);
  }

  if (_.isEmpty(collection)) {
    throw errorUtil.makeError('Missing Collection', 500);
  }

  return new Promise((resolve, reject) => {
    collection.updateById(id, {
      $push: body || {}
    }, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
      }
    });
  });
}

function updatePush(collection, query, body) {
  if (_.isEmpty(query)) {
    throw errorUtil.makeError('Missing query', 500);
  }

  if (_.isEmpty(collection)) {
    throw errorUtil.makeError('Missing Collection', 500);
  }

  return new Promise((resolve, reject) => {
    collection.update(query, {
      $push: body || {}
    }, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
      }
    });
  });
}

// removeById: return a promise.
// resolve: return true when removed correctly.
// catch: error in data base
function removeById(collection, id) {
  return new Promise((resolve, reject) => {
    collection.removeById(id, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result === 1);
      }
    });
  });
}

// removeById: return a promise.
// resolve: return true when removed correctly.
// catch: error in data base
function remove(collection, query) {
  return new Promise((resolve, reject) => {
    collection.remove(query, (error) => {
      if (error) {
        reject(handleError(error));
      }
      else {
        resolve();
      }
    });
  });
}

function handleError(error) {
  let status = 500;
  if (error.code === 11000) {
    status = 409;
  }
  return errorUtil.makeError(error.message, status);
}

module.exports = {
  exist,
  find,
  findById,
  insert,
  update,
  updateById,
  updatePushById,
  updatePush,
  removeById,
  remove
};
