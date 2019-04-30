#!/usr/bin/env node
/**
 *  @(Project): RoomMatch Backend
 *  @(Filename): matches.js
 *  @(Description): MongoDB functions for Match Schema
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

async function createSwipe(swipe) {
  let resObj = resForm();

  console.log("MATCHES SERV");

  // query command
  //  Find a swipe that the other user inserted
  //  if one exists, create match
  let find_query = {
    from_user_id: new MongoObjectID(swipe.to_user_id),
    to_user_id: new MongoObjectID(swipe.from_user_id),
    like: "true"
  };

  // if match already found
  let match_query = {
    user_id_1: new MongoObjectID(swipe.to_user_id),
    user_id_2: new MongoObjectID(swipe.from_user_id)
  };

  // create swipe
  let insert_query = {
    from_user_id: new MongoObjectID(swipe.from_user_id),
    to_user_id: new MongoObjectID(swipe.to_user_id),
    like: swipe.like
  };

  try {
    const client = await MongoClient.connect(MongoSrc);
    const db = client.db('RoomMatch');

    // find existing swipe
    let res = await db.collection('swipes').findOne(find_query);
    if (res) {
      // existing match found
      res = await db.collection('matches').insertOne(match_query);
    }

    // store swipe
    res = await db.collection('swipes').insertOne(insert_query);

    await client.close();

    // Success
    console.log('Success: saved swipe to database')
    resObj.success = true;
    resObj.data = res;
    resObj.error = null;
    return resObj;
  } catch(err) {
    // Fail
    console.log("ERROR: Cannot create swipe");
    console.log(err);
    resObj.success = false;
    resObj.data = null;
    resObj.error = err;
    return resObj;
  }
}

module.exports = {
  createSwipe: createSwipe
};