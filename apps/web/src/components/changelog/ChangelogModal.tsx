import React, { useEffect, useState } from 'react';
import { getChangelogStatus, ackChangelog } from '../../lib/api';
import { useLanguage } from '../../context/LanguageContext';

interface Change {
    domain: string;
    changeType: string;
    description: string;
}

export const ChangelogModal: React.FC = () => {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [changes, setChanges] = useState<any[]>([]);
    const [currentVersion, setCurrentVersion] = useState(0);

    const checkStatus = async () => {
        try {
            const status = await getChangelogStatus();
            if (status.requiresAck) {
                // Flatten changes from history
                const allChanges = status.pendingChanges.flatMap((h: any) => h.changes);
                setChanges(allChanges);
                setCurrentVersion(status.currentVersion);
                setIsOpen(true);
            }
        } catch (e) {
            console.error("Failed to check changelog", e);
        }
    };

    useEffect(() => {
        checkStatus();
        // Poll every 30s? Or just once on mount. 
        // Once on mount is fine for now, or maybe interval.
        const interval = setInterval(checkStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleAck = async () => {
        try {
            await ackChangelog(currentVersion.toString());
            setIsOpen(false);
        } catch (e) {
            alert("Failed to acknowledge");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[80vh]">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                    <h2 className="text-xl font-bold text-slate-900">{t('systemUpdate')}</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        {t('ackChanges')}
                    </p>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {changes.length === 0 ? (
                        <p className="text-slate-500 italic">{t('noDetails')}</p>
                    ) : (
                        <div className="space-y-4">
                            {changes.map((c, i) => (
                                <div key={i} className="flex gap-3 items-start">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${(c.changeType === 'UPDATE' || c.changeType === 'PÄIVITYS') ? 'bg-blue-100 text-blue-700' :
                                            (c.changeType === 'CREATE' || c.changeType === 'UUSI') ? 'bg-green-100 text-green-700' :
                                                'bg-red-100 text-red-700'
                                        }`}>
                                        {c.changeType}
                                    </span>
                                    <div>
                                        <p className="font-medium text-sm text-slate-800">{c.description}</p>
                                        <span className="text-xs text-slate-400">{c.domain}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
                    <button
                        onClick={handleAck}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                        {t('ackAndContinue')}
                    </button>
                </div>
            </div>
        </div>
    );
};
