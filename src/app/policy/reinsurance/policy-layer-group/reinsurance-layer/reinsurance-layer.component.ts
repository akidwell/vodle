import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { PolicyInformation, ReinsuranceLayerData } from 'src/app/policy/policy';
import { ReinsuranceLookup } from '../../reinsurance-lookup/reinsurance-lookup';
import { ReinsuranceLookupService } from '../../reinsurance-lookup/reinsurance-lookup.service';

@Component({
  selector: 'rsps-reinsurance-layer',
  templateUrl: './reinsurance-layer.component.html',
  styleUrls: ['./reinsurance-layer.component.css']
})
export class ReinsuranceLayerComponent implements OnInit {
  programId: number = 0;
  effectiveDate: Date = new Date();
  reinsuranceSub!: Subscription;
  reinsuranceCodes$: Observable<ReinsuranceLookup[]> | undefined;
  reisuranceCodes!: ReinsuranceLookup[];
  policyInfo!: PolicyInformation;
  
  @Input() reinsuranceLayer!: ReinsuranceLayerData;
  @Input() index!: number;

  constructor(private route: ActivatedRoute, private reinsuranceLookupService: ReinsuranceLookupService) { }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.policyInfo = data['policyInfoData'].policyInfo;
      this.populateReinsurCode();
    });
  }

    populateReinsurCode(): void {
    this.reinsuranceSub = this.reinsuranceLookupService.getReinsurance(this.policyInfo.programId, this.policyInfo.policyEffectiveDate).subscribe({
      next: reisuranceCodes => {
        this.reisuranceCodes = reisuranceCodes;
        this.reinsuranceCodes$ = of(reisuranceCodes);
      }
    });
  }

  search(): void {
    //this.reinsuranceLayer.treatyNo = null;
    
    //this.states$ = this.reinsuranceLookupService.getReinsurance(this.programId,this.effectiveDate);

    // if (this.reinsuranceLayer.isFaculative) {
    //   this.searchFaculativeReinsurance();
    // }
    // else {
    //   this.searchReinsurance();
    // }
  }

  searchReinsurance(): void {
    // this.reinsuranceSub = this.reinsuranceLookupService.getReinsurance(this.programId, this.effectiveDate).subscribe({
    //   next: reisuranceCodes => {
    //     this.reisuranceCodes = reisuranceCodes;
    //     this.states$ = of(reisuranceCodes);
    //     let match = (reisuranceCodes.find(c => c.layerNumber == Math.max(this.reinsuranceLayer.layerNumber,this.reinsuranceLayer.policyLayer) && c.isDefault == true));
    //     if (match != null) {
    //       this.reinsuranceLayer.treatyNo = match.treatyNumber;
    //       this.reinsuranceLayer.commissionRate = match.cededCommissionRate;
    //     }
    //     else {
    //       this.reinsuranceLayer.treatyNumber = null;
    //       this.reinsuranceLayer.commissionRate = null;
    //     }
    //   }
    // });
  }

  searchFaculativeReinsurance(): void {
    // this.reinsuranceSub = this.reinsuranceLookupService.getFaculativeReinsurance(this.effectiveDate).subscribe({
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

  changeFaculative(): void {
    // this.reinsuranceLayer.treatyNumber = null;
    // this.reinsuranceLayer.certificateNumber = null;
  }

  changeReinsurerCode(): void {
    // let match = (this.reisuranceCodes.find(c => c.treatyNumber ==this.reinsuranceLayer.treatyNumber));
    // if (match != null) {
    //   this.reinsuranceLayer.commissionRate = match.cededCommissionRate;
    // }
  }

  dropDownSearchReinsurance(code: string, item: ReinsuranceLookup) {
    code = code.toLowerCase();
    return item.treatyNumber.toString().toLowerCase().indexOf(code) > -1 || item.treatyName.toString().toLowerCase().indexOf(code) > -1;
  }
}