'use strict';

const _ = require('underscore');
const validate = require('express-validation');
const urlValidation = require('../validation/url');
const urlCtrl = require('../controllers/url/urlCtrl');

validate.options({
  status: 400,
  statusText: '',
  allowUnknownBody: false,
  allowUnknownQuery: false
});

function route(router, db) {
  router.get('/', _.partial(urlCtrl.getUrlCode));
  router.get('/upload', _.partial(urlCtrl.prepareUrlUpload));
  router.get('/file/latest', _.partial(urlCtrl.getLatestUrlUpload));
  router.post('/upload', _.partial(urlCtrl.handleUrlUpload,db));

  router.post('/new', _.partial(urlCtrl.createUrl, db));
  router.get('/:short', _.partial(urlCtrl.getUrl, db));
  
  return router;
}

module.exports = route;
