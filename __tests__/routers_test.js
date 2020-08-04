const request = require("supertest");
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const assert = require('assert');
const bcrypt = require('bcrypt');

const app = require('../src/app');
const {UserModel, ContributionModel} = require('../src/mongo_schema');

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

})

describe('GET /get', () => {
  it('return contents', async (done) => {
    // Create test data
    const countContribution = await ContributionModel.count({});
    const id = mongoose.Types.ObjectId();

    const pass = 'test';
    const hashedPassword = bcrypt.hashSync(pass, 10);
    const result = await UserModel.create({Name: 'testUser', Password: hashedPassword});

    await ContributionModel.create({UserID: result._id, Message: 'test' , S3Url: 'https:example.com'});

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
      .send({Message: 'test', S3Url: 'https://example.com'})
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

    const pass = 'test';
    const hashedPassword = bcrypt.hashSync(pass, 10);
    await UserModel.create({Name: user, Password: hashedPassword});

    request(app)
      .post('/login')
      .send({UserName: user, Password: pass})
      .set('Accept', 'application/json')
      .then(res => {
        expect(res.statusCode).toBe(200);
        assert(res.body.Token);
        done();
      });
  });
});
