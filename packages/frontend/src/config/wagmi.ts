import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig } from 'wagmi';
import { arbitrumSepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string | undefined;

const { chains, publicClient } = configureChains(
    [arbitrumSepolia],
    [publicProvider()]
);

const { connectors } = getDefaultWallets({
    appName: 'Scaffold-Stylus',
    projectId: projectId ?? 'scaffold-stylus',
    chains,
});

export const config = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
});

export { chains };