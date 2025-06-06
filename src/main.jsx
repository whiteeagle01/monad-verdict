import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const config = getDefaultConfig({
  appName: 'Monad Verdict',
  projectId: '39931ec4fb68caf19794fe54f68323b5',
  chains: [
    {
      id: 10143,
      name: 'Monad Testnet',
      nativeCurrency: {
        name: 'MONAD',
        symbol: 'MON',
        decimals: 18,
      },
      rpcUrls: {
        default: { http: ['https://testnet-rpc.monad.xyz'] },
      },
      blockExplorers: {
        default: { name: 'MonadScan', url: 'https://explorer.testnet.monad.xyz' },
      },
      testnet: true,
    },
  ],
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={config.chains}>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
