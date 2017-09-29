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

  router.get('/new/:url(*)', _.partial(urlCtrl.createUrl, db));
  router.get('/:short', _.partial(urlCtrl.getUrl, db));
  
  router.post('/', validate(urlValidation.postUrl), _.partial(urlCtrl.createUrl, db));
  return router;
}

module.exports = route;
