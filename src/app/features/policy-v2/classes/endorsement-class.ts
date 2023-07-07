import { Endorsement } from '../../policy/models/policy';
import { PropertyBuildingClass } from '../../quote/classes/property-building-class';
import { PropertyBuildingCoverageClass } from '../../quote/classes/property-building-coverage-class';
import { PropertyPolicyBuildingClass } from '../../quote/classes/property-policy-building-class';
import { PropertyPolicyBuildingCoverageClass } from '../../quote/classes/property-policy-building-coverage-class';
import { PropertyBuilding } from '../../quote/models/property-building';
import { ChildBaseClass } from './base/child-base-class';
import { ErrorMessage } from 'src/app/shared/interfaces/errorMessage';
import { ParentBaseClass } from './base/parent-base-class';
import { Deletable } from 'src/app/shared/interfaces/deletable';
import { PropertyBuildingCoverage } from '../../quote/models/property-building-coverage';

export class EndorsementClass extends ParentBaseClass implements Endorsement {
  onChildDeletion(child: Deletable): void {
  }


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
  endorsementBuilding: PropertyPolicyBuildingClass[] = [];


  existingInit(end: Endorsement) {
    this.endorsementNumber = end.endorsementNumber;
    this.transactionTypeCode = end.transactionTypeCode;
    this.endorsementBuilding = this.buildingInit(end.endorsementBuilding as PropertyBuilding[]);
    this.guid = crypto.randomUUID();
  }
  buildingInit(data: PropertyBuilding[]) {
    const buildings: PropertyPolicyBuildingClass[] = [];
    data.forEach(building => {
      buildings.push(new PropertyPolicyBuildingClass(building));
    });
    const coverages: PropertyBuildingCoverageClass[] = [];
    buildings.forEach(x =>{
      x.endorsementBuildingCoverage.forEach(element => {
        coverages.push(new PropertyPolicyBuildingCoverageClass(element));
      }); 
    });
    return buildings;
  }

  newInit(){
    this.endorsementNumber = 0;
    this.guid = crypto.randomUUID();
  }

  validateObject(): ErrorMessage[]{
    console.log('in end validat' );
    this.errorMessagesList = [];
    this.endorsementBuilding.forEach( x =>{
      x.classValidation();
      this.errorMessagesList = this.errorMessagesList.concat(x.errorMessagesList);
      x.endorsementBuildingCoverage.forEach(x => {
        const y = x.validateObject();
        this.errorMessagesList = this.errorMessagesList.concat(y);
      });
    });
    return this.errorMessagesList;
  }

  onGuidNewMatch(T: ChildBaseClass): void {

  }
  onGuidUpdateMatch(T: ChildBaseClass): void {
  }
  toJson(): Endorsement {
    const buildings: PropertyBuilding[] = [];
    (this.endorsementBuilding as PropertyPolicyBuildingClass[]).forEach(c => buildings.push(c.toJSON()));
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
      endorsementBuilding: buildings,
    };
  }
  buildingsToJson(): PropertyBuilding[] {
    const buildings: PropertyBuilding[] = [];
    const coverages: PropertyBuildingCoverage[] = [];

    this.endorsementBuilding.forEach(x => {
      buildings.push(x);
      x.endorsementBuildingCoverage.forEach(y => {
        coverages.push(y);
      });
    });
    return buildings;
  }
}
