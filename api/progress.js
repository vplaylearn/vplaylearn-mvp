const { getDb } = require("./_db");

async function getProgressCollection() {
  const collection = (await getDb()).collection("game_progress");
  await collection.createIndex({ userId: 1 }, { unique: true });
  return collection;
}

// Same ownership key as bookmarks: device id now, real user id after login.
function getUserId(request) {
  const fromHeader = request.headers["x-user-id"];
  if (typeof fromHeader === "string" && fromHeader.trim()) return fromHeader.trim();
  const fromQuery = request.query && request.query.userId;
  if (typeof fromQuery === "string" && fromQuery.trim()) return fromQuery.trim();
  const fromBody = request.body && request.body.userId;
  if (typeof fromBody === "string" && fromBody.trim()) return fromBody.trim();
  return null;
}

module.exports = async function handler(request, response) {
  const userId = getUserId(request);
  if (!userId) return response.status(400).json({ error: "Missing user id." });

  let collection;
  try {
    collection = await getProgressCollection();
  } catch (error) {
    console.error("Progress DB unavailable", error);
    return response.status(500).json({ error: "Progress storage is not configured." });
  }

  try {
    if (request.method === "GET") {
      const doc = await collection.findOne(
        { userId },
        { projection: { _id: 0, userId: 0 } }
      );
      // No saved progress yet -> return the fresh-start shape.
      return response.status(200).json({
        progress: doc || { unlocked: [], proverbIndex: 0 },
      });
    }

    if (request.method === "PUT") {
      const { progress } = request.body || {};
      const unlocked = Array.isArray(progress?.unlocked) ? progress.unlocked : [];
      const proverbIndex = Number.isInteger(progress?.proverbIndex)
        ? progress.proverbIndex
        : 0;

      const doc = { unlocked, proverbIndex, updatedAt: new Date().toISOString() };
      await collection.updateOne(
        { userId },
        { $set: { ...doc, userId } },
        { upsert: true }
      );
      return response.status(200).json({ progress: doc });
    }

    response.setHeader("Allow", "GET, PUT");
    return response.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Progress request failed", error);
    return response.status(500).json({ error: "Unable to process progress right now." });
  }
};
