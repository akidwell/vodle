import { DatePipe } from '@angular/common';
import { Component, ComponentFactoryResolver, EventEmitter, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { DropDownsService } from 'src/app/drop-downs/drop-downs.service';
import { NotificationService } from 'src/app/notification/notification-service';
import { EndorsementCoverageDirective } from '../coverages/endorsement-coverage-location-group/endorsement-coverage/endorsement-coverage.directive';
import { newReinsuranceLayer, PolicyLayerData, ReinsuranceLayerData } from '../policy';
import { PolicyService } from '../policy.service';
import { PolicyLayerGroupComponent } from './policy-layer-group/policy-layer-group.component';
import { ReinsuranceLayerComponent } from './policy-layer-group/reinsurance-layer/reinsurance-layer.component';

@Component({
  selector: 'rsps-reinsurance',
  templateUrl: './reinsurance.component.html',
  styleUrls: ['./reinsurance.component.css']
})
export class ReinsuranceComponent implements OnInit {

  policyLayerData!: PolicyLayerData[];
  canEditPolicy: boolean = false;
  authSub: Subscription;
  canEditTransactionType: boolean = false;
  updateSub!: Subscription;
  policyLayer!: PolicyLayerData[];
  components: PolicyLayerGroupComponent[] = [];
  endorsementNumber!: number;
  policyId!: number;
  newPolicyLayer!: PolicyLayerData;
  newReinsurance!: ReinsuranceLayerData;
  showInvalid: boolean = false;
  invalidMessage: string = "";



  @Output() addNewPolicyLayers: EventEmitter<string> = new EventEmitter();
  @ViewChild(PolicyLayerGroupComponent) policyLayerGroup!: PolicyLayerGroupComponent;
  @ViewChild(ReinsuranceLayerComponent) reinsLayerComp!: ReinsuranceLayerComponent;


  constructor(private route: ActivatedRoute, private userAuth: UserAuth, private dropdowns: DropDownsService, private policyService: PolicyService, public viewContainerRef: ViewContainerRef, private componentFactoryResolver: ComponentFactoryResolver) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.policyLayerData = data['policyLayerData'].policyLayer;
      console.log(this.policyLayerData)
      this.canEditTransactionType = Number(this.route.snapshot.paramMap.get('end') ?? 0) > 0;
      this.endorsementNumber = Number(this.route.parent?.snapshot.paramMap.get('end') ?? 0);
      this.policyId = Number(this.route.parent?.snapshot.paramMap.get('id') ?? 0);
    });
  }

  @ViewChild(EndorsementCoverageDirective) endorsementCoverageDirective!: EndorsementCoverageDirective;


  async addPolicyLayer() {
    if (this.policyLayerData.length > 0) {
      this.addNewPolicyLayers.emit();
      this.policyLayerGroup.addNewPolicyLayer()
    }
    else {
      this.addNewPolicyLayer();
    }
  }

  addNewPolicyLayer(): void {
    this.newPolicyLayer = this.createNewPolicyLayer();
    this.newReinsurance = newReinsuranceLayer(this.policyId, this.endorsementNumber, 1, 1);
    console.log(this.reinsLayerComp)

    // this.reinsComp.reinsuranceForm.form.markAsDirty();
    this.newPolicyLayer.reinsuranceData.push(this.newReinsurance)
    this.policyLayerData.push(this.newPolicyLayer);
    // this.reinsComp.reinsuranceForm.form.markAsDirty();

  }

  createNewPolicyLayer(): PolicyLayerData {
    return {
      policyId: this.policyId,
      endorsementNo: this.endorsementNumber,
      policyLayerNo: 1,
      policyLayerAttachmentPoint: undefined,
      policyLayerLimit: undefined,
      policyLayerPremium: undefined,
      invoiceNo: null,
      copyEndorsementNo: null,
      endType: null,
      transCode: null,
      transEffectiveDate: null,
      transExpirationDate: null,
      reinsuranceData: [],
      isNew: true
    }
  }

  save(): void {
    this.policyLayerGroup.savePolicyLayers();
  }

  isValid(): boolean {
    return this.policyLayerGroup.isValid();
  }

  isDirty(): boolean {
    return this.policyLayerGroup.isDirty();
  }

  showInvalidControls(): void {
    let invalid = [];

    // Loop through each child component to see it any of them have invalid controls
    if (this.policyLayerGroup.components != null) {
      for (let child of this.policyLayerGroup.components) {
        for (let name in child.reinsuranceForm.controls) {
          if (child.reinsuranceForm.controls[name].invalid) {
            invalid.push(name + " - Policy Layer: # " + child.reinsuranceLayer.policyLayerNo + " is Invalid");
          }
        }
      }
    }

    // Compile all invalide controls in a list
    if (invalid.length > 0) {
      this.showInvalid = true;
      for (let error of invalid) {
        this.invalidMessage += "<br><li>" + error;
      }
    }

    if (this.showInvalid) {
      this.invalidMessage = "Following fields are invalid" + this.invalidMessage;
    }
    else {
      this.hideInvalid();
    }
  }

  hideInvalid(): void {
    this.showInvalid = false;
  }
}