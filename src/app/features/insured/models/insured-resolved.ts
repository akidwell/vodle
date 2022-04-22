import { Insured } from "./insured";

export interface InsuredResolved {
    insured: Insured | null;
    error?: any;
  }
  