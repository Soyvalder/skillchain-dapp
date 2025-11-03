import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NavLink } from 'react-router-dom';
import { Cpu, Layout, GitBranch, FileCode } from 'lucide-react';

const Header: React.FC = () => {
    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isActive
            ? 'bg-blue-500/20 text-blue-400'
            : 'text-gray-400 hover:text-gray-300'
        }`;

    return (
        <header className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Cpu className="w-8 h-8 text-blue-400" />
                        <div>
                            <h1 className="text-2xl font-bold text-white">Scaffold-Stylus</h1>
                            <p className="text-sm text-gray-400">Build with Rust on Arbitrum</p>
                        </div>
                    </div>

                    <nav className="flex items-center gap-4">
                        <NavLink to="/" className={navLinkClass} end>
                            <Layout className="w-4 h-4" />
                            Home
                        </NavLink>
                        <NavLink to="/dashboard" className={navLinkClass}>
                            <Cpu className="w-4 h-4" />
                            Dashboard
                        </NavLink>
                        <NavLink to="/cross-vm-debug" className={navLinkClass}>
                            <GitBranch className="w-4 h-4" />
                            Cross-VM Debug
                        </NavLink>
                        <NavLink to="/contract-generator" className={navLinkClass}>
                            <FileCode className="w-4 h-4" />
                            Generator
                        </NavLink>
                        <div className="ml-4">
                            <ConnectButton chainStatus="icon" accountStatus="avatar" />
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;