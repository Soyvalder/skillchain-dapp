import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig } from 'wagmi';
import { arbitrumSepolia } from 'wagmi/chains';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string | undefined;

const RPC_URL = (import.meta.env.VITE_RPC_URL as string | undefined) ?? 'https://rpc.ankr.com/arbitrum_sepolia';

const { chains, publicClient } = configureChains(
    [arbitrumSepolia],
    [jsonRpcProvider({ rpc: () => ({ http: RPC_URL }) })]
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