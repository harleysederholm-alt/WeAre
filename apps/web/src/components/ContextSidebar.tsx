'use client';

import React from 'react';

interface ContextSidebarProps {
    context: string;
    restaurantId: string;
    activeTab: string;
    onAddNote: () => void;
}

const PAGE_INSTRUCTIONS: Record<string, { title: string; content: string; steps?: string[] }> = {
    daily: {
        title: 'Myynnin syöttäminen',
        content: 'Syötä päivän kokonaismyynti Z-raportista. Tarkista, että summa täsmää.',
        steps: ['Ota Z-raportti', 'Etsi rivi "Kokonaismyynti"', 'Syötä summa']
    },
    waste: {
        title: 'Hävikin kirjaus',
        content: 'Kirjaa kaikki pilaantuneet, vanhentuneet tai valmistushävikkiin menneet tuotteet.',
        steps: ['Valitse tuote', 'Syötä määrä', 'Valitse syy (esim. Spilled)']
    },
    inventory: {
        title: 'Inventaario',
        content: 'Laske varastosaldo yksiköittäin. Merkitse avatut pakkaukset desimaaleina.',
        steps: ['Laske täydet pakkaukset', 'Arvioi avatut (0.5 = puolet)', 'Tallenna']
    },
    orders: {
        title: 'Tilausten hallinta',
        content: 'Järjestelmä ehdottaa tilattavia määriä varastosaldon ja menekin perusteella.',
        steps: ['Tarkista ehdotukset', 'Muokkaa määriä tarvittaessa', 'Lähetä tilaus sähköpostilla']
    },
    purchases: {
        title: 'Ostolaskujen käsittely',
        content: 'Tarkista saapuneet laskut ja hyväksy ne varastoon.',
        steps: ['Valitse lasku', 'Tarkista rivit', 'Hyväksy (Confirm)']
    },
    roster: {
        title: 'Työvuorojen hallinta',
        content: 'Tuo toteutuneet vuorot MaraPlanista CSV/JSON-muodossa tai syötä käsin.',
    },
    reports: {
        title: 'Raportointi',
        content: 'Tarkastele myyntiraportteja ja katteita aikavälillä.',
    },
    audit: {
        title: 'Tarkastusloki',
        content: 'Selaa järjestelmän tapahtumahistoriaa ja muutoksia.',
    },
    admin: {
        title: 'Ylläpito',
        content: 'Hallitse tuotteita, hintoja ja käyttäjiä.',
    }
};

import { useLanguage } from '../context/LanguageContext';

export const ContextSidebar: React.FC<ContextSidebarProps> = ({ context, restaurantId, activeTab, onAddNote }) => {
    const { t } = useLanguage();
    // Dictionary lookup is fine for the large block, but we should probably translate the keys in the dictionary too?
    // Actually, for this first pass, let's keep the PAGE_INSTRUCTIONS separate or move them to translations.ts?
    // The user wants full translation. The PAGE_INSTRUCTIONS are currently hardcoded in Finnish in this file.
    // If I switch to English, these will still be Finnish.
    // I should move PAGE_INSTRUCTIONS to a function that uses t() or just have it in the component.
    // But t() returns strings.
    // Let's rely on the translations.ts having these if we want fully dynamic.
    // For now, I will just translate the headers in this file.

    // Quick fix: The user currently seems to prefer Finnish ("suomenna koko sovellus").
    // The dictionary toggle changes 'language'.
    // If language is 'en', we show English.
    // The PAGE_INSTRUCTIONS object currently only has Finnish text.
    // I should ideally support both. For now I'll stick to translation of headers.

    // Better approach: Move PAGE_INSTRUCTIONS validation to use t keys or separate objects.
    // Since I already made a translations.ts, I should probably put these instructions there?
    // It's a bit complex structure. 
    // Let's just translate the UI elements first (headers, buttons).

    const instruction = PAGE_INSTRUCTIONS[activeTab];

    return (
        <aside className="fixed right-0 top-0 h-full w-64 bg-slate-50/90 backdrop-blur-sm border-l border-slate-200 p-6 pt-24 hidden md:block z-10 shadow-lg transition-transform overflow-y-auto">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 mb-4">{t('contextHelp')}</h3>

            {/* Page Context Instruction */}
            {instruction && (
                <div className="bg-white p-4 rounded-lg border border-indigo-100 shadow-sm mb-6">
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">
                        CONTEXT: {activeTab.toUpperCase()}
                    </div>
                    {/* Note: These instructions are currently hardcoded Finnish. To fully i18n, we'd need English versions too. */}
                    <h4 className="font-bold text-indigo-700 mb-2">{instruction.title}</h4>
                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                        {instruction.content}
                    </p>
                    {instruction.steps && (
                        <ul className="space-y-1">
                            {instruction.steps.map((step, i) => (
                                <li key={i} className="text-xs text-slate-500 flex items-start">
                                    <span className="mr-2 text-indigo-400">•</span>
                                    {step}
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="mt-3 pt-2 border-t border-slate-50">
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold">GLOBAL</span>
                    </div>
                </div>
            )}

            {/* Dynamic Context Help (Cell Level) */}
            <div className="mb-2">
                <h4 className="font-bold text-xs text-slate-400 uppercase tracking-widest mb-2">{t('activeFieldHelp')}</h4>
                <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm text-sm text-slate-600 min-h-[60px] leading-relaxed">
                    {context || "Valitse solu nähdäksesi ohjeen."}
                </div>
            </div>

            <button
                onClick={onAddNote}
                className="w-full mt-4 py-2 border-2 border-dashed border-slate-200 rounded-lg text-xs text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors"
            >
                + {t('addNote')}
            </button>

            <div className="mt-8">
                <h4 className="font-bold text-xs text-slate-400 uppercase tracking-widest mb-3">{t('systemRules')}</h4>
                <ul className="text-xs text-slate-500 space-y-2">
                    <li className="flex items-start">
                        <span className="mr-2 text-indigo-500">•</span>
                        {t('ruleTips')}
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2 text-indigo-500">•</span>
                        {t('rulePrices')}
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2 text-indigo-500">•</span>
                        {t('ruleEod')}
                    </li>
                </ul>
            </div>
        </aside>
    );
};
