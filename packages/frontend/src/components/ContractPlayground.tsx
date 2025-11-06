import React, { useState, useEffect } from 'react';
import { Book, Edit3 } from 'lucide-react';
import { createPublicClient, createWalletClient, http, getContract, Address } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
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

// RPC y cuenta desde entorno
const RPC_URL = import.meta.env.VITE_RPC_URL as string | undefined;
const PRIVATE_KEY = import.meta.env.VITE_PRIVATE_KEY as string | undefined;

// Public client para lectura
const publicClient = createPublicClient({
    chain: arbitrumSepolia,
    transport: http(RPC_URL ?? 'https://arb-sepolia.g.alchemy.com/v2/'),
});

// Wallet client para escritura (si hay clave privada en entorno)
const account = PRIVATE_KEY ? privateKeyToAccount(PRIVATE_KEY as `0x${string}`) : undefined;
const walletClient = account
    ? createWalletClient({
        chain: arbitrumSepolia,
        transport: http(RPC_URL ?? 'https://arb-sepolia.g.alchemy.com/v2/'),
        account,
    })
    : undefined;

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

    // Helper para parsear por tipo
    const parseByType = (type: string, value: string): any => {
        if (type.endsWith('[]')) {
            const base = type.replace('[]', '');
            return value.split(',').map(v => parseByType(base.trim(), v.trim()));
        }
        if (type.startsWith('uint') || type.startsWith('int')) return BigInt(value);
        if (type === 'address') return value as Address;
        if (type === 'bool') return value.toLowerCase() === 'true';
        if (type === 'bytes' || type.startsWith('bytes')) return value as any;
        return value; // string u otros
    };

    const executeFunction = async (funcName: string, params: string[]) => {
        try {
            let result;
            const abi = contractABI as any[];
            const item = abi.find((it: any) => it.type === 'function' && it.name === funcName);
            const inputs: string[] = (item?.inputs || []).map((i: any) => i.type);
            const parsedArgs = params.map((p, i) => parseByType(inputs[i] || 'string', p));
            if (activeTab === 'read') {
                // Use public client for read operations
                result = await publicClient.readContract({
                    address: contractAddress,
                    abi: contractABI as any[],
                    functionName: funcName,
                    args: parsedArgs,
                });
            } else {
                // Use wallet client for write operations
                if (!walletClient) throw new Error('Sin cuenta configurada para escribir. Define VITE_PRIVATE_KEY o conecta una wallet.');
                result = await walletClient.writeContract({
                    address: contractAddress,
                    abi: contractABI as any[],
                    functionName: funcName,
                    args: parsedArgs,
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
