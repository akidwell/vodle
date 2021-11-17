import { Component, OnInit } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { ReinsuranceLookup } from '../reinsurance-lookup/reinsurance-lookup';
import { ReinsuranceLookupService } from '../reinsurance-lookup/reinsurance-lookup.service';

@Component({
  selector: 'rsps-reinsurance-layer',
  templateUrl: './reinsurance-layer.component.html',
  styleUrls: ['./reinsurance-layer.component.css']
})
export class ReinsuranceLayerComponent implements OnInit {
  reinsuranceLayer!: ReinsuranceLayer;
  programId: number = 0;
  effectiveDate: Date = new Date();
  reinsuranceSub!: Subscription;
  states$: Observable<ReinsuranceLookup[]> | undefined;
  reisuranceCodes!: ReinsuranceLookup[];

  constructor(private reinsuranceLookupService: ReinsuranceLookupService) { }

  ngOnInit(): void {
    this.reinsuranceLayer = newReinsuranceLayer();
  }

  search(): void {
    this.reinsuranceLayer.treatyNumber = null;
    //this.states$ = this.reinsuranceLookupService.getReinsurance(this.programId,this.effectiveDate);

    if (this.reinsuranceLayer.isFaculative) {
      this.searchFaculativeReinsurance();
    }
    else {
      this.searchReinsurance();
    }
    // this.reinsuranceSub = this.reinsuranceLookupService.getReinsurance(this.programId, this.effectiveDate).subscribe({
    //   next: reisuranceCodes => {
    //     this.reisuranceCodes = reisuranceCodes;
    //     this.states$ = of(reisuranceCodes);
    //     let match = (reisuranceCodes.find(c => c.layerNumber == Math.max(this.reinsuranceLayer.layerNumber,this.reinsuranceLayer.policyLayer) && c.isDefault == true));
    //     if (match != null) {
    //       this.reinsuranceLayer.treatyNumber = match.treatyNumber;
    //       this.reinsuranceLayer.commissionRate = match.cededCommissionRate;
    //     }
    //     else {
    //       this.reinsuranceLayer.treatyNumber = null;
    //       this.reinsuranceLayer.commissionRate = null;
    //     }
    //   }
    // });
  }

  searchReinsurance(): void {
    this.reinsuranceSub = this.reinsuranceLookupService.getReinsurance(this.programId, this.effectiveDate).subscribe({
      next: reisuranceCodes => {
        this.reisuranceCodes = reisuranceCodes;
        this.states$ = of(reisuranceCodes);
        let match = (reisuranceCodes.find(c => c.layerNumber == Math.max(this.reinsuranceLayer.layerNumber,this.reinsuranceLayer.policyLayer) && c.isDefault == true));
        if (match != null) {
          this.reinsuranceLayer.treatyNumber = match.treatyNumber;
          this.reinsuranceLayer.commissionRate = match.cededCommissionRate;
        }
        else {
          this.reinsuranceLayer.treatyNumber = null;
          this.reinsuranceLayer.commissionRate = null;
        }
      }
    });
  }

  searchFaculativeReinsurance(): void {
    this.reinsuranceSub = this.reinsuranceLookupService.getFaculativeReinsurance(this.effectiveDate).subscribe({
      next: reisuranceCodes => {
        this.reisuranceCodes = reisuranceCodes;
        this.states$ = of(reisuranceCodes);
        let match = (reisuranceCodes.find(c => c.layerNumber == Math.max(this.reinsuranceLayer.layerNumber,this.reinsuranceLayer.policyLayer) && c.isDefault == true));
        if (match != null) {
          this.reinsuranceLayer.treatyNumber = match.treatyNumber;
          this.reinsuranceLayer.commissionRate = match.cededCommissionRate;
        }
        else {
          this.reinsuranceLayer.treatyNumber = null;
          this.reinsuranceLayer.commissionRate = null;
        }
      }
    });
  }

  changeFaculative(): void {
    this.reinsuranceLayer.treatyNumber = null;
    this.reinsuranceLayer.certificateNumber = null;
  }

  changeReinsurerCode(): void {
    let match = (this.reisuranceCodes.find(c => c.treatyNumber ==this.reinsuranceLayer.treatyNumber));
    if (match != null) {
      this.reinsuranceLayer.commissionRate = match.cededCommissionRate;
    }
  }

  dropDownSearchReinsurance(term: string, item: ReinsuranceLookup) {
    term = term.toLowerCase();
    return item.treatyNumber.toString().toLowerCase().indexOf(term) > -1 || item.treatyName.toString().toLowerCase().indexOf(term) > -1;
  }
}

export interface ReinsuranceLayer {
  policyLayer: number;
  layerNumber: number;
  attachmentPoint: number;
  reinsuranceLimit: number;
  cededPremium: number;
  commissionRate?: number | null;
  treatyNumber?: number | null;
  intermediary: string;
  certificateNumber?: string | null;
  isFaculative: boolean;
}

export const newReinsuranceLayer = (): ReinsuranceLayer => ({
  policyLayer: 1,
  layerNumber: 1,
  attachmentPoint: 0,
  reinsuranceLimit: 0,
  cededPremium: 0,
  commissionRate: null,
  treatyNumber: null,
  intermediary: "",
  certificateNumber: null,
  isFaculative: false
});