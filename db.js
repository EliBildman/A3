const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const Stage = require('./stage');

let database = null;
let connected = false;

const connect = async () => {
  const client = new MongoClient(process.env.DB_URL, {
    sslKey: Stage.CREDS_PATH,
    sslCert: Stage.CREDS_PATH,
    serverApi: ServerApiVersion.v1,
  });
  await client.connect();
  connected = true;
  database = client.db(Stage.DB_NAME);
};

module.exports.getPages = async () => {
  if (!connected) await connect();

  const collection = database.collection('pages');
  const docs = collection.find({}).toArray();
  return docs;
};

module.exports.setPages = async (pages) => {
  if (!connected) await connect();

  const collection = database.collection('pages');
  await collection.deleteMany({}); // delete eveything
  collection.insertMany(pages); // add everything i cant be bothered to update things
};

module.exports.addLog = async (log) => {
  if (!connected) await connect();

  const collection = database.collection('logs');
  collection.insertOne(log);
};
