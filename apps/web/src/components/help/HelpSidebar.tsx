import React, { useEffect, useState, useRef } from 'react';
import { useHelp } from '../../context/HelpContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Bot, Send, Sparkles, X, ChevronRight } from 'lucide-react';

// Mock API Call (simulating Agent response)
const fetchAgentResponse = async (context: string, query: string) => {
    // In a real app, this would hit the LLM endpoint
    // For now, we reuse the help article search or mock a response
    try {
        const params = new URLSearchParams();
        if (context) params.append('context', context);
        if (query) params.append('query', query);

        const res = await fetch(`http://localhost:3001/api/help?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch help');
        return await res.json();
    } catch (error) {
        console.error('Error fetching help:', error);
        return [];
    }
};

interface HelpSidebarProps {
    onAddNote?: () => void;
}

export const HelpSidebar: React.FC<HelpSidebarProps> = ({ onAddNote }) => {
    const { isSidebarOpen, toggleSidebar, currentContext, language } = useHelp();
    const { user } = useAuth();
    const { t } = useLanguage();

    // Chat State
    const [messages, setMessages] = useState<any[]>([
        { id: 'welcome', role: 'agent', content: 'Hello! I am your WeAre Agent. I know everything about your daily reports, waste, and inventory. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isSidebarOpen) {
            // Context aware greeting
            const contextMsg = {
                id: `ctx-${Date.now()}`,
                role: 'agent',
                content: `I see you are working on **${t(currentContext as any) || currentContext}**. ask me anything about this page!`
            };
            setMessages(prev => [...prev, contextMsg]);
        }
    }, [isSidebarOpen, currentContext, t]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate network delay / thinking
        setTimeout(async () => {
            const results = await fetchAgentResponse(currentContext, userMsg.content);
            let agentResponse = "";

            if (results && results.length > 0) {
                const article = results[0];
                const title = language === 'fi' ? article.title_fi : article.title_en || article.title_fi;
                const body = language === 'fi' ? article.body_fi : article.body_en || article.body_fi;
                agentResponse = `**${title}**\n\n${body}`;
            } else {
                agentResponse = language === 'fi'
                    ? "Hmm, en löytänyt suoraa vastausta tietokannastani tähän. Voitko tarkentaa?"
                    : "Hmm, I couldn't find a direct answer in my database. Could you rephrase?";
            }

            setMessages(prev => [...prev, { id: Date.now() + 1, role: 'agent', content: agentResponse }]);
            setIsTyping(false);
        }, 1500);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend();
    };

    if (!isSidebarOpen) return null;

    return (
        <div className="fixed right-0 top-0 h-full w-full sm:w-[400px] glass-panel dark:bg-slate-900/95 border-l border-violet-200/50 dark:border-violet-900/50 shadow-2xl z-[60] flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-4 border-b border-violet-100 dark:border-violet-900/30 bg-violet-50/50 dark:bg-violet-900/20 flex justify-between items-center backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-lg shadow-violet-500/30">
                        <Bot size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-800 dark:text-white leading-tight">WeAre Agent</h2>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-medium text-violet-600 dark:text-violet-300 uppercase tracking-wider">Online</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={toggleSidebar}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/50">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                            className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                ? 'bg-violet-600 text-white rounded-tr-none'
                                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none'
                                }`}
                        >
                            {msg.role === 'agent' && (
                                <div className="flex items-center gap-2 mb-1.5 opacity-70 border-b border-slate-100 dark:border-slate-800 pb-1">
                                    <Sparkles size={12} className="text-violet-500" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-violet-500">AI Assistant</span>
                                </div>
                            )}
                            <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-start animate-pulse">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1">
                            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                {currentContext && (
                    <div className="flex items-center gap-2 mb-3 px-1 overflow-x-auto">
                        <span className="text-[10px] whitespace-nowrap text-slate-400 uppercase font-bold">Suggestions:</span>
                        <button onClick={() => setInput(`Explain ${currentContext} data`)} className="text-xs px-2.5 py-1 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-300 rounded-full border border-violet-100 dark:border-violet-800 hover:bg-violet-100 transition-colors whitespace-nowrap">
                            Analyze {t(currentContext as any)}
                        </button>
                        <button onClick={() => setInput('Show formatting rules')} className="text-xs px-2.5 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition-colors whitespace-nowrap">
                            Formatting Rules
                        </button>
                    </div>
                )}

                <div className="relative flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t('searchGuides') || "Ask Agent..."}
                        className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all shadow-inner"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="absolute right-2 p-1.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-violet-500/20"
                    >
                        <Send size={16} strokeWidth={2.5} />
                    </button>
                </div>
                <div className="text-center mt-2">
                    <span className="text-[10px] text-slate-300 dark:text-slate-600 font-medium">WeAre Agent v0.1 • AI Powered</span>
                </div>
            </div>
        </div>
    );
};
