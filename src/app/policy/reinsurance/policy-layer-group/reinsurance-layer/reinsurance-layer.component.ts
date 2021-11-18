import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { PolicyInformation, ReinsuranceLayerData } from 'src/app/policy/policy';
import { ReinsuranceLookup } from '../../reinsurance-lookup/reinsurance-lookup';
import { ReinsuranceLookupService } from '../../reinsurance-lookup/reinsurance-lookup.service';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'rsps-reinsurance-layer',
  templateUrl: './reinsurance-layer.component.html',
  styleUrls: ['./reinsurance-layer.component.css']
})
export class ReinsuranceLayerComponent implements OnInit {
  faTrash = faTrash;
  programId: number = 0;
  effectiveDate: Date = new Date();
  reinsuranceSub!: Subscription;
  reinsuranceCodes$: Observable<ReinsuranceLookup[]> | undefined;
  reisuranceCodes!: ReinsuranceLookup[];
  reinsuranceFacCodes$: Observable<ReinsuranceLookup[]> | undefined;
  reinsuranceFacCodes!: ReinsuranceLookup[];
  policyInfo!: PolicyInformation;
  
  @Input() reinsuranceLayer!: ReinsuranceLayerData;
  @Input() index!: number;

  constructor(private route: ActivatedRoute, private reinsuranceLookupService: ReinsuranceLookupService) { }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.policyInfo = data['policyInfoData'].policyInfo;
      this.populateReinsuranceCodes();
      this.populateReinsuranceFacCodes();
    });
    var test = this.reinsuranceLayer.reinsCededPremium;
  }

  populateReinsuranceCodes(): void {
    this.reinsuranceSub = this.reinsuranceLookupService.getReinsurance(this.policyInfo.programId, this.policyInfo.policyEffectiveDate).subscribe({
      next: reisuranceCodes => {
        this.reisuranceCodes = reisuranceCodes;
        this.reinsuranceCodes$ = of(reisuranceCodes);
      }
    });
  }

  populateReinsuranceFacCodes(): void {
    this.reinsuranceSub = this.reinsuranceLookupService.getFaculativeReinsurance(this.policyInfo.policyEffectiveDate).subscribe({
      next: reisuranceCodes => {
        this.reinsuranceFacCodes = reisuranceCodes;
        this.reinsuranceFacCodes$ = of(reisuranceCodes);
      }
    });
  }

  changeFaculative(): void {
    this.reinsuranceLayer.treatyNo = null;
    this.reinsuranceLayer.reinsCertificateNo = null;
  }

  changeReinsurerCode(): void {
    let match!: ReinsuranceLookup | undefined;

    if (this.reinsuranceLayer.isFaculative) {
      match = (this.reinsuranceFacCodes.find(c => c.treatyNumber == this.reinsuranceLayer.treatyNo));
    }
    else {
      match = (this.reisuranceCodes.find(c => c.treatyNumber == this.reinsuranceLayer.treatyNo));
    }
    if (match != null) {
      this.reinsuranceLayer.reinsCededCommRate = match.cededCommissionRate;
    }
  }

  dropDownSearchReinsurance(code: string, item: ReinsuranceLookup) {
    code = code.toLowerCase();
    return item.treatyNumber.toString().toLowerCase().indexOf(code) > -1 || item.treatyName.toString().toLowerCase().indexOf(code) > -1;
  }
}