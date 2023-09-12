import { MortgageeClass } from 'src/app/shared/components/property-mortgagee/mortgagee-class';
import { Endorsement, PolicyLayerData } from '../../policy/models/policy';
import { PropertyBuildingCoverageClass } from '../../quote/classes/property-building-coverage-class';
import { PropertyPolicyBuildingClass } from '../../quote/classes/property-policy-building-class';
import { PropertyPolicyBuildingCoverageClass } from '../../quote/classes/property-policy-building-coverage-class';
import { PropertyBuilding } from '../../quote/models/property-building';
import { ChildBaseClass, ErrorMessageSettings } from './base/child-base-class';
import { ErrorMessage } from 'src/app/shared/interfaces/errorMessage';
import { AdditionalInterestClass } from 'src/app/shared/components/property-additional-interest.ts/additional-interest-class';
import { MortgageeData } from '../../quote/models/mortgagee';
import { AdditionalInterestData } from '../../quote/models/additional-interest';
import { ParentBaseClass } from './base/parent-base-class';
import { Deletable } from 'src/app/shared/interfaces/deletable';
import { PropertyBuildingCoverage } from '../../quote/models/property-building-coverage';
import { Code } from 'src/app/core/models/code';
import { PropertyDeductible, PropertyEndorsementDeductible } from '../../quote/models/property-deductible';
import { PropertyQuoteDeductibleClass } from '../../quote/classes/property-quote-deductible-class';
import { PropertyPolicyDeductibleClass } from './property-policy-deductible-class';
import { PolicyLayerClass } from './policy-layer-class';
import { ValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';
import { PropertyPolicyDeductible } from '../models/property-policy-deductible';
import { ReinsuranceLookup } from '../../policy/services/reinsurance-lookup/reinsurance-lookup';
import { PolicyOptionalPremium } from '../../policy/models/policy-optional-premium';
import { PolicyOptionalPremiumV2 } from '../../policy/models/policy-optional-premium';
import { PolicyOptionalPremiumClassV2 } from './policy-optional-premium-class-v2';

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
  }
  policyId!: number;
  endorsementNumber!: number;
  transactionTypeCode!: number;
  transactionEffectiveDate!: Date;
  transactionExpirationDate!: Date | null;
  sir!: number;
  limit!: number;
  underlyingLimit!: number;
  attachmentPoint!: number;
  endorsementBuilding: PropertyPolicyBuildingClass[] = [];
  endorsementMortgagee: MortgageeClass[] = [];
  endorsementAdditionalInterest: AdditionalInterestClass[] = [];
  endorsementDeductible: PropertyPolicyDeductibleClass[] = [];

  
  private _terrorismCode : string = "";
  public get terrorismCode() : string {
    return this._terrorismCode;
  }
  public set terrorismCode(v : string) {
    this._terrorismCode = v;
    this.markDirty();
  }
  
  private _premium : number = 0;
  public get premium() : number{
    return this._premium;
  }
  public set premium(v : number) {
    this._premium = v;
    this.markDirty();
  }
  
  policyLayers: PolicyLayerClass[] = [];
  reinsuranceCodes: ReinsuranceLookup[] = [];
  reinsuranceFacCodes: ReinsuranceLookup[] = [];
  endorsementBuildingOptionalCoverage: PolicyOptionalPremiumClassV2[] = [];

  existingInit(end: Endorsement) {
    this.endorsementNumber = end.endorsementNumber;
    this.transactionTypeCode = end.transactionTypeCode;
    this.endorsementBuilding = this.buildingInit(end.endorsementBuilding as PropertyBuilding[]);
    this.endorsementMortgagee = this.mortgageeInit(end.endorsementMortgagee);
    this.endorsementAdditionalInterest = this.additionalInterestInit(end.endorsementAdditionalInterest);
    this.endorsementDeductible = this.endorsementDeductibleInit(end.endorsementDeductible);
    this._terrorismCode = end.terrorismCode;
    this._premium = end.premium ?? 0;
    this.endorsementBuildingOptionalCoverage = this.optionalPremiumInit(end.endorsementBuildingOptionalCoverage);
    this.policyLayers = end.policyLayers?.map(p => new PolicyLayerClass(p));
    this.guid = crypto.randomUUID();
    this.reinsuranceCodes = end.reinsuranceCodes;
    this.reinsuranceFacCodes = end.reinsuranceFacCodes;
  }

  endorsementDeductibleInit(data: PropertyPolicyDeductible[]){
    const deductibles: PropertyPolicyDeductibleClass[] = [];
    if(data){
      data.forEach(ded => {
        deductibles.push(new PropertyPolicyDeductibleClass(ded));
      });
    }
    return deductibles;
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

  optionalPremiumInit(data: PolicyOptionalPremiumV2[]) {
    const optionalPremium:PolicyOptionalPremiumClassV2[] = [];
    if(data){
      data.forEach(optional => {
        optionalPremium.push(new PolicyOptionalPremiumClassV2(optional));
      });
    }
    return optionalPremium;
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
      });
    }
  }

  validateObject(): ErrorMessage[]{
    this.errorMessagesList = this.validateChildren(this);
    const settings: ErrorMessageSettings = {preventSave: false, tabAffinity: ValidationTypeEnum.Reinsurance, failValidation: false};
    if(this.policyLayers.length == 0 ||
      this.policyLayers[0].policyLayerAttachmentPoint != this.attachmentPoint) {
      this.createErrorMessage('Attachment point must equal policy attachment point.', settings);
    }
    const totalLimit = this.policyLayers
      .map(p => p.policyLayerLimit)
      .reduce((sum, summand) => sum + summand, 0);
    if (totalLimit != this.limit) {
      this.createErrorMessage('Reinsurance layer limits must total policy limit.', settings);
    }
    const totalPremium = this.policyLayers
      .map(p => p.policyLayerPremium)
      .reduce((sum, summand) => sum + summand, 0);
    if (totalPremium != this.premium) {
      this.createErrorMessage('Reinsurance layer premiums must total policy premium.', settings);
    }
    // Check no limit exceeds maxLimit set in tlkp_ReinsuranceCodes
    this.policyLayers.forEach((policyLayer, policyIndex) => {
      policyLayer.reinsuranceLayers.forEach((reinsLayer, reinsIndex) => {
        const code = this.reinsuranceCodes.find(code => code.treatyNumber == reinsLayer.treatyNo) ?? this.reinsuranceFacCodes.find(code => code.treatyNumber == reinsLayer.treatyNo);
        const prefix = `Policy Layer ${policyIndex + 1} - Reinsurance Layer ${reinsIndex + 1}:`; // Layers are 1-indexed
        if (code) {
          // Hard coded exception for Treaty No. 1: Net
          if (reinsLayer.treatyNo != 1 && (reinsLayer.reinsLimit ?? 0) > code.maxLayerLimit) {
            this.createErrorMessage(`${prefix} Limit is ${reinsLayer.reinsLimit}, but cannot not exceed ${code.maxLayerLimit}.`, settings);
          }
        } else {
          this.createErrorMessage(`${prefix} Unknown treaty number ${reinsLayer.treatyNo}`, settings);
        }
      });
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
    const endorsementDeductibles: PropertyPolicyDeductible[] = [];
    (this.endorsementDeductible as PropertyPolicyDeductibleClass[]).forEach(c => endorsementDeductibles.push(c.toJSON()));
    const endorsementBuildingOptionalCoverage: PolicyOptionalPremium[] = [];
    (this.endorsementBuildingOptionalCoverage as PolicyOptionalPremiumClassV2[]).forEach(c => endorsementBuildingOptionalCoverage.push(c.toJSON()));
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
      reinsuranceCodes: [],
      reinsuranceFacCodes: [],
      endorsementAdditionalInterest: this.endorsementAdditionalInterest,
      endorsementBuildingOptionalCoverage: this.endorsementBuildingOptionalCoverage,
      endorsementDeductible: endorsementDeductibles,
      policyLayers: this.policyLayers.map(p => p.toJSON())
    };
  }
}
