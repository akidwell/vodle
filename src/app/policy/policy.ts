export interface Policy {
    policyId: number;
    policySymbol: string;
    fullPolicyNumber: string;
}

export interface PolicyResolved {
    policy: Policy | null;
    error?: any;
  }
  