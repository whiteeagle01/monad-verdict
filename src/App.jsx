import React, { useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import VerdictMiniApp from './VerdictMiniApp';

export default function App() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.farcaster?.ready) {
      window.farcaster.ready(); // 🔥 Farcaster Mini App için gerekli
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed top-4 right-4 z-50">
        <ConnectButton />
      </div>
      <VerdictMiniApp />
    </div>
  );
}
