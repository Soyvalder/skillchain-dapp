import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code2, GitBranch, FileCode } from 'lucide-react';

const Welcome: React.FC = () => {
    const features = [
        {
            icon: <Code2 className="w-6 h-6 text-blue-400" />,
            title: 'Contract Dashboard',
            description: 'Interact with your Rust smart contracts through an intuitive interface',
            link: '/dashboard'
        },
        {
            icon: <GitBranch className="w-6 h-6 text-purple-400" />,
            title: 'Cross-VM Debug Bridge',
            description: 'Visualize and debug interactions between Solidity and Rust contracts',
            link: '/cross-vm-debug'
        },
        {
            icon: <FileCode className="w-6 h-6 text-green-400" />,
            title: 'Contract Generator',
            description: 'Generate Rust smart contracts from templates with best practices built-in',
            link: '/contract-generator'
        }
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 text-transparent bg-clip-text">
                    Welcome to Scaffold-Stylus
                </h1>
                <p className="text-xl text-gray-400">
                    Your gateway to building with Rust on Arbitrum
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
                {features.map((feature, index) => (
                    <Link
                        key={index}
                        to={feature.link}
                        className="p-6 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-gray-600 transition-colors group"
                    >
                        <div className="mb-4">{feature.icon}</div>
                        <h2 className="text-xl font-semibold mb-2 text-gray-200">
                            {feature.title}
                        </h2>
                        <p className="text-gray-400 mb-4">{feature.description}</p>
                        <div className="flex items-center text-blue-400 group-hover:text-blue-300">
                            Get Started
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>
                ))}
            </div>

            <div className="p-6 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <h2 className="text-xl font-semibold mb-4 text-blue-400">Why Stylus?</h2>
                <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                        <div className="w-6 h-6 mr-2 flex-shrink-0">•</div>
                        <p>Write smart contracts in Rust with superior performance and lower gas fees</p>
                    </li>
                    <li className="flex items-start">
                        <div className="w-6 h-6 mr-2 flex-shrink-0">•</div>
                        <p>Full interoperability between Solidity and Rust contracts</p>
                    </li>
                    <li className="flex items-start">
                        <div className="w-6 h-6 mr-2 flex-shrink-0">•</div>
                        <p>Leverage Rust's safety features and rich ecosystem of libraries</p>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Welcome;