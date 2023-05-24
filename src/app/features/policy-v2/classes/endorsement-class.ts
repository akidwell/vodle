import { Endorsement } from '../../policy/models/policy';
import { ChildBaseClass } from './base/child-base-class';
import { ErrorMessage } from 'src/app/shared/interfaces/errorMessage';

export class EndorsementClass extends ChildBaseClass implements Endorsement {


  constructor(endorsement?: Endorsement) {
    super();
    if (endorsement) {
      this.existingInit(endorsement);
    } else {
      this.newInit();
    }
    //this.setWarnings();
  }
  policyId!: number;
  endorsementNumber!: number;
  transactionTypeCode!: number;
  transactionEffectiveDate!: Date;
  transactionExpirationDate!: Date | null;
  terrorismCode!: string;
  sir!: number;
  premium!: number | null;
  limit!: number;
  underlyingLimit!: number;
  attachmentPoint!: number;


  existingInit(end: Endorsement) {
    this.endorsementNumber = end.endorsementNumber;
    this.transactionTypeCode = end.transactionTypeCode;
    this.guid = crypto.randomUUID();
  }


  newInit(){
    this.endorsementNumber = 0;
    this.guid = crypto.randomUUID();
  }

  validate(): ErrorMessage[]{
    return this.errorMessages;
  }

  onGuidNewMatch(T: ChildBaseClass): void {
    throw new Error('Method not implemented.');
  }
  onGuidUpdateMatch(T: ChildBaseClass): void {
    throw new Error('Method not implemented.');
  }

}
