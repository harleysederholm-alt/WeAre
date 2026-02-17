import { Injectable } from '@nestjs/common';
import * as path from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PdfPrinter = require('pdfmake');
// Handle potential default export from ESM/CommonJS interop
const Printer = PdfPrinter.default || PdfPrinter;

@Injectable()
export class PdfService {
    private printer: any;

    constructor() {
        const fontDescriptors = {
            Roboto: {
                normal: path.join(__dirname, '../../../../node_modules/pdfmake/examples/fonts/Roboto-Regular.ttf'),
                bold: path.join(__dirname, '../../../../node_modules/pdfmake/examples/fonts/Roboto-Medium.ttf'),
                italics: path.join(__dirname, '../../../../node_modules/pdfmake/examples/fonts/Roboto-Italic.ttf'),
                bolditalics: path.join(__dirname, '../../../../node_modules/pdfmake/examples/fonts/Roboto-MediumItalic.ttf')
            }
        };
        // Fallback to standard fonts if Roboto isn't found? 
        // Actually, let's just use standard fonts if possible to avoid path hell in prod.
        // But pdfmake really wants files in Node.
        // For this environment, I'll rely on the node_modules path or a simpler approach.
        // Let's try standard Courier/Helvetica for safety if Roboto fails.
        // Wait, PdfPrinter needs a font object. 

        try {
            this.printer = new Printer(fontDescriptors);
        } catch (e) {
            console.warn('Failed to load Roboto fonts, PDF generation might fail.', e);
        }
    }

    generateDailyReportPdf(report: any): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const docDefinition = {
                content: [
                    { text: 'Daily Report', style: 'header' },
                    { text: `Date: ${report.date}`, style: 'subheader' },
                    { text: `Restaurant: ${report.restaurantId}`, style: 'subheader' },
                    { text: '\n' },
                    {
                        table: {
                            headerRows: 1,
                            widths: ['*', 'auto'],
                            body: [
                                ['Category', 'Amount'],
                                ['Lunch Sales', `${report.lunchSales || 0}€`],
                                ['Dinner Sales', `${report.dinnerSales || 0}€`],
                                ['Cash in Drawer', `${report.cashInDrawer || 0}€`],
                                ['Cash Tips', `${report.cashTips || 0}€`]
                            ]
                        }
                    },
                    { text: '\n' },
                    { text: `Signed by: ${report.submittedBy || 'Unknown'}`, style: 'footer' },
                    { text: `Generated: ${new Date().toISOString()}`, style: 'tiny' }
                ],
                styles: {
                    header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
                    subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
                    footer: { fontSize: 12, italics: true, margin: [0, 20, 0, 0] },
                    tiny: { fontSize: 8, color: 'gray' }
                }
            };

            const pdfDoc = this.printer.createPdfKitDocument(docDefinition);
            const chunks: Buffer[] = [];
            pdfDoc.on('data', (chunk: Buffer) => chunks.push(chunk));
            pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
            pdfDoc.on('error', (err: any) => reject(err));
            pdfDoc.end();
        });
    }
}
