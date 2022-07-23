export interface QuoteRate {
    quoteId: number | null;
    sequenceNo: number | null;
    rateBasis: number | null;
    premiumRate: number | null;
    isFlatRate: boolean | null;
    premium: number | null;
}