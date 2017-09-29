'use strict';

const _ = require('underscore');
const validate = require('express-validation');
const exampleValidation = require('../validation/example');
const exampleCtrl = require('../controllers/example/exampleCtrl');

validate.options({
  status: 400,
  statusText: '',
  allowUnknownBody: false,
  allowUnknownQuery: false
});

function route(router, db) {
  router.get('/', _.partial(exampleCtrl.getExampleCode));
  router.get('/new/:url(*)', _.partial(exampleCtrl.createExample, db));
  router.get('/:short', _.partial(exampleCtrl.getUrl, db));
  
  router.post('/', validate(exampleValidation.postExample), _.partial(exampleCtrl.createExample, db));
  return router;
}

module.exports = route;
