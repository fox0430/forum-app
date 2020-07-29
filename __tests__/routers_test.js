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

let token = '';

beforeAll(async () => {
  const url = `mongodb://127.0.0.1/forum`;
  await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

  await UserModel.create({name: 'testUser', password: 'test'});
  token = getToken('testUser');
})

describe('GET /get', () => {
  it('return get', (done) => {
    request(app)
      .get("/get")
      .then(res => {
        expect(res.statusCode).toBe(200);
        assert(res.body.value == 'get');
        done();
      });
  });
});

describe('POST /post', () => {
  it('retuen 200', (done) => {
    request(app)
      .post('/post')
      .set({authorization: 'Bearer ' + token, Accept: 'application/json'})
      .send({message: 'test'})
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
      .send({name: user, password: 'pass'})
      .set('Accept', 'application/json')
      .then(res => {
        expect(res.statusCode).toBe(200);
        assert(res.body.Token);
        done();
      });
  });
});
