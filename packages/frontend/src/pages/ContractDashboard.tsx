import React from 'react';
import { Code2, Cpu, Activity } from 'lucide-react';
import ContractPlayground from '../components/ContractPlayground';
import { IssuerManagement } from '../components/experimental/IssuerManagement';
import { IssueCertificate } from '../components/experimental/IssueCertificate';
import { ERC20Playground } from '../components/experimental/ERC20Playground';
import DevTools from '../components/DevTools';
import TransactionMonitor from '../components/TransactionMonitor';

const ContractDashboard: React.FC = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 shadow-xl">
                    <div className="flex items-center gap-2 mb-6">
                        <Code2 className="w-6 h-6 text-blue-400" />
                        <h2 className="text-xl font-semibold">Contract Playground</h2>
                    </div>
                    <ContractPlayground />
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 shadow-xl">
                    <div className="flex items-center gap-2 mb-6">
                        <Code2 className="w-6 h-6 text-purple-400" />
                        <h2 className="text-xl font-semibold">Issuers & Certificates</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <IssuerManagement />
                        <IssueCertificate />
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 shadow-xl">
                    <div className="flex items-center gap-2 mb-6">
                        <Code2 className="w-6 h-6 text-yellow-400" />
                        <h2 className="text-xl font-semibold">ERC-20 Playground</h2>
                    </div>
                    <ERC20Playground />
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 shadow-xl">
                    <div className="flex items-center gap-2 mb-6">
                        <Cpu className="w-6 h-6 text-green-400" />
                        <h2 className="text-xl font-semibold">Developer Tools</h2>
                    </div>
                    <DevTools />
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 shadow-xl">
                    <div className="flex items-center gap-2 mb-6">
                        <Activity className="w-6 h-6 text-purple-400" />
                        <h2 className="text-xl font-semibold">Transaction Monitor</h2>
                    </div>
                    <TransactionMonitor />
                </div>
            </div>
        </div>
    );
};

export default ContractDashboard;