const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const Stage = require('./stage');

let database = null;
let connected = false;

const connect = async () => {
  const client = new MongoClient(
    'mongodb+srv://cloudcity.uy7d3qs.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority',
    {
      sslKey: Stage.CREDS_PATH,
      sslCert: Stage.CREDS_PATH,
      serverApi: ServerApiVersion.v1,
    }
  );
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
