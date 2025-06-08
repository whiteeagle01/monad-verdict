import React, { useEffect, useState } from 'react';
import { Award, Users } from 'lucide-react';
import { useAccount, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';

const FEE_RECIPIENT_ADDRESS = '0x11B4dd24463b1bCd55C91940E0e356e8231DeA43';
const VOTING_FEE_AMOUNT = 0.001;
const TIMED_FEE_AMOUNT = 0.1;
const TIMED_FEE_DURATION_MS = 5 * 60 * 1000;

export default function VerdictMiniApp() {
  const [pair, setPair] = useState([]);
  const [votes, setVotes] = useState({});
  const [remaining, setRemaining] = useState(null);

  const { address, isConnected } = useAccount();
  const { sendTransaction } = useSendTransaction();

  // 🟣 Farcaster iframe'e hazırım sinyali
  useEffect(() => {
    if (typeof window !== 'undefined' && window.farcaster?.ready) {
      window.farcaster.ready();
      console.log('✅ Farcaster ready() çağrıldı');
    }
  }, []);

  useEffect(() => {
    fetch('/api/current-pair')
      .then((res) => res.json())
      .then((data) => {
        setPair([data.pair.left, data.pair.right]);
        setRemaining(data.remaining);
      });
  }, []);

  useEffect(() => {
    if (!remaining) return;
    const interval = setInterval(() => {
      setRemaining((prev) => (prev > 60000 ? prev - 60000 : 0));
    }, 60000);
    return () => clearInterval(interval);
  }, [remaining]);

  const isTimedFeeActive = () => {
    const cycleStart = Date.now() - (Date.now() % (5 * 60 * 60 * 1000));
    return Date.now() - cycleStart < TIMED_FEE_DURATION_MS;
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

      setVotes((prev) => ({
        ...prev,
        [id]: {
          points: (prev[id]?.points || 0) + 1,
          totalVotes: (prev[id]?.totalVotes || 0) + 1,
        },
      }));
    } catch (err) {
      console.error('Transaction failed:', err);
      alert('Fee transfer failed. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-black text-white px-4 py-6">
      <h1 className="text-4xl font-bold mb-2 text-purple-400">Monad Verdict</h1>
      <p className="text-gray-400 text-sm mb-4">Vote your favorite crypto contender</p>

      {remaining !== null && (
        <p className="text-xs text-yellow-400 mb-6">
          Next reset in: {Math.floor(remaining / 3600000)}h {Math.floor((remaining % 3600000) / 60000)}m
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 w-full max-w-sm">
        {pair.map((crypto) => (
          <div
            key={crypto.id}
            className="bg-gray-800 border border-gray-700 rounded-xl p-4 hover:shadow-lg transition"
          >
            <div className="flex flex-col items-center mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center font-bold text-black text-lg">
                {crypto.symbol}
              </div>
              <h2 className="text-xl font-semibold mt-2">{crypto.name}</h2>
              <p className="text-sm text-gray-400 uppercase">{crypto.symbol}</p>
            </div>

            <div className="flex flex-col items-center mb-4 space-y-1">
              <div className="text-yellow-300 flex items-center text-sm font-medium">
                <Award className="w-4 h-4 mr-1" />
                {votes[crypto.id]?.points || 0} Points
              </div>
              <div className="text-green-400 flex items-center text-sm">
                <Users className="w-4 h-4 mr-1" />
                {votes[crypto.id]?.totalVotes || 0} Votes
              </div>
            </div>

            <button
              onClick={() => handleVote(crypto.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full w-full text-sm font-medium"
            >
              Vote for {crypto.symbol}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
