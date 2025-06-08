import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

export default function VerdictMiniApp() {
  const { isConnected } = useAccount();
  const [pair, setPair] = useState(null);
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.farcaster?.ready) {
      window.farcaster.ready();
      console.log('🟢 Farcaster ready() çağrıldı');
    }
  }, []);

  useEffect(() => {
    fetch('/api/current-pair')
      .then((res) => res.json())
      .then((data) => {
        setPair(data.pair);
        setRemaining(data.remaining);
      });
  }, []);

  if (!pair) {
    return <p className="text-center text-white p-4">Loading...</p>;
  }

  return (
    <div className="bg-black text-white w-full h-full flex flex-col items-center justify-center px-4 py-6">
      <h1 className="text-lg font-bold mb-1">Vote: {pair.left.symbol} vs {pair.right.symbol}</h1>
      <div className="flex gap-4 mb-3">
        <button className="bg-purple-600 px-3 py-1 rounded" disabled>
          {pair.left.name}
        </button>
        <button className="bg-blue-600 px-3 py-1 rounded" disabled>
          {pair.right.name}
        </button>
      </div>
      <p className="text-xs text-gray-400">
        {Math.floor(remaining / 3600000)}h {Math.floor((remaining % 3600000) / 60000)}m to reset
      </p>
    </div>
  );
}
