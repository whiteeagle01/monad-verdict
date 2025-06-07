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

  // 🧠 Sunucudan eşleşme ve süreyi al
  useEffect(() => {
    fetch('/api/current-pair')
      .then((res) => res.json())
      .then((data) => {
        setPair([data.pair.left, data.pair.right]);
        setRemaining(data.remaining);
      });
  }, []);

  // ⏳ Geri sayımı dakikada bir güncelle
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

      // 🧪 Burada gerçek backend'e oy kaydı eklenebilir (gerekirse)

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 to-gray-800 text-white px-4 py-10">
      <h1 className="text-5xl font-extrabold mb-4 text-purple-400">Monad Verdict</h1>
      <p className="text-gray-400 text-sm mb-6">Vote your favorite crypto contender</p>

      {remaining !== null && (
        <p className="text-sm text-yellow-400 mb-8">
          Next reset in: {Math.floor(remaining / 3600000)}h {Math.floor((remaining % 3600000) / 60000)}m
        </p>
      )}

      <div className="grid grid-cols-1 gap-8 max-w-md w-full">
        {pair.map((crypto) => (
          <div
            key={crypto.id}
            className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition duration-300 transform hover:scale-105"
          >
            <div className="flex flex-col items-center text-center space-y-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center font-bold text-black text-xl">
                {crypto.symbol}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">{crypto.name}</h2>
                <p className="text-gray-400 text-sm uppercase">{crypto.symbol}</p>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 mb-6">
              <div className="text-xl text-yellow-300 font-semibold flex items-center">
                <Award className="w-5 h-5 mr-2" />
                {votes[crypto.id]?.points || 0} Points
              </div>
              <div className="text-md text-green-400 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                {votes[crypto.id]?.totalVotes || 0} Votes
              </div>
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
