const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let mongodbURL = 'mongodb://jung:jung@54.176.26.102/27017';

if(process.env.MONGODB_URL) {
  mongodbURL = process.env.MONGODB_URL
}

let database;

async function initDatabase() {
  const client = await MongoClient.connect(mongodbURL);
  database = client.db('deployment');
}

function getDb() {
  if (!database) {
    throw new Error('No database connected!');
  }

  return database;
}

module.exports = {
  initDatabase: initDatabase,
  getDb: getDb,
};
