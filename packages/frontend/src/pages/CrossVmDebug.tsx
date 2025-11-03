import React from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    Node,
    Edge
} from 'react-flow-renderer';

const CrossVmDebug: React.FC = () => {
    const nodes: Node[] = [
        {
            id: '1',
            type: 'input',
            data: {
                label: (
                    <div className="p-2">
                        <div className="font-semibold">ERC20 Token (Solidity)</div>
                        <div className="text-xs text-gray-400">0x1234...5678</div>
                    </div>
                )
            },
            position: { x: 250, y: 0 },
            className: 'bg-blue-500/20 border-blue-500/40'
        },
        {
            id: '2',
            data: {
                label: (
                    <div className="p-2">
                        <div className="font-semibold">Vault Contract (Rust)</div>
                        <div className="text-xs text-gray-400">0xabcd...efgh</div>
                    </div>
                )
            },
            position: { x: 250, y: 200 },
            className: 'bg-purple-500/20 border-purple-500/40'
        }
    ];

    const edges: Edge[] = [
        {
            id: 'e1-2',
            source: '1',
            target: '2',
            animated: true,
            label: 'transfer()',
            className: 'text-gray-400'
        }
    ];

    return (
        <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                <h2 className="text-xl font-semibold mb-4">Cross-VM Interaction Flow</h2>
                <div className="h-[400px] rounded-lg bg-gray-900/50 border border-gray-700">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        fitView
                    >
                        <Background />
                        <Controls />
                        <MiniMap />
                    </ReactFlow>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                    <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-400">Execution Time</span>
                                <span className="text-green-400">EVM: 1.2ms | WASM: 0.3ms</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full">
                                <div className="h-full w-1/4 bg-green-400 rounded-full"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-400">Gas Usage</span>
                                <span className="text-blue-400">EVM: 45k | WASM: 12k</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full">
                                <div className="h-full w-1/3 bg-blue-400 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                    <h3 className="text-lg font-semibold mb-4">Data Flow</h3>
                    <div className="space-y-3 text-sm">
                        <div className="p-3 rounded-lg bg-gray-900/50 border border-gray-700">
                            <div className="text-blue-400 mb-1">EVM → WASM</div>
                            <code className="text-gray-300">bytes4(keccak256("transfer(address,uint256)"))</code>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-900/50 border border-gray-700">
                            <div className="text-purple-400 mb-1">WASM → EVM</div>
                            <code className="text-gray-300">Result&lt;Vec&lt;u8&gt;&gt;</code>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CrossVmDebug;