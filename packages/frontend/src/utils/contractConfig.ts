import { createPublicClient, createWalletClient, http, getContract, Address, Abi } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { arbitrumSepolia } from 'viem/chains';
import deploymentInfo from '../contracts/deployment.json';
import contractABIJson from '../contracts/SkillChainNFT.json' assert { type: 'json' };

// Define contract address as Address type
const contractAddress = deploymentInfo.address as Address;

// Explicitly type contractABI as Abi
const contractABI = contractABIJson as unknown as Abi;

// RPC URL desde env (no hardcodear claves)
const RPC_URL = import.meta.env.VITE_RPC_URL as string | undefined;

// Public client para operaciones de lectura
const publicClient = createPublicClient({
    chain: arbitrumSepolia,
    transport: http(RPC_URL ?? 'https://rpc.ankr.com/arbitrum_sepolia'),
});

// Cuenta opcional desde env (solo para desarrollo/test)
const PRIVATE_KEY = import.meta.env.VITE_PRIVATE_KEY as string | undefined;
const account = PRIVATE_KEY ? privateKeyToAccount(PRIVATE_KEY as `0x${string}`) : undefined;

// Wallet client para operaciones de escritura (si hay cuenta)
const walletClient = account
    ? createWalletClient({
        chain: arbitrumSepolia,
        transport: http(RPC_URL ?? 'https://rpc.ankr.com/arbitrum_sepolia'),
        account,
    })
    : undefined;

// Get contract configuration
export const getContractConfig = () => {
    return {
        address: contractAddress,
        abi: contractABI,
        network: deploymentInfo.network,
    };
};

// Get contract instance for read operations
export const getReadContract = () => {
    return getContract({
        address: contractAddress,
        abi: contractABI,
        publicClient,
    });
};

// Get contract instance for write operations
export const getWriteContract = () => {
    if (!walletClient) {
        throw new Error('No hay cuenta configurada para escritura. Define VITE_PRIVATE_KEY o usa un conector de wallet.');
    }
    return getContract({
        address: contractAddress,
        abi: contractABI,
        walletClient,
    });
};
