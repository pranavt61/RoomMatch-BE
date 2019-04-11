#!/usr/bin/env node

/**
 *  @(Project): RoomMatch Backend
 *  @(Filename): init.js
 *  @(Description): Initialize MongoDB service connection
 *  @(License): MIT
 */

/**
 *  App Dependencies
 */
const MongoClient = require('mongodb').MongoClient;

var db;

function init() {
  const src = 'mongodb://localhost:27017/';

  MongoClient.connect(src, (err, client) => {
    if (err) {
      console.log("ERROR: Cannot connect to MongoClient");
      console.log(err);
      return;
    }
    
    console.log('Success: Connected to MongoClient');
    db = client.db('RoomMatch');
  });
}

module.exports = {
  init:init,
  db:db
};
