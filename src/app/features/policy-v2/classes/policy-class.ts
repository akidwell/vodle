import { Validation } from 'src/app/shared/interfaces/validation';
import { Policy } from '../models/policy';
import { Insured } from '../../insured/models/insured';

export class PolicyClass implements Policy, Validation {
  departmentId!: number;
  policyId!: number;


  policySymbol!: string;
  formattedPolicyNo!: string;
  programId!: number;
  policyEffectiveDate!: Date;

  insured!: Insured;
  isValid!: boolean;
  isDirty!: boolean;
  canBeSaved!: boolean;
  errorMessages!: string[];
  validationResults?: Validation | undefined;
  validate?(): Validation {
    throw new Error('Method not implemented.');
  }
  markDirty?: (() => void) | undefined;
}
