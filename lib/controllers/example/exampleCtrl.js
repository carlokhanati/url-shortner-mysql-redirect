'use strict';

const commonDB = require('../../db/common_db');
const errorUtil = require('../../errors/utils');
const shortid = require('shortid');
// removes underscores and dashes from possible characterlist
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

const validUrl = require('valid-url');

function getExampleCode(req, res) {
  var local = req.get('host');
  res.render('index', {host: local });
}

function createExample(db, req, res, next) {
  const exCode = req.params.url;
  const exCol = db.use('example');
  const exampleObj = {
    url: exCode
  };

  const local = req.get('host') + "/";

  commonDB.find(exCol,exampleObj).then((bResult)=> {
    if (bResult[0] !=null) {
      res.json({ original_url: exCode, short_url: local + bResult[0].short });
    }
    if (validUrl.isUri(exCode)) {
      // if URL is valid, do this
      var shortCode = shortid.generate();
      var newUrl = { url: exCode, short: shortCode };
      commonDB.insert(exCol,newUrl).then(()=> {
        res.json({ original_url: exCode, short_url: local + shortCode });
      })
    } else {
    // if URL is invalid, do this
      res.json({ error: "Wrong url format, make sure you have a valid protocol and real site." });
    };
  }).catch(errorUtil.propagateError(next));
}

function getUrl(db, req, res, next) {
  const exCode = req.params.short;
  const exCol = db.use('example');
  commonDB.find(exCol,{ "short": exCode }).then((result)=>{
    if (result[0] != null) {
      res.redirect(result[0].url);
    } else {
      res.json({ error: "No corresponding shortlink found in the database." });
    };
  }).catch(errorUtil.propagateError(next));
};
function respondRequest(res, code, message) {
  return function () {
    res.status(code);
    res.send(message);
    res.end();
  };
}

module.exports = {
  getExampleCode,
  createExample,
  getUrl
};
