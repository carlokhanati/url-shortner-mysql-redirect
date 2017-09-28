const Stomp = require('stomp-client');
const joi = require('joi');
const _ = require('lodash');
const logger = require('../utils/logger').Logger;

const QUEUE_HOST = process.env.QUEUE_HOST;
const QUEUE_PORT = process.env.QUEUE_PORT;
const QUEUE_USERNAME = process.env.QUEUE_USERNAME;
const QUEUE_PASSWORD = process.env.QUEUE_PASSWORD;
const ENV_NAME = process.env.ENV_NAME;

let client;

function start() {
  const connection = {
    host: QUEUE_HOST,
    port: QUEUE_PORT,
    user: QUEUE_USERNAME,
    pass: QUEUE_PASSWORD,
    reconnectOpts: {
      retries: 10,
      delay: 5000
    }
  };

  client = new Stomp(connection);
  client.on('error', (e) => {
    logger.error(`Queue Error: ${e.message}`);
  });

  client.connect(() => {
    logger.info('STOMP client connected');
  });
}

function stop(callback) {
  client.disconnect(() => {
    logger.info('STOMP client disconnected');
    callback();
  });
}

function handleQueue(queue, callback, validation = null) {
  client.subscribe(queue, (body) => {
    if (validation) {
      const result = joi.validate(body, validation);
      if (result.error) {
        logger.error(result.error);
        return;
      }
    }
    callback(JSON.parse(body));
  });
}

function sendMessage(queue, message) {
  const headers = {};
  headers.expires = 0;
  if (!_.isNil(ENV_NAME)) {
    if (ENV_NAME === 'SIT') {
      // message expires after 10 minutes
      const expiryDate = Date.now() + (600 * 1000);
      headers.expires = expiryDate;
    }
  }

  client.publish(queue, message, headers);
}

module.exports = {
  start,
  stop,
  sendMessage,
  handleQueue
};
