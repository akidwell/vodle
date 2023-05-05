
import { Insured } from '../../insured/models/insured';

export interface Policy {
  departmentId: number;
  insured: Insured;
  policySymbol: string;
  formattedPolicyNo: string;
  programId: number;
  policyEffectiveDate: Date;
}
