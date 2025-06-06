import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import VerdictMiniApp from './VerdictMiniApp';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed top-4 right-4 z-50">
        <ConnectButton />
      </div>
      <VerdictMiniApp />
    </div>
  );
}
