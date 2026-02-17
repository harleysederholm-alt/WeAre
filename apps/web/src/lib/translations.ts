export type Language = 'en' | 'fi';

export const translations = {
    en: {
        // Navigation
        daily: 'Daily',
        waste: 'Diff/Waste',
        inventory: 'Stock',
        orders: 'Orders',
        // Reports & Audit
        reports: 'Management Reports',
        audit: 'Audit Log',
        purchases: 'Purchases',
        roster: 'Roster',
        admin: 'Admin',
        logout: 'Logout',

        // Buttons
        submit: 'Submit',
        submitDaily: 'Submit Daily Report',
        submitWaste: 'Submit Waste Log',
        submitInventory: 'Submit Inventory',
        refresh: 'Refresh',
        sendOrder: 'Send Order',
        confirm: 'Confirm',
        cancel: 'Cancel',
        approve: 'Approve',
        back: 'Back',
        next: 'Next',
        addNote: 'Add Note',
        saveNote: 'Save Note',
        notePlaceholder: 'Write your note here...',
        downloadPdf: 'Download PDF',

        // Context Sidebar
        contextHelp: 'Context Help',
        selectCell: 'Select a cell to see context-aware guidelines.',
        systemRules: 'System Rules',
        activeFieldHelp: 'Active Field Help',
        memo: 'Memo',

        // Daily Context Rules
        ruleTips: "Only 'Normaali' shifts earn tips.",
        rulePrices: "Prices are frozen at event time.",
        ruleEod: "Submitting EOD locks the report.",

        // Deviations
        shiftDeviations: 'Shift Deviations',
        runAnalysis: 'Run Analysis',
        analyzing: 'Analyzing...',
        noDeviations: 'No deviations found.',
        acknowledge: 'Acknowledge',
        lateStart: 'Late Start',
        missingShift: 'Missing Shift',
        extraShift: 'Extra Shift',

        // Roster Upload
        importRoster: 'Import Planned Roster (MaraPlan)',
        pasteJson: 'Paste JSON here...',
        loadMock: 'Load Mock Data',
        importing: 'Importing...',
        importSuccess: 'Roster Imported Successfully!',
        importFailed: 'Import Failed',

        // Tips
        flushTips: 'Flush Tips (Payout)',
        amount: 'Amount',
        payoutMode: 'Payout Mode',
        normalFlush: 'Normal Flush (20€ Bills)',
        fullSettlement: 'Full Settlement (Exact Amount)',
        confirmPayout: 'Confirm Payout',
        settings: 'Settings',
        managerTipsPolicy: 'Manager Tips Policy',
        includeManagers: 'Include managers in daily distribution?',
        saveSettings: 'Save Settings',
        tipDistribution: 'Tip Distribution Preview',
        allocated: 'Allocated',
        payout: 'Payout',
        remainder: 'Remainder',
        approveDistribution: 'Approve Distribution',

        // Waste
        wasteLog: 'Waste Log',
        item: 'Item',
        quantity: 'Qty',
        reason: 'Reason',

        // Inventory
        stockCount: 'Stock Count',
        onHand: 'On Hand',
        unit: 'Unit',

        // Orders
        reviewSuggestions: 'Review Suggestions',
        noSuggestions: 'No suggestions available.',
        draftOrder: 'Draft Order',
        yourOrderIsEmpty: 'Your order is empty.',

        // Purchases
        pendingPurchases: 'Pending Purchases',
        ingestEmail: 'Ingest Email',
        process: 'Process',

        // Transfers
        incomingTransfers: 'Incoming Transfers',
        accept: 'Accept',
        reject: 'Reject',
        resolveSuccess: 'Transfer Resolved',
        resolveFailed: 'Resolution Failed',
        initiateTransfer: 'Initiate Transfer',
        targetRestaurant: 'Target Restaurant',
        sendStock: 'Send Stock',
        sending: 'Sending...',
        transferInitiated: 'Transfer Initiated!',

        // Reports
        salesReport: 'Sales Report',
        totalSales: 'Total Sales',

        // Daily Grid
        category: 'Category',
        tax: 'VAT / Tax (%)',
        employee: 'Employee',
        role: 'Role',
        start: 'Start',
        end: 'End',
        type: 'Type',
        cashTips: 'Cash Tips',
        vouchers: 'Vouchers',
        voucherCount: 'Count (pcs)',
        voucherValue: 'Total Value (€)',

        // Common 
        loading: 'Loading...',
        success: 'Success',
        error: 'Error',
        restaurant: 'Restaurant',
        user: 'User',
        date: 'Date'
    },
    fi: {
        // Navigation
        daily: 'Päiväkirja',
        waste: 'Hävikki',
        inventory: 'Varasto',
        orders: 'Tilaukset',
        // Reports & Audit
        reports: 'Johdon Raportit',
        audit: 'Järjestelmäloki',
        purchases: 'Ostot',
        roster: 'Työvuorot',
        admin: 'Ylläpito',

        // Buttons
        submit: 'Lähetä',
        logout: 'Kirjaudu ulos',
        submitDaily: 'Lähetä päiväraportti',
        submitWaste: 'Kirjaa hävikki',
        submitInventory: 'Kirjaa inventaario',
        refresh: 'Päivitä',
        sendOrder: 'Lähetä tilaus',
        confirm: 'Vahvista',
        cancel: 'Peruuta',
        approve: 'Hyväksy',
        back: 'Takaisin',
        next: 'Seuraava',
        addNote: 'Lisää merkintä',
        saveNote: 'Tallenna merkintä',
        notePlaceholder: 'Kirjoita merkintä tähän...',
        downloadPdf: 'Lataa PDF',

        // Context Sidebar
        contextHelp: 'Ohjeistus',
        selectCell: 'Valitse solu nähdäksesi ohjeet.',
        systemRules: 'Järjestelmän säännöt',
        activeFieldHelp: 'Kentän ohje',
        memo: 'Muistio',

        // Daily Context Rules
        ruleTips: "Vain 'Normaali'-vuorot kerryttävät tippiä.",
        rulePrices: "Hinnat jäädytetään tapahtumahetkellä.",
        ruleEod: "Päivän päättäminen lukitsee raportin.",

        // Roster
        importRoster: 'Tuo työvuorot',
        pasteJson: 'Liitä JSON tähän...',
        loadMock: 'Lataa esimerkkidata',
        importing: 'Tuodaan...',
        importSuccess: 'Työvuorolista tuotu onnistuneesti!',
        importFailed: 'Tuonti epäonnistui',
        shiftDeviations: 'Työvuoropoikkeamat',
        noDeviations: 'Ei poikkeamia.',
        runAnalysis: 'Suorita analyysi',
        analyzing: 'Analysoidaan...',
        acknowledge: 'Kuittaa',
        lateStart: 'Myöhäinen aloitus',
        missingShift: 'Puuttuva vuoro',
        extraShift: 'Ylimääräinen vuoro',

        // Waste
        wasteLog: 'Hävikki',
        item: 'Tuote',
        quantity: 'Määrä',
        reason: 'Syy',

        // Inventory
        stockCount: 'Varastosaldo',
        onHand: 'Hyllyssä',
        unit: 'Yksikkö',

        // Orders
        reviewSuggestions: 'Tilausehdotukset',
        noSuggestions: 'Ei ehdotuksia saatavilla.',
        draftOrder: 'Tilausluonnos',
        yourOrderIsEmpty: 'Tilauksesi on tyhjä.',

        // Purchases
        pendingPurchases: 'Odottaa hyväksyntää',
        ingestEmail: 'Lue sähköposti',
        process: 'Käsittele',

        // Tips
        flushTips: 'Tippien Tilitys',
        amount: 'Summa',
        payoutMode: 'Maksutapa',
        normalFlush: 'Normaali Tilitys (20€ setelit)',
        fullSettlement: 'Lopputilitys (Tarkka summa)',
        confirmPayout: 'Vahvista Tilitys',
        settings: 'Asetukset',
        managerTipsPolicy: 'Esimiesten Tippikäytäntö',
        includeManagers: 'Sisällytä esimiehet päivittäiseen jakoon?',
        saveSettings: 'Tallenna Asetukset',
        tipDistribution: 'Tippien Jako',
        allocated: 'Jaettava',
        payout: 'Maksettava',
        remainder: 'Jäännös',
        approveDistribution: 'Hyväksy Jako',

        // Transfers
        incomingTransfers: 'Saapuvat Siirrot',
        accept: 'Hyväksy',
        reject: 'Hylkää',
        resolveSuccess: 'Siirto käsitelty',
        resolveFailed: 'Käsittely epäonnistui',
        initiateTransfer: 'Aloita Siirto',
        targetRestaurant: 'Kohderavintola',
        sendStock: 'Lähetä Varastoa',
        sending: 'Lähetetään...',
        transferInitiated: 'Siirto aloitettu!',

        // Reports
        salesReport: 'Myyntiraportti',
        totalSales: 'Kokonaismyynti',

        // Daily Grid
        category: 'Kategoria',
        tax: 'ALV / Vero (%)',
        employee: 'Työntekijä',
        role: 'Rooli',
        start: 'Alkaa',
        end: 'Päättyy',
        type: 'Tyyppi',
        cashTips: 'Käteiset Tipit',
        vouchers: 'Lounassetelit',
        voucherCount: 'Kpl',
        voucherValue: 'Yhteensä (€)',

        // Common
        loading: 'Ladataan...',
        success: 'Onnistui',
        error: 'Virhe',
        restaurant: 'Ravintola',
        user: 'Käyttäjä',
        date: 'Päivämäärä'
    }
};
