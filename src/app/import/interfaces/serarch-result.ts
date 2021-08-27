import { ImportPolicy } from "./import-policy";

export interface SearchResult {
    policies: ImportPolicy[];
    total: number;
  }