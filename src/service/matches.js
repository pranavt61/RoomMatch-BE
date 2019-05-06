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

const socketServices = require('./socket');

// Link to Mongo Service
const MongoSrc = require('./MongoSrc.js');

async function createSwipe(swipe) {
  let resObj = resForm();

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
    chat: [],
    user_ids: [
      new MongoObjectID(swipe.to_user_id),
      new MongoObjectID(swipe.from_user_id)
    ]
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

      // emit socket event
      socketServices.match_emit(swipe.from_user_id, swipe.to_user_id);
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

async function getMatches(user_id) {
  let resObj = resForm();

  // query command
  let find_query = {
    user_ids: new MongoObjectID(user_id)
  };

  try {
    const client = await MongoClient.connect(MongoSrc);
    const db = client.db('RoomMatch');

    // find existing swipe
    let res = await db.collection('matches').find(find_query).toArray();
    await client.close();

    // Success
    console.log('Success: retrieved matches from database')
    resObj.success = true;
    resObj.data = res;
    resObj.error = null;
    return resObj;
  } catch(err) {
    // Fail
    console.log("ERROR: Cannot retrive matches");
    console.log(err);
    resObj.success = false;
    resObj.data = null;
    resObj.error = err;
    return resObj;
  }
}

async function getChat(match_id) {
  let resObj = resForm();

  // query command
  let find_query = {
    _id: new MongoObjectID(match_id)
  };

  try {
    const client = await MongoClient.connect(MongoSrc);
    const db = client.db('RoomMatch');

    // find existing swipe
    let res = await db.collection('matches').find(find_query).toArray();
    await client.close();

    // Success
    console.log('Success: retrieved match from database')
    resObj.success = true;
    resObj.data = res;
    resObj.error = null;
    return resObj;
  } catch(err) {
    // Fail
    console.log("ERROR: Cannot retrive matches");
    console.log(err);
    resObj.success = false;
    resObj.data = null;
    resObj.error = err;
    return resObj;
  }
}

async function addChat(match_id, user_id, message) {
  let resObj = resForm();

  // query command
  let find_query = {
    _id: new MongoObjectID(match_id)
  };

  let update_query = {
    $push: {
      chat: {
        $each: [{
          from: new MongoObjectID(user_id),
          message: message,
          timestamp: new Date().getTime()
        }],
        $sort: { timestamp: -1 }
      }
    }
  }

  try {
    const client = await MongoClient.connect(MongoSrc);
    const db = client.db('RoomMatch');

    // find existing swipe
    let res = await db.collection('matches').updateOne(find_query, update_query);
  
    socketServices.chat_emit(match_id, user_id, message);

    await client.close();

    // Success
    console.log('Success: chat saved to database')
    resObj.success = true;
    resObj.data = res;
    resObj.error = null;
    return resObj;
  } catch(err) {
    // Fail
    console.log("ERROR: Cannot save chat");
    console.log(err);
    resObj.success = false;
    resObj.data = null;
    resObj.error = err;
    return resObj;
  }
}

module.exports = {
  createSwipe: createSwipe,
  getMatches: getMatches,
  addChat: addChat,
  getChat: getChat
};
