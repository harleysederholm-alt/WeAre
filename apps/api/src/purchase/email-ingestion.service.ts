import { Injectable } from '@nestjs/common';
import { ParsedItemDto } from './purchase.dto';

export interface ParsedOrder {
    supplierName: string;
    orderDate: string;
    items: ParsedItemDto[];
    rawBody: string;
}

@Injectable()
export class EmailIngestionService {

    parseEmail(sender: string, subject: string, body: string): ParsedOrder {
        // Simple Strategy Selector
        if (sender.includes('tukku') || body.includes('Tukku')) {
            return this.parseTukkuFormat(body);
        }

        // Fallback / Default
        return this.parseGenericFormat(body);
    }

    private parseTukkuFormat(body: string): ParsedOrder {
        const items: ParsedItemDto[] = [];
        const lines = body.split('\n');

        // Regex for lines like: "- Milk 1L (EAN: 64101) x 10 @ 1.50"
        // Captures: Name, EAN, Qty, Price
        const itemRegex = /-\s+(.+?)\s+\(EAN:\s*(\d+)\)\s+x\s+(\d+)\s+@\s+(\d+\.?\d*)/;

        for (const line of lines) {
            const match = line.match(itemRegex);
            if (match) {
                const [_, name, ean, qtyStr, priceStr] = match;
                const quantity = parseFloat(qtyStr);
                const unitPrice = parseFloat(priceStr);

                items.push({
                    name: name.trim(),
                    ean: ean,
                    quantity,
                    unitPrice,
                    total: quantity * unitPrice
                });
            }
        }

        return {
            supplierName: 'Tukku Oy',
            orderDate: new Date().toISOString().split('T')[0], // Mock date extraction
            items,
            rawBody: body
        };
    }

    private parseGenericFormat(body: string): ParsedOrder {
        // Very dumb parser for fallback
        return {
            supplierName: 'Unknown',
            orderDate: new Date().toISOString().split('T')[0],
            items: [],
            rawBody: body
        };
    }
}
