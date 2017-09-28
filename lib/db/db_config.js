
const DATABASE_SERVICE_NAME = process.env.DATABASE_SERVICE_NAME;
const MONGODB_USER = process.env.MONGODB_USER;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const MONGODB_DATABASE = process.env.MONGODB_DATABASE;

const dbConfig = {};
dbConfig.getMongoUrl = function () {
  const url = `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${DATABASE_SERVICE_NAME}/${MONGODB_DATABASE}`;
  return url;
};

module.exports = dbConfig;
