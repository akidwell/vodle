import { MortgageeClass } from 'src/app/shared/components/property-mortgagee/mortgagee-class';
import { Endorsement, PolicyLayerData } from '../../policy/models/policy';
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
import { PolicyLayerClass } from './policy-layer-class';

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
  policyLayers: PolicyLayerClass[] = [];

  existingInit(end: Endorsement) {
    this.endorsementNumber = end.endorsementNumber;
    this.transactionTypeCode = end.transactionTypeCode;
    this.endorsementBuilding = this.buildingInit(end.endorsementBuilding as PropertyBuilding[]);
    this.endorsementMortgagee = this.mortgageeInit(end.endorsementMortgagee);
    this.endorsementAdditionalInterest = this.additionalInterestInit(end.endorsementAdditionalInterest);
    this.policyLayers = end.policyLayers?.map(p => new PolicyLayerClass(p));
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

  /**
   * Deletes a policy layer and updates the layer number of remaining policy layers.
   * @param policyLayer The policy layer to delete
   */
  deletePolicyLayer(policyLayer: PolicyLayerClass) {
    const index = this.policyLayers.indexOf(policyLayer);
    if (index >= 0) {
      policyLayer.markForDeletion = true;
      this.policyLayers.splice(index, 1);
      this.policyLayers.forEach((layer, index) => {
        layer.policyLayerNo = index + 1;
        layer.reinsuranceData.forEach(x => x.policyLayerNo = index + 1);
      })
    }
  }

  validateObject(): ErrorMessage[]{
    this.errorMessagesList = this.validateChildren(this);

    /*
    // Reinsurance validation
    if(this.policyLayers.length == 0 ||
      this.policyLayers[0].reinsuranceLayers.length == 0 ||
      this.policyLayers[0].reinsuranceLayers[0].attachmentPoint != this.attachmentPoint) {
      this.createErrorMessage('Attachment point must equal policy attachment point.');
    }
    const totalLimit = this.policyLayers
      .map(p => p.policyLayerLimit)
      .reduce((sum, summand) => sum + summand, 0);
    if (totalLimit != this.limit) {
      this.createErrorMessage('Reinsurance layer limits must total policy limit.');
    }
    const totalPremium = this.policyLayers
      .map(p => p.policyLayerPremium)
      .reduce((sum, summand) => sum + summand, 0);
    if (totalPremium != this.premium) {
      this.createErrorMessage('Reinsurance layer premiums must total policy premium.');
    }
    */

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
      endorsementAdditionalInterest: this.endorsementAdditionalInterest,
      policyLayers: this.policyLayers.map(p => p.toJSON())
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
