import React from 'react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

const TransactionMonitor = () => {
    return (
        <div className="space-y-4">
            {/* Transaction List */}
            <div className="space-y-3">
                {/* Pending Transaction */}
                <div className="p-3 rounded-lg bg-gray-900/50 border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-medium text-gray-200">transfer</span>
                        </div>
                        <span className="text-xs text-yellow-400">Pending</span>
                    </div>
                    <div className="text-xs font-mono text-gray-400 truncate">
                        0xabcd...1234
                    </div>
                    <div className="text-xs text-gray-500 mt-1">2 minutes ago</div>
                </div>

                {/* Successful Transaction */}
                <div className="p-3 rounded-lg bg-gray-900/50 border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                            <span className="text-sm font-medium text-gray-200">approve</span>
                        </div>
                        <span className="text-xs text-green-400">Success</span>
                    </div>
                    <div className="text-xs font-mono text-gray-400 truncate">
                        0xdef5...6789
                    </div>
                    <div className="text-xs text-gray-500 mt-1">5 minutes ago</div>
                </div>

                {/* Failed Transaction */}
                <div className="p-3 rounded-lg bg-gray-900/50 border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <XCircle className="w-4 h-4 text-red-400" />
                            <span className="text-sm font-medium text-gray-200">mint</span>
                        </div>
                        <span className="text-xs text-red-400">Failed</span>
                    </div>
                    <div className="text-xs font-mono text-gray-400 truncate">
                        0xfedc...4321
                    </div>
                    <div className="text-xs text-gray-500 mt-1">10 minutes ago</div>
                </div>
            </div>
        </div>
    );
}

export default TransactionMonitor;