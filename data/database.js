const mongoose = require('mongoose');

let mongodbURL = 'mongodb://jung:jung@54.183.132.150:27017/cards';
if(process.env.MONGODB_URL) {
  mongodbURL = process.env.MONGODB_URL
}

let database;

async function initDatabase() {
  if(process.env.NODE_ENV !== 'production'){ //개발환경일 경우에만 콘솔 출력
    mongoose.set('debug',true);
  }
  const client = await mongoose.connect(mongodbURL)
  database = client.connection;
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
