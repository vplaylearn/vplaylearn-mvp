const { MongoClient } = require("mongodb");

// Reuse the client across warm serverless invocations. A fresh connection per
// request would exhaust the Atlas connection pool under any real traffic.
// ponytail: single cached client, no pool tuning — fine until sustained load.
let cached = global._mongoClientPromise;

function getClientPromise() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }
  if (!cached) {
    cached = new MongoClient(uri).connect();
    global._mongoClientPromise = cached;
  }
  return cached;
}

async function getDb() {
  const client = await getClientPromise();
  const dbName = process.env.MONGODB_DB || "vplaylearn";
  return client.db(dbName);
}

async function getBookmarksCollection() {
  const collection = (await getDb()).collection("bookmarks");
  // Owner lookups are the only query pattern; index makes them cheap.
  await collection.createIndex({ userId: 1, id: 1 }, { unique: true });
  return collection;
}

module.exports = { getDb, getBookmarksCollection };
