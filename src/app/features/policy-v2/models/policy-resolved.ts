import { PolicyClass } from '../classes/policy-class';

export interface PolicyResolved {
    policyInfo: PolicyClass | null;
    error?: any;
  }
