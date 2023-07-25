import { MortgageeClass } from 'src/app/shared/components/property-mortgagee/mortgagee-class';
import { Endorsement } from '../../policy/models/policy';
import { PropertyBuildingClass } from '../../quote/classes/property-building-class';
import { PropertyBuildingCoverageClass } from '../../quote/classes/property-building-coverage-class';
import { PropertyPolicyBuildingClass } from '../../quote/classes/property-policy-building-class';
import { PropertyPolicyBuildingCoverageClass } from '../../quote/classes/property-policy-building-coverage-class';
import { PropertyBuilding } from '../../quote/models/property-building';
import { ChildBaseClass } from './base/child-base-class';
import { ErrorMessage } from 'src/app/shared/interfaces/errorMessage';
import { AdditionalInterestClass } from 'src/app/shared/components/property-additional-interest.ts/additional-interest-class';
import { MortgageeData } from '../../quote/models/mortgagee';
import { AdditionalInterestData } from '../../quote/models/additional-interest';
import { ParentBaseClass } from './base/parent-base-class';
import { Deletable } from 'src/app/shared/interfaces/deletable';
import { PropertyBuildingCoverage } from '../../quote/models/property-building-coverage';
import { Code } from 'src/app/core/models/code';

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
  endorsementMortgagee: MortgageeClass[] = [];
  endorsementAdditionalInterest: AdditionalInterestClass[] = [];

  existingInit(end: Endorsement) {
    this.endorsementNumber = end.endorsementNumber;
    this.transactionTypeCode = end.transactionTypeCode;
    this.endorsementBuilding = this.buildingInit(end.endorsementBuilding as PropertyBuilding[]);
    this.endorsementMortgagee = this.mortgageeInit(end.endorsementMortgagee);
    this.endorsementAdditionalInterest = this.additionalInterestInit(end.endorsementAdditionalInterest);
    this.guid = crypto.randomUUID();
  }

  additionalInterestInit(data: AdditionalInterestData[]){
    const additionalInterests: AdditionalInterestClass[] = [];
    if(data){
      data.forEach(ai => {
        additionalInterests.push(new AdditionalInterestClass(ai));
      });
    }
    return additionalInterests;
  }
  mortgageeInit(data: MortgageeData[]) {
    const mortgagees: MortgageeClass[] = [];
    if(data){
      data.forEach(mortgagee => {
        mortgagees.push(new MortgageeClass(mortgagee));
      });
    }
    return mortgagees;
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
    //buildings
    this.endorsementBuilding.forEach( x =>{
      x.classValidation();
      this.errorMessagesList = this.errorMessagesList.concat(x.errorMessagesList);
      //coverages
      x.endorsementBuildingCoverage.forEach(x => {
        const y = x.validateObject();
        this.errorMessagesList = this.errorMessagesList.concat(y);
      });
    });
    //mortgagees
    this.endorsementMortgagee.forEach(x => {
      x.classValidation();
      this.errorMessagesList = this.errorMessagesList.concat(x.errorMessagesList);
      if(!this.isDirty){
        this.isDirty = x.isDirty;
      }
    });
    //additional interests
    this.endorsementAdditionalInterest.forEach(x => {
      x.classValidation();
      this.errorMessagesList = this.errorMessagesList.concat(x.errorMessagesList);
      if(!this.isDirty){
        this.isDirty = x.isDirty;
      }
    });
    return this.errorMessagesList;
  }
  get buildingList(): Code[] {
    const buildings: Code[] = [];
    const all: Code = {key: 0, code: 'All', description: 'All'};
    buildings.push(all);
    this.endorsementBuilding.forEach((c) => {
      const building = (c.premisesNumber?.toString() ?? '') + '-' + (c.buildingNumber?.toString() ?? '');
      const code: Code = {key: 0, code: building, description: building + ' : ' + c.address};
      buildings.push(code);
    });
    return buildings;
  }
  onGuidNewMatch(T: ChildBaseClass): void {

  }
  onGuidUpdateMatch(T: ChildBaseClass): void {
  }
  toJson(): Endorsement {
    const buildings: PropertyBuilding[] = [];
    (this.endorsementBuilding as PropertyPolicyBuildingClass[]).forEach(c => buildings.push(c.toJSON()));
    const mortgagees: MortgageeData[] = [];
    (this.endorsementMortgagee as MortgageeClass[]).forEach(c => mortgagees.push(c.toJSON()));
    const additionalInterests: AdditionalInterestData[] = [];
    (this.endorsementAdditionalInterest as AdditionalInterestClass[]).forEach(c => additionalInterests.push(c.toJSON()));
    console.log('line135',mortgagees);
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
      endorsementMortgagee: mortgagees,
      endorsementAdditionalInterest: this.endorsementAdditionalInterest
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
