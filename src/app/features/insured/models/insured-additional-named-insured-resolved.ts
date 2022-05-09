import { AdditionalNamedInsured } from 'src/app/shared/components/additional-named-insured/additional-named-insured';

export interface InsuredAdditionalNamedInsuredsResolved {
    additionalNamedInsureds: AdditionalNamedInsured[] | null;
    error?: any;
  }
