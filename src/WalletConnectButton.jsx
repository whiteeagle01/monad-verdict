// src/components/WalletConnectButton.jsx

import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function WalletConnectButton() {
  return (
    <div className="fixed top-4 right-4 z-50">
      <ConnectButton showBalance={false} accountStatus="full" />
    </div>
  );
}
