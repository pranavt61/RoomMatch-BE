#!/usr/bin/env node
/**
 *  @(Project): RoomMatch Backend
 *  @(Filename): users.js
 *  @(Description): MongoDB functions for User Schema
 *  @(License): MIT
 */

/**
 *  App Dependencies
 */
const MongoClient = require('mongodb').MongoClient;
const MongoObjectID = require('mongodb').ObjectID;
const resForm = require('../util/responseFormatter');

// Link to Mongo Service
const MongoSrc = require('./MongoSrc.js');

// Create a User
async function createUser(email) {
  let resObj = resForm();

  // Query param
  const userObj = {
    email: email
  };

  try {
    const client = await MongoClient.connect(MongoSrc);

    const db = client.db('RoomMatch');

    const res = await db.collection('users').insertOne(userObj);
    await client.close();

    console.log('Success: saved user to database')

    resObj.success = true;
    resObj.data = res;
    resObj.error = null;
    return resObj;
  } catch(err) {
    console.log("ERROR: Cannot create User");
    console.log(err);

    resObj.success = false;
    resObj.data = null;
    resObj.error = err;
    return resObj;
  }
}

// Retrieve a User with email
async function getUser(email) {
  let resObj = resForm();

  try {
    const client = await MongoClient.connect(MongoSrc);

    const db = client.db('RoomMatch');

    const res = await db.collection('users').findOne({email: email});
    await client.close();

    if (res) {
      // user found
      resObj.success = true;
      resObj.data = res;
      resObj.error = null;
      return resObj;
    } else {
      // user not found
      resObj.success = false;
      resObj.data = null;
      resObj.error = "No user found";
      return resObj;
    }
  } catch(err) {
    console.log("ERROR: Cannot get User");
    console.log(err);

    resObj.success = false;
    resObj.data = null;
    resObj.error = err;
    return resObj;
  }
}

// delete a user by id
async function deleteUser(id) {
  let resObj = resForm();

  try {
    const client = await MongoClient.connect(MongoSrc);

    const db = client.db('RoomMatch');

    const res = await db.collection('users').deleteOne({_id: new MongoObjectID(id)});
    await client.close();

    resObj.success = true;
    resObj.data = res;
    resObj.error = null;
    return resObj;
  } catch(err) {
    console.log("ERROR: Cannot delete User");
    console.log(err);

    resObj.success = false;
    resObj.data = null;
    resObj.error = err;
    return resObj;
  }
}

module.exports = {
  createUser: createUser,
  getUser: getUser,
  deleteUser: deleteUser
};
