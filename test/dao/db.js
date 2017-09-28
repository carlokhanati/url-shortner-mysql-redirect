// TODO this test will fail on jenkins because it can't see mongodb
const dotenv = require('dotenv');

dotenv.config({ silent: true });
const assert = require('chai').assert;
const DBConnection = require('../../lib/db/mongo_database');
const common = require('../../lib/db/common_db');

describe('Testing DB Functions', () => {
  let db = null;
  let user = null;
  let id = null;

  before(() => {
        // runs before all tests in this block
    db = DBConnection;
    user = db.use('user');

    user.insert({
      name: 'Tom',
      age: 40,
      weight: 50
    }, {}, (error, results) => {
      id = results.ops[0]._id;
            // console.log(results)
    });
  });

  after(() => {
        // runs before all tests in this block
    user.removeById(id, () => {
            // console.log('deleted')
    });
  });

  it('testing db#exist', () => {
    assert.isFunction(common.exist);
    return common.exist(db.use('user'), {
      age: 40
    })
            .then((o) => {
              assert.isTrue(o, 'we should find this document. should be true');
            }).catch((error) => {
              assert.isNull(error, 'no error should be thrown.');
            });
  });

  it('testing db#findById', () => {
    assert.isFunction(common.findById);
    return common.findById(db.use('user'), id)
            .then((result) => {
              assert.isObject(result, 'return an array.');
              assert.isDefined(result.name, 'result.name has been defined');
              assert.isDefined(result.age, 'result.age has been defined');
              assert.isDefined(result.weight, 'result.weight has been defined');
              assert.isDefined(result._id, 'result.id has been defined');
              assert.equal(result.age, 40, 'should be 40 years old');
            }).catch((error) => {
              assert.isNull(error, 'no error should be thrown.');
            });
  });

  it('testing db#find', () => {
    assert.isFunction(common.find);

    return common.find(db.use('user'), { age: 40 })
            .then((results) => {
              assert.isArray(results, 'find should return an array');
              const result = results[0];
              assert.isObject(result, 'return an array.');
              assert.isDefined(result.name, 'result.name has been defined');
              assert.isDefined(result.age, 'result.age has been defined');
              assert.isDefined(result.weight, 'result.weight has been defined');
              assert.isDefined(result._id, 'result.id has been defined');
              assert.equal(result.age, 40, 'should be 40 years old');
            });
  });

  it('testing db#findById with empty id should generate an error.', () => {
    assert.isFunction(common.findById);
    return common.findById(db.use('user'), null).catch((error) => {
      assert.isNotNull(error, 'no error should be thrown.');
    });
  });

  it('testing db#create with empty id should generate an error.', () => {
    assert.isFunction(common.findById);

    return common.insert(db.use('user'), {
      name: 'Tom',
      age: 40,
      weight: 50
    })
            .then((results) => {
              const result = results[0];
              assert.isObject(result, 'return an object.');
              assert.isDefined(result.name, 'result.name has been defined');
              assert.isDefined(result.age, 'result.age has been defined');
              assert.isDefined(result.weight, 'result.weight has been defined');
              assert.isDefined(result._id, 'result.id has been defined');
              assert.equal(result.age, 40, 'should be 40 years old');
            }).catch((error) => {
              assert.isNotNull(error, 'no error should be thrown.');
            });
  });

  it('testing db#removeById with empty id should generate an error.', () => {
    assert.isFunction(common.removeById);

    return common.removeById(db.use('user'), id)
            .then((result) => {
              assert.isTrue(result);
            });
  });
});
