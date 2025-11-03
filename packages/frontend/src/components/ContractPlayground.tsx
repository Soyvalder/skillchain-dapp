import React, { useState, useEffect } from 'react';
import { Book, Edit3 } from 'lucide-react';
import { createPublicClient, createWalletClient, http, getContract, Address } from 'viem';
import { arbitrumSepolia } from 'viem/chains';
import contractABI from '../contracts/Counter.json';
import deploymentInfo from '../contracts/deployment.json';

interface FunctionParam {
    name: string;
    placeholder: string;
}

interface ContractFunction {
    name: string;
    description: string;
    params: FunctionParam[];
}

// Public client for read operations
const publicClient = createPublicClient({
    chain: arbitrumSepolia,
    transport: http("https://arb-sepolia.g.alchemy.com/v2/bafJTMKHwAdBGddEgxuelaJyqRC98H8X"),
});

// Wallet client for write operations (requires connected wallet)
const walletClient = createWalletClient({
    chain: arbitrumSepolia,
    transport: http("https://arb-sepolia.g.alchemy.com/v2/bafJTMKHwAdBGddEgxuelaJyqRC98H8X"),
    account: '0x0a6A5Ba22da4e199bB5d8Cc04a84976C5930d049' as Address, // Replace with the actual connected account address
});

const ContractPlayground: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'read' | 'write'>('read');
    const [readFunctions, setReadFunctions] = useState<ContractFunction[]>([]);
    const [writeFunctions, setWriteFunctions] = useState<ContractFunction[]>([]);
    const [functionInputs, setFunctionInputs] = useState<Record<string, string[]>>({});
    const [functionResults, setFunctionResults] = useState<Record<string, string>>({});

    // Define contract address with correct type
    const contractAddress = deploymentInfo.address as Address;

    // Use getContract to initialize the contract
    const contract = getContract({
        address: contractAddress,
        abi: contractABI as any[], // Cast as any[] if TypeScript complains about type
        publicClient,
    });

    useEffect(() => {
        const loadContractFunctions = () => {
            const abi = contractABI as any[];
            const readFuncs: ContractFunction[] = [];
            const writeFuncs: ContractFunction[] = [];

            abi.forEach((item: any) => {
                if (item.type === 'function') {
                    const func: ContractFunction = {
                        name: item.name || '',
                        description: item.name || '',
                        params: (item.inputs || []).map((input: any) => ({
                            name: input.name || '',
                            placeholder: input.type || '',
                        })),
                    };
                    if (item.stateMutability === 'view' || item.stateMutability === 'pure') {
                        readFuncs.push(func);
                    } else {
                        writeFuncs.push(func);
                    }
                }
            });

            setReadFunctions(readFuncs);
            setWriteFunctions(writeFuncs);
        };

        loadContractFunctions();
    }, []);

    const executeFunction = async (funcName: string, params: string[]) => {
        try {
            let result;
            if (activeTab === 'read') {
                // Use public client for read operations
                result = await publicClient.readContract({
                    address: contractAddress,
                    abi: contractABI as any[],
                    functionName: funcName,
                    args: params.map((param) => BigInt(param)), // Convert inputs to BigInt if necessary
                });
            } else {
                // Use wallet client for write operations
                result = await walletClient.writeContract({
                    address: contractAddress,
                    abi: contractABI as any[],
                    functionName: funcName,
                    args: params.map((param) => BigInt(param)),
                    value: 0n,
                });
            }

            setFunctionResults((prev) => ({
                ...prev,
                [funcName]: result.toString(),
            }));
        } catch (error) {
            console.error('Error executing function:', error);
            setFunctionResults((prev) => ({
                ...prev,
                [funcName]: `Error: ${error instanceof Error ? error.message : String(error)}`,
            }));
        }
    };

    const functions = activeTab === 'read' ? readFunctions : writeFunctions;

    return (
        <div>
            {/* Tabs */}
            <div className="flex space-x-4 mb-6">
                <button
                    onClick={() => setActiveTab('read')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'read'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20'
                        : 'text-gray-400 hover:text-gray-300'
                        }`}
                >
                    <Book className="w-4 h-4" />
                    Read Functions
                </button>
                <button
                    onClick={() => setActiveTab('write')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'write'
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/20'
                        : 'text-gray-400 hover:text-gray-300'
                        }`}
                >
                    <Edit3 className="w-4 h-4" />
                    Write Functions
                </button>
            </div>

            {/* Function Cards */}
            <div className="space-y-4">
                {functions.map((func) => (
                    <div key={func.name} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-200">{func.name}</h3>
                                <p className="text-sm text-gray-400">{func.description}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${activeTab === 'read'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20'
                                : 'bg-purple-500/20 text-purple-400 border border-purple-500/20'
                                }`}>
                                {activeTab === 'read' ? 'Read' : 'Write'}
                            </span>
                        </div>

                        <div className="space-y-4">
                            {func.params.map((param, index) => (
                                <div key={index}>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        {param.name}
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        placeholder={param.placeholder}
                                        onChange={(e) => {
                                            const newInputs = { ...functionInputs };
                                            if (!newInputs[func.name]) newInputs[func.name] = [];
                                            newInputs[func.name][index] = e.target.value;
                                            setFunctionInputs(newInputs);
                                        }}
                                    />
                                </div>
                            ))}

                            <button
                                className={`w-full px-4 py-2 rounded-lg ${activeTab === 'read'
                                    ? 'bg-blue-500 hover:bg-blue-600'
                                    : 'bg-purple-500 hover:bg-purple-600'
                                    } text-white font-medium transition-colors`}
                                onClick={() => executeFunction(func.name, functionInputs[func.name] || [])}
                            >
                                {activeTab === 'read' ? 'Query' : 'Execute'}
                            </button>

                            {functionResults[func.name] && (
                                <div className="mt-4 p-3 rounded-lg bg-gray-900/50 border border-gray-700">
                                    <div className="text-sm text-gray-400 mb-1">Result:</div>
                                    <div className="font-mono text-gray-200">{functionResults[func.name]}</div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContractPlayground;
