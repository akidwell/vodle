import { Component, OnInit } from '@angular/core';
import { EndorsementCoveragesGroup } from './coverages';

@Component({
  selector: 'rsps-coverages',
  templateUrl: './coverages.component.html',
  styleUrls: ['./coverages.component.css']
})
export class CoveragesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  endorsementCoveragesGroups: EndorsementCoveragesGroup[] = [{
    endorsementCoverageLocation : {
      locationId : 5243
    },
    endorsementCoverages : [{
      coverageId: 1350,
      policyId: 2135326,
      premium: 1000,
      limitsPattern: '1000000/1000000',
      includeExclude: 'I',
      claimsMadeOrOccurrence: 'O',
      retroDate: null,
      locationId: 5243,
      premiumType: 'S',
      action: 'A',
      deductible: 500,
      deductibleType: 'Per Claim',
      rateAmt: 10.766,
      limitsPatternGroupCode: 998,
      sir: 0,
      glClassCode: 68604,
      classDescription: 'text',
      exposureCode: 'AA',
      rateBasis: 1000,
      exposureBase: 1100,
      ecCollapsed: true,
      occurrenceOrClaimsMade: true
    },
    {
      coverageId: 5673,
      policyId: 2135326,
      premium: 2000,
      limitsPattern: '2000000/2000000',
      includeExclude: 'I',
      claimsMadeOrOccurrence: '',
      retroDate: null,
      locationId: 5243,
      premiumType: 'S',
      action: 'A',
      deductible: 500,
      deductibleType: 'Per Claim',
      rateAmt: 10.966,
      limitsPatternGroupCode: 998,
      sir: 0,
      glClassCode: 50987,
      classDescription: 'more text',
      exposureCode: 'AA',
      rateBasis: 1000,
      exposureBase: 1100,
      ecCollapsed: true,
      occurrenceOrClaimsMade: false
    }]
  },
  {
    endorsementCoverageLocation : {
      locationId : 1235
    },
    endorsementCoverages : [{
      coverageId: 1350,
      policyId: 2135326,
      premium: 1000,
      limitsPattern: '5000000/5000000',
      includeExclude: 'I',
      claimsMadeOrOccurrence: 'C',
      retroDate: Date.now(),
      locationId: 1235,
      premiumType: 'S',
      action: 'A',
      deductible: 500,
      deductibleType: 'Per Claim',
      rateAmt: 10.766,
      limitsPatternGroupCode: 998,
      sir: 0,
      glClassCode: 68604,
      classDescription: 'text',
      exposureCode: 'AA',
      rateBasis: 1000,
      exposureBase: 1100,
      ecCollapsed: true,
      occurrenceOrClaimsMade: true
    },
    {
      coverageId: 3472,
      policyId: 2135326,
      premium: 2000,
      limitsPattern: '2000000/3000000',
      includeExclude: 'I',
      claimsMadeOrOccurrence: '',
      retroDate: null,
      locationId: 1235,
      premiumType: 'S',
      action: 'A',
      deductible: 500,
      deductibleType: 'Per Claim',
      rateAmt: 10.966,
      limitsPatternGroupCode: 998,
      sir: 0,
      glClassCode: 50987,
      classDescription: 'more text',
      exposureCode: 'AA',
      rateBasis: 1000,
      exposureBase: 1100,
      ecCollapsed: true,
      occurrenceOrClaimsMade: false
    }]
  }];

  };
