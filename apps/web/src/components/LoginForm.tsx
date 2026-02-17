'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const LoginForm: React.FC = () => {
    const { login } = useAuth();
    const [role, setRole] = useState<'STAFF' | 'MANAGER'>('STAFF');

    const handleLogin = () => {
        const email = role === 'MANAGER' ? 'manager@weare.fi' : 'staff@weare.fi';
        login(email, role);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-slate-100 to-slate-200 p-4">
            <div className="glass-panel p-8 rounded-2xl shadow-xl w-full max-w-md transition-all">
                <div className="text-center mb-8">
                    {/* Logo with multiply blend mode to hide white background */}
                    <img
                        src="/logo.png"
                        alt="WeAre Logo"
                        className="h-32 mx-auto object-contain mix-blend-multiply"
                    />
                    <p className="text-sm text-gray-500 mt-4">Operations Portal</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Identity</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value as 'STAFF' | 'MANAGER')}
                            className="w-full bg-slate-50 border border-slate-200 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-3 transition-colors"
                        >
                            <option value="STAFF">Staff (Point of Sale)</option>
                            <option value="MANAGER">Manager (Admin & Reports)</option>
                        </select>
                        <p className="mt-2 text-xs text-gray-500">
                            * This is a mock login for demonstration purposes.
                        </p>
                    </div>

                    <button
                        onClick={handleLogin}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Sign In
                    </button>
                </div>
            </div>

            <footer className="mt-8 text-xs text-gray-400">
                &copy; {new Date().getFullYear()} Project WeAre. All rights reserved.
            </footer>
        </div>
    );
};
