'use strict';

const commonDB = require('../../db/common_db');
const errorUtil = require('../../errors/utils');

function getExampleCode(req, res) {
  res.status(200);
  res.send({ example_code: 'The code is foobar' });
  res.end();
}

function createExample(db, req, res, next) {
  const exCode = req.body.example_code;
  const exCol = db.use('example');
  const exampleObj = {
    code: exCode
  };

  commonDB.insert(exCol, exampleObj)
  .then(respondRequest(res, 201, { result: 'Code was added', code: exCode }))
  .catch(errorUtil.propagateError(next));
}

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
};
