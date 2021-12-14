import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { PolicyInformation, PolicyLayerData, ReinsuranceLayerData } from 'src/app/policy/policy';
import { ReinsuranceLookup } from '../../reinsurance-lookup/reinsurance-lookup';
import { ReinsuranceLookupService } from '../../reinsurance-lookup/reinsurance-lookup.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PolicyService } from 'src/app/policy/policy.service';
import { NgForm } from '@angular/forms';
import { UserAuth } from 'src/app/authorization/user-auth';


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
  reinsuranceCodes!: ReinsuranceLookup[];
  reinsuranceFacCodes$: Observable<ReinsuranceLookup[]> | undefined;
  reinsuranceFacCodes!: ReinsuranceLookup[];
  policyInfo!: PolicyInformation;
  deleteSub!: Subscription;
  policyLayer!: PolicyLayerData[];
  updateSub!: Subscription;
  dirtySub!: Subscription | undefined;
  isDirty: boolean = false;
  treatyNo!: number;
  commRate!: number;
  canEditPolicy: boolean = false;
  authSub: Subscription;

  @Input() policyLayerData!: PolicyLayerData;
  @ViewChild('modalConfirmation') modalConfirmation: any;
  @Output() deleteExistingReinsuranceLayer: EventEmitter<ReinsuranceLayerData> = new EventEmitter();
  @Output() deleteExistingPolicyLayer: EventEmitter<PolicyLayerData> = new EventEmitter();

  @ViewChild(NgForm, { static: false }) reinsuranceForm!: NgForm;

  @Input() reinsuranceLayer!: ReinsuranceLayerData;
  @Input() index!: number;

  constructor(private route: ActivatedRoute, private reinsuranceLookupService: ReinsuranceLookupService, private policyService: PolicyService, private modalService: NgbModal, private userAuth: UserAuth,) { 
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.policyInfo = data['policyInfoData'].policyInfo;
      this.policyLayer = data['policyLayerData'].policyLayer;
      this.populateReinsuranceCodes();
      this.populateReinsuranceFacCodes();
    });
    var test = this.reinsuranceLayer.reinsCededPremium;
  }

  ngAfterViewInit(): void {
    this.dirtySub = this.reinsuranceForm.statusChanges?.subscribe(() => {
      this.isDirty = this.reinsuranceForm.form.dirty ?? false;
    });
  }

  ngOnDestroy(): void {
    this.dirtySub?.unsubscribe();
    this.deleteSub?.unsubscribe();
    this.updateSub?.unsubscribe();
    this.reinsuranceSub?.unsubscribe();
  }

  populateReinsuranceCodes(): void {
    this.reinsuranceSub = this.reinsuranceLookupService.getReinsurance(this.policyInfo.programId, this.policyInfo.policyEffectiveDate).subscribe({
      next: reisuranceCodes => {
        this.reinsuranceCodes = reisuranceCodes;
        this.reinsuranceCodes$ = of(reisuranceCodes);
        this.treatyNo = this.reinsuranceCodes[0].treatyNumber
        this.commRate = this.reinsuranceCodes[0].cededCommissionRate
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

  async save(policyLayerData: PolicyLayerData[]): Promise<boolean> {
    return new Promise((resolve) => {

      this.updateSub = this.policyService.putPolicyAndReinsuranceLayers(policyLayerData).subscribe(result => {

        resolve(result);
      });

    })
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
      match = (this.reinsuranceCodes.find(c => c.treatyNumber == this.reinsuranceLayer.treatyNo));
    }
    if (match != null) {
      this.reinsuranceLayer.reinsCededCommRate = match.cededCommissionRate;
    }
  }

  dropDownSearchReinsurance(code: string, item: ReinsuranceLookup) {
    code = code.toLowerCase();
    return item.treatyNumber.toString().toLowerCase().indexOf(code) > -1 || item.treatyName.toString().toLowerCase().indexOf(code) > -1;
  }

  openDeleteConfirmation() {
    this.modalService.open(this.modalConfirmation, { backdrop: 'static', centered: true }).result.then((result) => {
      if (result == 'Yes') {
        this.deleteReinsuranceLayer();
      }
    });
  }
  async deleteReinsuranceLayer() {
    console.log(this.policyLayerData)
    if (this.reinsuranceLayer.isNew) {
      this.deleteExistingReinsuranceLayer.emit(this.reinsuranceLayer);
    } else if (this.index !== 0 || (this.index == 0 && this.policyLayerData.reinsuranceData.length > 1)) {
      this.save(this.policyLayer).then(() => this.deleteSub = this.policyService.deleteReinsuranceLayers(this.reinsuranceLayer).subscribe(result => {
        this.deleteExistingReinsuranceLayer.emit(this.reinsuranceLayer);
        return result;
      }));
      ;
    } else if (this.index == 0 && this.policyLayerData.reinsuranceData.length == 1) {
      this.save(this.policyLayer).then(() => this.deleteSub = this.policyService.deletePolicyAndReinsuranceLayers(this.reinsuranceLayer).subscribe(result => {
        this.deleteExistingReinsuranceLayer.emit(this.reinsuranceLayer);
        this.deleteExistingPolicyLayer.emit(this.policyLayerData)
        return result;
      }));
      this.save(this.policyLayer)
    }
  }

}