import React, { useState } from 'react';
import { useHelp } from '../../context/HelpContext';
import { X } from 'lucide-react';

interface HelpSpotProps {
    title: string;
    content: string;
    className?: string; // For positioning
}

export const HelpSpot: React.FC<HelpSpotProps> = ({ title, content, className = '' }) => {
    const { isHelpMode } = useHelp();
    const [isOpen, setIsOpen] = useState(false);

    if (!isHelpMode) return null;

    return (
        <>
            {/* The Visual Ball */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(true);
                }}
                className={`absolute w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-500/40 z-50 animate-bounce active:scale-95 transition-transform border-2 border-white ${className}`}
            >
                ?
                <span className="absolute inset-0 rounded-full bg-indigo-400 opacity-75 animate-ping"></span>
            </button>

            {/* The Mobile Overlay / Drawer */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-in fade-in duration-200">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Card */}
                    <div className="relative bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200"
                        >
                            <X size={16} />
                        </button>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                ?
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                        </div>

                        <div className="prose prose-sm text-slate-600">
                            <p>{content}</p>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold font-lg shadow-lg shadow-indigo-200 active:scale-95 transition-transform"
                            >
                                Selvä!
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
