const request = require("supertest");
const express = require("express");
const assert = require('assert');
const app = require('../app');

describe('GET /get', () => {
  it('return get', (done) => {
    request(app)
      .get("/get")
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.statusCode).toBe(200);
        const result = res.body;
        console.log(result);
        assert(result.value == 'get');
        done();
      });
  });
});

describe('POST /post', () => {
  it('retuen 200', (done) => {
    request(app)
      .post('/post')
      .send({username: 'user', password: 'pass', content: 'test'})
      .set('Content-Type', /json/)
      .then(res => {
        expect(res.statusCode).toBe(200);
        done();
      });
  });
});

describe('POST /register', () => {
  it('retuen 200', (done) => {
    request(app)
      .post('/post')
      .send({username: 'user', password: 'pass'})
      .set('Content-Type', /json/)
      .then(res => {
        expect(res.statusCode).toBe(200);
        done();
      });
  });
});
