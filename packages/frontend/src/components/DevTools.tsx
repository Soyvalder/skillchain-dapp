import React from 'react';
import { Copy, RefreshCw, BarChart3 } from 'lucide-react';

const DevTools = () => {
    return (
        <div className="space-y-6">
            {/* Ink Usage Monitor */}
            <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-700">
                <h3 className="text-lg font-medium text-gray-200 mb-3">Ink Usage Monitor</h3>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Current Ink Usage</span>
                        <span className="text-green-400">1,234 ink</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Equivalent Gas (Est.)</span>
                        <span className="text-blue-400">~0.001 ETH</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors">
                    <Copy className="w-4 h-4" />
                    Copy ABI
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors">
                    <RefreshCw className="w-4 h-4" />
                    Reload Contract
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors">
                    <BarChart3 className="w-4 h-4" />
                    View Metrics
                </button>
            </div>

            {/* Environment Info */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Network</span>
                    <span className="text-gray-200">Arbitrum Testnet</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Stylus Version</span>
                    <span className="text-gray-200">1.0.0</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Contract Address</span>
                    <span className="text-gray-200 font-mono">0x1234...5678</span>
                </div>
            </div>
        </div>
    );
}

export default DevTools;