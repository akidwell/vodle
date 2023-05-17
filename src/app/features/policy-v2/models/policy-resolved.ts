import { PolicyInformation } from '../../policy/models/policy';

export interface PolicyResolved {
    policyInfo: PolicyInformation | null;
    error?: any;
  }
