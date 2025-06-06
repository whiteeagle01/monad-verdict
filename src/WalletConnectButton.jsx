import React, { useState } from 'react';
import { Wallet } from 'lucide-react';

const mockWalletAddress = '0xAbC123...cdE9';

export default function WalletConnectButton() {
  const [connected, setConnected] = useState(false);

  const handleConnect = () => {
    setConnected(true); // simüle bağlantı
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {connected ? (
        <div className="flex items-center space-x-2 bg-gray-800 border border-gray-600 text-white px-4 py-2 rounded-full shadow-md">
          <Wallet className="w-5 h-5 text-green-400" />
          <span className="text-sm font-mono">{mockWalletAddress}</span>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full shadow-md transition duration-200"
        >
          <Wallet className="w-5 h-5" />
          <span>Connect Wallet</span>
        </button>
      )}
    </div>
  );
}
