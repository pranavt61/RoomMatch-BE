#!/usr/bin/env node
/**
 *  @(Project): RoomMatch Backend
 *  @(Filename): socket.js
 *  @(Description): Socket.IO events and Mongo calls
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
async function checkinSocket(user_id, socket_id) {
  let resObj = resForm();

  // Query param
  const find_query = {
    user_id: new MongoObjectID(user_id)
  };

  const checkin_query = {
    user_id: new MongoObjectID(user_id),
    socket_id: socket_id
  };

  try {
    const client = await MongoClient.connect(MongoSrc);

    const db = client.db('RoomMatch');
    
    const find_res = await db.collection('sockets').findOne(find_query);
    
    let res = null;
    if (find_res) {
      // socket id exists
      // Overwrite
      res = await db.collection('sockets').updateOne(find_query, { $set: checkin_query }); 
    } else {
      // no socket id stored yet
      // Create
      res = await db.collection('sockets').insertOne(checkin_query);
    }

    await client.close();

    console.log('Success: saved socket to database')

    resObj.success = true;
    resObj.data = res;
    resObj.error = null;
    return resObj;
  } catch(err) {
    console.log("ERROR: Cannot create Socket");
    console.log(err);

    resObj.success = false;
    resObj.data = null;
    resObj.error = err;
    return resObj;
  }
}

// get socket id from user_id
async function getSocketID(user_id) {
  let resObj = resForm();

  // query
  const find_query = {
    user_id: new MongoObjectID(user_id)
  };

  try {
    const client = await MongoClient.connect(MongoSrc);

    const db = client.db('RoomMatch');
    
    const res = await db.collection('sockets').findOne(find_query);
    
    await client.close();

    if (!res) {
      throw "No Socket found";
    }

    resObj.success = true;
    resObj.data = res;
    resObj.error = null;
    return resObj;
  } catch(err) {
    console.log("ERROR: Cannot create Socket");
    console.log(err);

    resObj.success = false;
    resObj.data = null;
    resObj.error = err;
    return resObj;
  }
}

async function getMatch(match_id) {
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
    console.log('Success: retrieved matches from database')
    resObj.success = true;
    resObj.data = res[0];
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

let global_io = null;

// Sockets Events
const init = (io) => {

  global_io = io;

  io.on('connection', (socket) => {
    console.log("SOCKETIO: user has connected: " + socket.id);
    console.log(global_io.clients);

    // store socket id in Mongo
    socket.on("check-in", (user_id) => {
      const socket_id = socket.id;

      checkinSocket(user_id, socket_id)
        .then((res) => {}).catch((err) => {});
    });
  }); 
};

// Emit Events
const match_emit = (from_user_id, to_user_id) => {

  let from_socket = null;
  let to_socket = null;

  getSocketID(from_user_id).then((res) => {
    if (res.success) {
      from_socket = res.data.socket_id;
    } else {
      // no socket found
    }

    return getSocketID(to_user_id);
  }).then((res) => {
    if (res.success) {
      to_socket = res.data.socket_id;
    } else {
      // no socket found
    }

    // emit
    if (from_socket && global_io.sockets.connected[from_socket]) {
      global_io.sockets.connected[from_socket].emit('match', {
        from: from_user_id,
        to: to_user_id
      });
    }

    if (to_socket && global_io.sockets.connected[to_socket]) {
      global_io.sockets.connected[to_socket].emit('match', {
        from: to_user_id,
        to: from_user_id
      });
    }
  }).catch((err) => {
    console.log("ERROR: Match emit error");
    console.log(err);
  });
};

const chat_emit = (match_id, user_id, message) => {

  let to_socket = null;

  getMatch(match_id).then((res) => {
    console.log("GET MATCH RES");
    console.log(JSON.stringify(res));

    let match = res.data;

    let other_user_id = user_id == match.user_ids[0]
      ? match.user_ids[1] : match.user_ids[0];

    return getSocketID(other_user_id);
  }).then((res) => {
    if (res.success) {
      to_socket = res.data.socket_id;
      if (global_io.sockets.connected[to_socket]) {
        global_io.sockets.connected[to_socket].emit('message', {
          message: message,
          match_id: match_id
        });
      }
    }
  }).catch((err) => {
    
  });
};

module.exports = {
  init: init,
  match_emit: match_emit,
  chat_emit: chat_emit
};
