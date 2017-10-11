'use strict';

const errorUtil = require('../../errors/utils');
const shortid = require('shortid');
const formidable = require('formidable');
// removes underscores and dashes from possible characterlist
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

const validUrl = require('valid-url');
const readline = require('readline');
const fs = require('fs');
const HOST = process.env.HOST;
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const DATABASE = process.env.DATABASE;
const mysql      = require('promise-mysql');

function createConnection() {
  return mysql.createConnection({
    host     : HOST,
    user     : USER,
    password : PASSWORD,
    database : DATABASE
  });
}

function getUrl(req, res, next) {
  const urlCode = req.params.short;
  var connection;
  createConnection().then((conn)=> {
    connection = conn;
    return connection.query('SELECT * FROM URLS WHERE short_url = ?', urlCode);
  }).then((bResult)=> {
    if (bResult[0] !=null) {
      res.redirect(bResult[0].original_url);
    } else {
    // if URL is invalid, do this
    res.json({ error: "No corresponding shortlink found in the database." });
    };
    connection.end();
  }).catch(errorUtil.propagateError(next));
}

module.exports = {
  getUrl,
};
