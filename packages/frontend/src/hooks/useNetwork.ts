import { useChainId } from 'wagmi';

export const useNetwork = () => {
    const chainId = useChainId();

    const isArbitrumNetwork = chainId === 421614; // Arbitrum Sepolia
    const getChainName = (id: number) => {
        switch (id) {
            case 421614:
                return 'Arbitrum Sepolia';
            default:
                return 'Unknown Network';
        }
    };

    return {
        isArbitrumNetwork,
        chainName: getChainName(chainId),
    };
};