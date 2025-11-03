import { createPublicClient, createWalletClient, http, getContract, Address, Abi } from 'viem';
import { arbitrumSepolia } from 'viem/chains';
import deploymentInfo from '../contracts/deployment.json';
import contractABIJson from '../contracts/Counter.json' assert { type: 'json' };

// Define contract address as Address type
const contractAddress = deploymentInfo.address as Address;

// Explicitly type contractABI as Abi
const contractABI = contractABIJson as unknown as Abi;

// Public client for read operations
const publicClient = createPublicClient({
    chain: arbitrumSepolia,
    transport: http("https://arb-sepolia.g.alchemy.com/v2/bafJTMKHwAdBGddEgxuelaJyqRC98H8X"),
});

// Wallet client for write operations
const walletClient = createWalletClient({
    chain: arbitrumSepolia,
    transport: http("https://arb-sepolia.g.alchemy.com/v2/bafJTMKHwAdBGddEgxuelaJyqRC98H8X"),
    account: 'Y0x0a6A5Ba22da4e199bB5d8Cc04a84976C5930d049' as Address, // Replace with actual connected account address
});

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
    return getContract({
        address: contractAddress,
        abi: contractABI,
        walletClient,
    });
};
