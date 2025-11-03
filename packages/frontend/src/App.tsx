import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Welcome from './pages/Welcome';
import ContractDashboard from './pages/ContractDashboard';
import CrossVmDebug from './pages/CrossVmDebug';
import ContractGenerator from './pages/ContractGenerator';

function App() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
            <Header />

            <main className="container mx-auto px-4 py-8">
                <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route path="/dashboard" element={<ContractDashboard />} />
                    <Route path="/cross-vm-debug" element={<CrossVmDebug />} />
                    <Route path="/contract-generator" element={<ContractGenerator />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;