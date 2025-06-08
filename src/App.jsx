import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import VerdictMiniApp from './VerdictMiniApp';

export default function App() {
  return (
    <div className="w-full h-full bg-black text-white relative">
      <div className="absolute top-4 right-4 z-50">
        <ConnectButton />
      </div>
      <VerdictMiniApp />
    </div>
  );
}
