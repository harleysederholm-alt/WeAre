import React, { createContext, useContext, useState, ReactNode } from 'react';

interface HelpContextType {
    currentContext: string; // e.g., 'daily_sales'
    setContext: (ctx: string) => void;
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    language: 'fi' | 'en';
    setLanguage: (lang: 'fi' | 'en') => void;
}

const HelpContext = createContext<HelpContextType | undefined>(undefined);

export const HelpProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentContext, setCurrentContext] = useState<string>('global');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [language, setLanguage] = useState<'fi' | 'en'>('fi');

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

    return (
        <HelpContext.Provider value={{
            currentContext,
            setContext: setCurrentContext,
            isSidebarOpen,
            toggleSidebar,
            language,
            setLanguage
        }}>
            {children}
        </HelpContext.Provider>
    );
};

export const useHelp = () => {
    const context = useContext(HelpContext);
    if (!context) throw new Error('useHelp must be used within a HelpProvider');
    return context;
};
