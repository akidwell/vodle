import { Quote } from './quote';

export interface QuoteResolved {
    quote: Quote | null;
    error?: any;
  }
