const dotenv = require('dotenv');

dotenv.config({ silent: true });
const superagent = require('superagent');
const expect = require('chai').expect;
const URL_HOST = process.env.URL_HOST;

describe('Test example link', () => {
  it('Should return 200', (done) => {
    superagent.get(`${URL_HOST}/example`)
      .set('Accept', 'application/vnd.alephlb.com.ui+json; version=1.0')
      .set('session_token', 'null')
      .end((e, res) => {
        expect(res.status).to.be.equal(200);
        done();
      });
  });
});
