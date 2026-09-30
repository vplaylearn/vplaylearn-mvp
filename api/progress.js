const { getDb } = require("./_db");
const { resolveUser } = require("./_auth");

async function getProgressCollection() {
  const collection = (await getDb()).collection("game_progress");
  await collection.createIndex({ userId: 1 }, { unique: true });
  return collection;
}

module.exports = async function handler(request, response) {
  // Verified Clerk id when logged in, else anonymous device id; reject a
  // present-but-invalid token.
  const { userId, invalidToken } = await resolveUser(request);
  if (invalidToken) {
    return response.status(401).json({ error: "Invalid or expired session." });
  }
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
