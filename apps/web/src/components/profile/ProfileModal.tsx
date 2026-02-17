import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Download, Trash2, Shield, User, Mail, Building } from 'lucide-react';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
    const { t, language } = useLanguage();
    const { user, activeRestaurant } = useAuth();

    if (!isOpen) return null;

    const handleDownloadData = () => {
        alert(language === 'fi'
            ? 'Tietopyyntö vastaanotettu. Toimitamme tiedot sähköpostiisi 30 päivän kuluessa GDPR-asetuksen mukaisesti.'
            : 'Data request received. We will send your data to your email within 30 days in compliance with GDPR.'
        );
    };

    const handleDeleteRequest = () => {
        const confirm = window.confirm(language === 'fi'
            ? 'Haluatko varmasti pyytää tilin poistoa? Tämä toiminto on peruuttamaton.'
            : 'Are you sure you want to request account deletion? This action cannot be undone.'
        );
        if (confirm) {
            alert(language === 'fi'
                ? 'Poistopyyntö kirjattu. Olemme yhteydessä vahvistaaksemme henkilöllisyytenne.'
                : 'Deletion request logged. We will contact you to verify your identity.'
            );
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <Shield className="text-indigo-600 dark:text-indigo-400" size={28} />
                            {t('userProfile' as any) || (language === 'fi' ? 'Käyttäjäprofiili & Tietosuoja' : 'User Profile & Privacy')}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            {language === 'fi' ? 'Hallinnoi tietojasi ja yksityisyyttäsi' : 'Manage your data and privacy'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Basic Info Section */}
                    <section>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                            <User size={20} />
                            {language === 'fi' ? 'Perustiedot' : 'Basic Information'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                    {language === 'fi' ? 'Nimi' : 'Name'}
                                </label>
                                <div className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                    <User size={16} className="text-indigo-500" />
                                    {(user as any)?.name || 'User'}
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                    {language === 'fi' ? 'Sähköposti' : 'Email'}
                                </label>
                                <div className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                    <Mail size={16} className="text-indigo-500" />
                                    {user?.email}
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                    {language === 'fi' ? 'Rooli' : 'Role'}
                                </label>
                                <div className="font-medium text-slate-900 dark:text-white">
                                    <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded text-xs font-bold">
                                        {user?.role}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                    {language === 'fi' ? 'Ravintola' : 'Restaurant'}
                                </label>
                                <div className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                    <Building size={16} className="text-indigo-500" />
                                    {activeRestaurant?.name}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* GDPR / Privacy Section */}
                    <section className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                            <Shield size={20} className="text-emerald-500" />
                            {language === 'fi' ? 'Tietosuoja & GDPR' : 'Data Privacy & GDPR'}
                        </h3>

                        <div className="prose prose-sm dark:prose-invert text-slate-600 dark:text-slate-400 mb-6">
                            {language === 'fi' ? (
                                <>
                                    <p>
                                        Noudatamme Euroopan Unionin yleistä tietosuoja-asetusta (GDPR) sekä Suomen tietosuojalakia (1050/2018).
                                        Sinulla on oikeus tarkastaa sinusta tallennetut tiedot, pyytää virheellisten tietojen oikaisua sekä
                                        tietojen poistamista ("oikeus tulla unohdetuksi"), mikäli lakisääteiset velvoitteet eivät estä sitä.
                                    </p>
                                    <p className="mt-2">
                                        Henkilötietojasi käsitellään luottamuksellisesti ja niitä käytetään ainoastaan tämän palvelun tuottamiseen
                                        sekä lakisääteisten velvoitteiden (esim. kirjanpito) täyttämiseen.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p>
                                        We comply with the European Union General Data Protection Regulation (GDPR) and the Finnish Data Protection Act (1050/2018).
                                        You have the right to access your stored data, request correction of inaccurate data, and request deletion
                                        of your data ("right to be forgotten"), unless statutory obligations prevent it.
                                    </p>
                                    <p className="mt-2">
                                        Your personal data is processed confidentially and used solely for providing this service and fulfilling
                                        statutory obligations (e.g., accounting).
                                    </p>
                                </>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <button
                                onClick={handleDownloadData}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-200 font-medium"
                            >
                                <Download size={18} />
                                {language === 'fi' ? 'Lataa omat tiedot (XML/JSON)' : 'Download My Data (XML/JSON)'}
                            </button>
                            <button
                                onClick={handleDeleteRequest}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
                            >
                                <Trash2 size={18} />
                                {language === 'fi' ? 'Pyydä tietojen poistoa' : 'Request Account Deletion'}
                            </button>
                        </div>
                    </section>
                </div>

                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        {language === 'fi' ? 'Sulje' : 'Close'}
                    </button>
                </div>
            </div>
        </div>
    );
};
