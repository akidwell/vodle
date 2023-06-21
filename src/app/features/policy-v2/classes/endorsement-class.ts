import { Endorsement } from '../../policy/models/policy';
import { PropertyBuildingClass } from '../../quote/classes/property-building-class';
import { PropertyPolicyBuildingClass } from '../../quote/classes/property-policy-building-class';
import { PropertyBuilding } from '../../quote/models/property-building';
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
  endorsementBuilding: PropertyBuildingClass[] = [];


  existingInit(end: Endorsement) {
    this.endorsementNumber = end.endorsementNumber;
    this.transactionTypeCode = end.transactionTypeCode;
    this.endorsementBuilding = this.buildingInit(end.endorsementBuilding);
    this.guid = crypto.randomUUID();
  }
  buildingInit(data: PropertyBuilding[]) {
    const buildings: PropertyBuildingClass[] = [];
    data.forEach(building => {
      buildings.push(new PropertyPolicyBuildingClass(building));
    });
    return buildings;
  }

  newInit(){
    this.endorsementNumber = 0;
    this.guid = crypto.randomUUID();
  }

  validateObject(): ErrorMessage[]{
    return this.errorMessagesList;
  }

  onGuidNewMatch(T: ChildBaseClass): void {
    
  }
  onGuidUpdateMatch(T: ChildBaseClass): void {
  }
  toJson(): Endorsement {
    return {
      policyId: this.policyId,
      endorsementNumber: this.endorsementNumber,
      transactionTypeCode: this.transactionTypeCode,
      transactionEffectiveDate: this.transactionEffectiveDate,
      transactionExpirationDate: this.transactionExpirationDate,
      terrorismCode: this.terrorismCode,
      sir: this.sir,
      premium: this.premium,
      limit: this.limit,
      underlyingLimit: this.underlyingLimit,
      attachmentPoint: this.attachmentPoint,
      endorsementBuilding: this.buildingsToJson()
    };
  }
  buildingsToJson(): PropertyBuilding[] {
    const buildings: PropertyBuilding[] = [];
    this.endorsementBuilding.forEach(x => {
      buildings.push(x);
    });
    console.log(buildings);
    return buildings;
  }
}
