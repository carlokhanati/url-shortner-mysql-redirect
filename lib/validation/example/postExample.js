'use strict';

const Joi = require('joi');

module.exports = {
  body: {
    example_code: Joi.string().alphanum().required()
  }
};
