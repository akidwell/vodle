import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom, Observable, of, Subscription } from 'rxjs';
import { Endorsement, PolicyInformation, PolicyLayerData, ReinsuranceLayerData } from 'src/app/policy/policy';
import { ReinsuranceLookup } from '../../reinsurance-lookup/reinsurance-lookup';
import { ReinsuranceLookupService } from '../../reinsurance-lookup/reinsurance-lookup.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PolicyService } from 'src/app/policy/policy.service';
import { NgForm } from '@angular/forms';
import { UserAuth } from 'src/app/authorization/user-auth';
import { EndorsementStatusService } from 'src/app/policy/services/endorsement-status.service';
import { ErrorDialogService } from 'src/app/error-handling/error-dialog-service/error-dialog-service';


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
  isDirty: boolean = false;
  treatyNo!: number;
  commRate!: number;
  canEditPolicy: boolean = false;
  authSub: Subscription;
  endorsement!: Endorsement;
  statusSub!: Subscription;
  canEditEndorsement: boolean = false;
  reinsuranceRefreshedSub!: Subscription;

  @Input() policyLayerData!: PolicyLayerData;
  @Input() reinsuranceLayer!: ReinsuranceLayerData;
  @Input() index!: number;
  @ViewChild('modalConfirmation') modalConfirmation: any;
  @Output() deleteExistingReinsuranceLayer: EventEmitter<ReinsuranceLayerData> = new EventEmitter();
  @Output() deleteExistingPolicyLayer: EventEmitter<PolicyLayerData> = new EventEmitter();
  @ViewChild(NgForm, { static: false }) reinsuranceForm!: NgForm;

  constructor(private route: ActivatedRoute, private reinsuranceLookupService: ReinsuranceLookupService, private policyService: PolicyService, private modalService: NgbModal, private userAuth: UserAuth, private endorsementStatusService: EndorsementStatusService, private errorDialogService: ErrorDialogService) { 
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {
    this.statusSub = this.endorsementStatusService.canEditEndorsement.subscribe({
      next: canEdit => {
        this.canEditEndorsement = canEdit;
      }
    });
    this.route.parent?.data.subscribe(async data => {
      this.policyInfo = data['policyInfoData'].policyInfo;
      this.policyLayer = data['policyLayerData'].policyLayer;
      this.endorsement = data['endorsementData'].endorsement;
      await this.populateReinsuranceCodes();
      this.populateReinsuranceFacCodes();
    });

    this.reinsuranceRefreshedSub = this.reinsuranceLookupService.refreshed$.subscribe(async () => {
      await this.populateReinsuranceCodes();
      await this.populateReinsuranceFacCodes();
      this.reinsuranceForm.form.markAsDirty();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.reinsuranceLayer.isNew && this.canEditPolicy) {
        this.reinsuranceForm.form.markAsDirty();
      }
    });
  }

  ngOnDestroy(): void {
    this.deleteSub?.unsubscribe();
    this.updateSub?.unsubscribe();
    this.reinsuranceSub?.unsubscribe();
    this.statusSub?.unsubscribe();
    this.reinsuranceRefreshedSub?.unsubscribe();
  }

  get canEdit(): boolean {
    return this.canEditEndorsement && this.canEditPolicy
  }

  async populateReinsuranceCodes(): Promise<void> {
    const results$ = this.reinsuranceLookupService.getReinsurance(this.policyInfo.programId, this.policyInfo.policyEffectiveDate);
    await lastValueFrom(results$).then(
      reisuranceCodes => {
        this.reinsuranceCodes = reisuranceCodes;
        this.reinsuranceCodes$ = of(reisuranceCodes);
      }
    );
  }

  async populateReinsuranceFacCodes(): Promise<void> {
    this.reinsuranceSub = this.reinsuranceLookupService.getFaculativeReinsurance(this.policyInfo.policyEffectiveDate).subscribe({
      next: reisuranceCodes => {
        this.reinsuranceFacCodes = reisuranceCodes;
        this.reinsuranceFacCodes$ = of(reisuranceCodes);
      }
    });
  }

  async save(policyLayerData: PolicyLayerData[]): Promise<boolean> {
    const results$ = this.policyService.putPolicyAndReinsuranceLayers(policyLayerData);
    return await lastValueFrom(results$)
      .then(x => {
        return true;
      }).catch((error) => {
        this.errorDialogService.open("Reinsurance Save Error!", error.error.Message)
        this.endorsementStatusService.reinsuranceValidated = false;
        return false;
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