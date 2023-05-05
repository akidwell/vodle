import { PolicyInformation } from '../../policy/models/policy';
import { PolicyClass } from '../classes/policy-class';

export interface PolicyResolved {
    policy: PolicyInformation | null;
    error?: any;
  }
