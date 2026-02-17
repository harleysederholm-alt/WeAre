import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface NoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (note: string) => void;
    contextTitle?: string;
}

export const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose, onSave, contextTitle }) => {
    const { t } = useLanguage();
    const [note, setNote] = useState('');

    if (!isOpen) return null;

    const handleSave = () => {
        if (!note.trim()) {
            onClose();
            return;
        }
        onSave(note);
        setNote('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">{t('addNote')} {contextTitle ? `- ${contextTitle}` : ''}</h2>
                <textarea
                    className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    placeholder={t('notePlaceholder')}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    autoFocus
                />
                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
                    >
                        {t('cancel')}
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold shadow-lg transition-all active:scale-95"
                    >
                        {t('saveNote')}
                    </button>
                </div>
            </div>
        </div>
    );
};
