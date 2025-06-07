// src/VerdictMiniApp.jsx
import React, { useState, useEffect } from 'react';
import { Award, Users } from 'lucide-react';
import { mockCryptocurrencies } from './mockData';
import { db } from './firebase';
import { doc, runTransaction } from 'firebase/firestore';
import { useAccount, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';

const FEE_RECIPIENT_ADDRESS = '0x11B4dd24463b1bCd55C91940E0e356e8231DeA43';
const VOTING_FEE_AMOUNT = 0.001;
const TIMED_FEE_AMOUNT = 0.1;
const TIMED_FEE_INTERVAL_MS = 20 * 60 * 1000;
const TIMED_FEE_DURATION_MS = 5 * 60 * 1000;

export default function VerdictMiniApp() {
  const [votes, setVotes] = useState({});
  const [pair, setPair] = useState(() => {
    const shuffled = [...mockCryptocurrencies].sort(() => 0.5 - Math.random());
    return [shuffled[0], shuffled[1]];
  });

  const { address, isConnected } = useAccount();
  const { sendTransaction } = useSendTransaction();

  const isTimedFeeActive = () => {
    const now = Date.now();
    const cycleStart = now - (now % TIMED_FEE_INTERVAL_MS);
    return now - cycleStart < TIMED_FEE_DURATION_MS;
  };

  const calculateFee = () => {
    return isTimedFeeActive() ? TIMED_FEE_AMOUNT : VOTING_FEE_AMOUNT;
  };

  const handleVote = async (id) => {
    if (!isConnected) {
      alert('Please connect your wallet');
      return;
    }

    const fee = calculateFee();

    try {
      await sendTransaction({
        to: FEE_RECIPIENT_ADDRESS,
        value: parseEther(fee.toString()),
      });

      const ref = doc(db, `votes/mock-voting-state`);
      await runTransaction(db, async (transaction) => {
        const current = votes[id] || { points: 0, totalVotes: 0 };
        transaction.set(ref, {
          ...votes,
          [id]: {
            points: current.points + 1,
            totalVotes: current.totalVotes + 1
          },
          lastFee: {
            amount: fee,
            to: FEE_RECIPIENT_ADDRESS,
            timestamp: Date.now(),
            voter: address
          }
        });
      });

      setVotes((prev) => ({
        ...prev,
        [id]: {
          points: (prev[id]?.points || 0) + 1,
          totalVotes: (prev[id]?.totalVotes || 0) + 1
        }
      }));

      // 🛑 LastFee bilgisi kaydediliyor ama kullanıcıya gösterilmiyor.
      // İstersen admin paneli için Firestore'dan manuel kontrol edebilirsin.

    } catch (err) {
      console.error('Transaction failed:', err);
      alert('Fee transfer failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 to-gray-800 text-white px-4 py-10">
      <h1 className="text-4xl font-extrabold mb-4">
        <span className="text-blue-400">Monad</span>{' '}
        <span className="text-purple-400">Verdict</span>
      </h1>
      <p className="text-gray-400 text-sm mb-10">Vote your favorite crypto contender</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full">
        {pair.map((crypto) => (
          <div
            key={crypto.id}
            className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition duration-300 transform hover:scale-105"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center font-bold text-black">
                {crypto.symbol}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{crypto.name}</h2>
                <p className="text-gray-400 text-sm uppercase">{crypto.symbol}</p>
              </div>
            </div>

            <div className="text-lg text-yellow-300 font-semibold flex items-center mb-1">
              <Award className="w-5 h-5 mr-2" />
              {votes[crypto.id]?.points || crypto.initialPoints} Points
            </div>
            <div className="text-md text-green-400 flex items-center mb-4">
              <Users className="w-5 h-5 mr-2" />
              {votes[crypto.id]?.totalVotes || crypto.initialTotalVotes} Votes
            </div>

            <button
              onClick={() => handleVote(crypto.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-semibold shadow-md transition duration-300 w-full"
            >
              Vote for {crypto.symbol}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
