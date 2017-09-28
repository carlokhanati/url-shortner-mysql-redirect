const dotenv = require('dotenv');

dotenv.config({ silent: true });
const superagent = require('superagent');
const expect = require('chai').expect;
const jwtGen = require('aleph-jwt').generateJwtToken;

const URL_HOST = process.env.URL_HOST;
const token = jwtGen.generateJwtToken('ba254740-9d18-11e6-a253-ab7c8833d3d4-666', 'integration', 'integration.test@mailnator.com');

describe('Test example link', () => {
  it('Should return 200', (done) => {
    superagent.get(`${URL_HOST}/example`)
      .set('Accept', 'application/vnd.alephlb.com.ui+json; version=1.0')
      .set('jwt', token)
      .set('session_token', 'null')
      .end((e, res) => {
        expect(res.status).to.be.equal(200);
        done();
      });
  });
});
