'use strict';

const Joi = require('joi');

module.exports = {
  headers: Joi.object({
    accept: Joi.string().regex(/^\bapplication\/vnd\.alephlb\.com\.\b/).required()
  })
};
