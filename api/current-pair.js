// api/current-pair.js
const { firestore } = require("../src/lib/firebase");
const { Timestamp } = require("firebase-admin/firestore");

module.exports = async (req, res) => {
  try {
    const ref = firestore.collection("vote_round").doc("current");
    const snapshot = await ref.get();

    const now = Date.now();

    if (!snapshot.exists) {
      const pair = getRandomPair();
      await ref.set({ pair, startedAt: Timestamp.fromMillis(now) });
      return res.status(200).json({ pair, remaining: 5 * 60 * 60 * 1000 });
    }

    const data = snapshot.data();
    const startedAt = data?.startedAt.toMillis();
    const timePassed = now - startedAt;

    if (timePassed >= 5 * 60 * 60 * 1000) {
      const pair = getRandomPair();
      await ref.set({ pair, startedAt: Timestamp.fromMillis(now) });
      return res.status(200).json({ pair, remaining: 5 * 60 * 60 * 1000 });
    }

    return res.status(200).json({
      pair: data.pair,
      remaining: 5 * 60 * 60 * 1000 - timePassed
    });
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).send("Internal Server Error");
  }
};

function getRandomPair() {
  const cryptos = [...]; // Aynı array burada kullanılmalı
  const shuffled = cryptos.sort(() => 0.5 - Math.random());
  return { left: shuffled[0], right: shuffled[1] };
}
