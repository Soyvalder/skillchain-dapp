import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig } from 'wagmi';
import { arbitrumSepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const projectId = 'YOUR_WALLET_CONNECT_PROJECT_ID';

const { chains, publicClient } = configureChains(
    [arbitrumSepolia],
    [publicProvider()]
);

const { connectors } = getDefaultWallets({
    appName: 'Scaffold-Stylus',
    projectId: projectId,
    chains,
});

export const config = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
});

export { chains };