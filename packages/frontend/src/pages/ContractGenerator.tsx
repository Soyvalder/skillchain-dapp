import React, { useState } from 'react';
import { FileCode, Check, Shield, Users } from 'lucide-react';

const ContractGenerator: React.FC = () => {
    const [selectedTemplate, setSelectedTemplate] = useState('');

    const templates = [
        {
            id: 'erc20',
            name: 'ERC20 Token',
            icon: <FileCode className="w-6 h-6 text-blue-400" />,
            description: 'Standard ERC20 token implementation in Rust'
        },
        {
            id: 'erc721',
            name: 'ERC721 NFT',
            icon: <FileCode className="w-6 h-6 text-purple-400" />,
            description: 'NFT contract with metadata support'
        },
        {
            id: 'multisig',
            name: 'Multi-sig Wallet',
            icon: <Shield className="w-6 h-6 text-green-400" />,
            description: 'Secure multi-signature wallet implementation'
        },
        {
            id: 'dao',
            name: 'DAO Structure',
            icon: <Users className="w-6 h-6 text-yellow-400" />,
            description: 'Basic DAO framework with voting mechanisms'
        }
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                <h2 className="text-xl font-semibold mb-6">Contract Templates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {templates.map((template) => (
                        <button
                            key={template.id}
                            onClick={() => setSelectedTemplate(template.id)}
                            className={`p-4 rounded-lg border transition-colors text-left ${selectedTemplate === template.id
                                    ? 'bg-blue-500/20 border-blue-500/40'
                                    : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                {template.icon}
                                {selectedTemplate === template.id && (
                                    <Check className="w-4 h-4 text-blue-400" />
                                )}
                            </div>
                            <h3 className="font-medium mb-2">{template.name}</h3>
                            <p className="text-sm text-gray-400">{template.description}</p>
                        </button>
                    ))}
                </div>
            </div>

            {selectedTemplate && (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                    <h3 className="text-lg font-semibold mb-4">Customize Template</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Contract Name
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                placeholder="MyToken"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Symbol (for tokens)
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                placeholder="MTK"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Features
                            </label>
                            <div className="space-y-2">
                                <label className="flex items-center">
                                    <input type="checkbox" className="rounded border-gray-700 text-blue-500 focus:ring-blue-500" />
                                    <span className="ml-2 text-gray-300">Pausable</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" className="rounded border-gray-700 text-blue-500 focus:ring-blue-500" />
                                    <span className="ml-2 text-gray-300">Burnable</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" className="rounded border-gray-700 text-blue-500 focus:ring-blue-500" />
                                    <span className="ml-2 text-gray-300">Access Control</span>
                                </label>
                            </div>
                        </div>
                        <button className="w-full px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors">
                            Generate Contract
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContractGenerator;