// pages/api/current-pair.ts

import { firestore } from "@/lib/firebase";
import { Timestamp } from "firebase-admin/firestore";
import type { NextApiRequest, NextApiResponse } from "next";

const RESET_INTERVAL_MS = 5 * 60 * 60 * 1000; // 5 saat

const ALL_CRYPTOS = [
  { id: "sol", name: "Solana", symbol: "SOL" },
  { id: "sui", name: "Sui", symbol: "SUI" },
  { id: "apt", name: "Aptos", symbol: "APT" },
  { id: "base", name: "Base", symbol: "BASE" },
  { id: "blast", name: "Blast", symbol: "BLAST" }
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const ref = firestore.collection("vote_round").doc("current");
    const snapshot = await ref.get();

    const now = Date.now();

    if (!snapshot.exists) {
      // İlk eşleşme oluşturuluyor
      const pair = getRandomPair();
      await ref.set({
        pair,
        startedAt: Timestamp.fromMillis(now)
      });
      return res.status(200).json({ pair, remaining: RESET_INTERVAL_MS });
    }

    const data = snapshot.data();
    const startedAt = data?.startedAt.toMillis();
    const timePassed = now - startedAt;

    if (timePassed >= RESET_INTERVAL_MS) {
      // Süre dolmuş, yeni eşleşme başlat
      const pair = getRandomPair();
      await ref.set({
        pair,
        startedAt: Timestamp.fromMillis(now)
      });
      return res.status(200).json({ pair, remaining: RESET_INTERVAL_MS });
    }

    // Süre dolmamış, mevcut eşleşmeyi döndür
    return res.status(200).json({
      pair: data.pair,
      remaining: RESET_INTERVAL_MS - timePassed
    });
  } catch (err) {
    console.error("Error in current-pair API:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

function getRandomPair() {
  const shuffled = [...ALL_CRYPTOS].sort(() => 0.5 - Math.random());
  return {
    left: shuffled[0],
    right: shuffled[1]
  };
}
