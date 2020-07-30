const request = require("supertest");
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const assert = require('assert');

const app = require('../app');
const {UserModel, ContributionModel} = require('../mongo_schema');

const getToken = (user) => {
  const payload = {user: user};
  const option = {expiresIn: '24h'};
  const SECRET_KEY = 'secretkey';

  const token = jwt.sign(payload, SECRET_KEY, option);
  return token;
}

beforeAll(async () => {
  const url = `mongodb://127.0.0.1/forum`;
  await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

  await UserModel.create({Name: 'testUser', Password: 'test'});
})

describe('GET /get', () => {
  it('return get', async (done) => {
    // Create test data
    const countContribution = await ContributionModel.count({});
    if (countContribution == 0) {
      await ContributionModel.create({UserID: 0, Message: 'test'});
    }

    request(app)
      .get("/get")
      .then(res => {
        expect(res.statusCode).toBe(200);
        assert(res.body.Contents.length > 0);
        done();
      });
  });
});

describe('POST /post', () => {
  it('retuen 200', (done) => {
    const token = getToken('testUser');

    request(app)
      .post('/post')
      // Set tokne in headr
      .set({authorization: 'Bearer ' + token, Accept: 'application/json'})
      // Set content
      .send({Message: 'test'})
      .then(res => {
        expect(res.statusCode).toBe(200);
        done();
      });
  });
});

describe('POST /create', () => {
  it('retuen 200 and token', (done) => {
    // Generate uniq user name
    const user = mongoose.Types.ObjectId();

    request(app)
      .post('/create')
      .send({UserName: user, Password: 'pass'})
      .set('Accept', 'application/json')
      .then(res => {
        expect(res.statusCode).toBe(200);
        assert(res.body.Token);
        done();
      });
  });
});

describe('POST /login ', () => {
  it('retuen 200 and token', async (done) => {
    // Generate uniq user name
    const user = mongoose.Types.ObjectId();

    await UserModel.create({Name: user, Password: 'pass'});

    request(app)
      .post('/login')
      .send({UserName: user, Password: 'pass'})
      .set('Accept', 'application/json')
      .then(res => {
        expect(res.statusCode).toBe(200);
        assert(res.body.Token);
        done();
      });
  });
});
