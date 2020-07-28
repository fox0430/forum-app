const request = require("supertest");
const express = require("express");
const app = require('../app');

describe('GET /', () => {
  it('return Hello world', (done) => {
    request(app)
      .get("/")
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});
