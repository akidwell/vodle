
export interface QuoteLineItem {
    quoteId: number | null;
    amount: number | null;
    dueDate: Date | null;
    received: boolean | null;
    lineItemCode: number | null;
    notes: string | null;
    sequence: number | null;
    }