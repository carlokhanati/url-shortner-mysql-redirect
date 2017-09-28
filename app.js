'use strict';

const dotenv = require('dotenv');

dotenv.config({ silent: true });

const MongoDatabase = require('./lib/db/mongo_database');
const errorHandler = require('./lib/errors/errorHandler');
const ErrStrategies = require('./lib/errors/strategies');
const defaultRouter = require('./lib/routers/default');
const authenticatedRouter = require('./lib/routers/authenticated');
const express = require('express');
const queue = require('./lib/routes/queue');
const versionValidation = require('./lib/validation/version');
const validate = require('express-validation');
const logger = require('./lib/utils/logger').Logger;

const app = express();
const appErrorHandler = errorHandler([ErrStrategies.defaultStrategy]);

app.use(/^\/(?!ready).*/, validate(versionValidation.checkVersion));
app.use((req, res, next) => {
  req.getVersion = function () {
    return req.headers.accept.split('version=')[1];
  };
  next();
});
app.use('/', require('./lib/routes/index')(defaultRouter()));
app.use('/ready', require('./lib/routes/ready').ready((defaultRouter())));
app.use('/example', require('./lib/routes/example')(authenticatedRouter(), MongoDatabase));

// error handling middleware
appErrorHandler(app);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  queue.start();
  logger.info(`Server listening on port: ${PORT}`);
});

process.stdin.resume();

function exitHandler() {
  queue.stop(exitProcess);
}

function exitProcess() {
  logger.info('Exit with code 99');
  process.exit(99);
}

process.on('exit', exitHandler.bind());
process.on('SIGINT', exitHandler.bind());
process.on('uncaughtException', exitHandler.bind());
