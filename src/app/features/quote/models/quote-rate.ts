import { Rate } from 'src/app/shared/models/rate';

export interface QuoteRate extends Rate {
    quoteId: number | null;
}