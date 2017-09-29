'use strict';

const commonDB = require('../../db/common_db');
const errorUtil = require('../../errors/utils');
const shortid = require('shortid');
const formidable = require('formidable');
// removes underscores and dashes from possible characterlist
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

const validUrl = require('valid-url');
const readline = require('readline');
const fs = require('fs');

function getUrlCode(req, res) {
  const local = req.get('host');
  res.render('index', {host: local });
}

function prepareUrlUpload(req, res) {
  const local = req.get('host');
  res.render('upload', {host: local });
}

function handleUrlUpload(db, req, res, next) {
  const local = req.get('host') + "/";
  const form = new formidable.IncomingForm();
  
      form.parse(req);
  
      form.on('fileBegin', function (name, file){
          file.path = __dirname + '/uploads/latesturls.txt';
      });
  
      form.on('file', function (name, file){
        file.path = __dirname + '/uploads/';

        var ws = fs.createWriteStream(file.path + 'lastestshortenurls.csv', { flags: 'r+', defaultEncoding: 'utf8' })
        
        const rl = readline.createInterface({
          input: fs.createReadStream(file.path + 'latesturls.txt'),
        });
        
        rl.on('line', (line) => {
          const urlCode = line;
          const urlCol = db.use('url');
          const urlObj = {
            url: urlCode
          };
          commonDB.find(urlCol,urlObj).then((bResult)=> {
            if (bResult[0] !=null) {
              ws.write(`${urlCode},${local + bResult[0].short}\n`);
            } else
            if (validUrl.isUri(urlCode)) {
            // if URL is valid, do this
              var shortCode = shortid.generate();
              var newUrl = { url: urlCode, short: shortCode };
              commonDB.insert(urlCol,newUrl).then(()=> {
                ws.write(`${urlCode},${local + shortCode}\n`);
              })
            } else {
            // if URL is invalid, do this
              ws.write(`${urlCode},Wrong url format make sure you have a valid protocol and real site.\n`);
            };
          }).catch(() =>{ ws.write(`${urlCode},Wrong url format make sure you have a valid protocol and real site.\n`);});
        }).on('close', () => {
          res.send('file uploaded');
        });
      })
}

function createUrl(db, req, res, next) {
  const urlCode = req.params.url;
  const urlCol = db.use('url');
  const urlObj = {
    url: urlCode
  };

  const local = req.get('host') + "/";

  commonDB.find(urlCol,urlObj).then((bResult)=> {
    if (bResult[0] !=null) {
      res.json({ original_url: urlCode, short_url: local + bResult[0].short });
    }
    else if (validUrl.isUri(urlCode)) {
      // if URL is valid, do this
      var shortCode = shortid.generate();
      var newUrl = { url: urlCode, short: shortCode };
      commonDB.insert(urlCol,newUrl).then(()=> {
        res.json({ original_url: urlCode, short_url: local + shortCode });
      })
    } else {
    // if URL is invalid, do this
      res.json({ error: "Wrong url format, make sure you have a valid protocol and real site." });
    };
  }).catch(errorUtil.propagateError(next));
}

function getUrl(db, req, res, next) {
  const urlCode = req.params.short;
  const urlCol = db.use('url');
  commonDB.find(urlCol,{ "short": urlCode }).then((result)=>{
    if (result[0] != null) {
      res.redirect(result[0].url);
    } else {
      res.json({ error: "No corresponding shortlink found in the database." });
    };
  }).catch(errorUtil.propagateError(next));
};

function getLatestUrlUpload(req, res) {
  res.download(__dirname + '/uploads/lastestshortenurls.csv')
}
function respondRequest(res, code, message) {
  return function () {
    res.status(code);
    res.send(message);
    res.end();
  };
}

module.exports = {
  getUrlCode,
  createUrl,
  getUrl,
  prepareUrlUpload,
  handleUrlUpload,
  getLatestUrlUpload
};
