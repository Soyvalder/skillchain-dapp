import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { config, chains } from './config/wagmi';
import App from './App.tsx';
import './index.css';
import '@rainbow-me/rainbowkit/styles.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <WagmiConfig config={config}>
            <RainbowKitProvider chains={chains}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </RainbowKitProvider>
        </WagmiConfig>
    </StrictMode>
);