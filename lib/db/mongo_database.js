'use strict';

const mongoskin = require('mongoskin');
const dbConfig = require('./db_config');

const DBConnection = function () {
  const db = mongoskin.db(dbConfig.getMongoUrl(), { safe: true });
  this.use = function (collection) {
    return db.collection(collection);
  };
};

module.exports = new DBConnection();
