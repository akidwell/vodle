import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { AdditionalNamedInsureds, Endorsement, PolicyInformation } from '../../policy';
import { PolicyService } from '../../policy.service';
import { AdditionalNamedInsuredsComponent } from './additional-named-insureds/additional-named-insureds.component';
import { NotificationService } from 'src/app/notification/notification-service';

@Component({
  selector: 'rsps-additional-named-insureds-group',
  templateUrl: './additional-named-insureds-group.component.html',
  styleUrls: ['./additional-named-insureds-group.component.css']
})
export class AdditionalNamedInsuredsGroupComponent implements OnInit {
  authSub: Subscription;
  canEditPolicy: boolean = false;
  invalidMessage: string = "";
  showInvalid: boolean = false;
  aniData!: AdditionalNamedInsureds[];
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  aniCollapsed = false;
  newAni!: AdditionalNamedInsureds;
  copyAni!: AdditionalNamedInsureds;
  deletedAni!: AdditionalNamedInsureds;
  endorsementNumber!: number;
  policyId!: number;
  aniSub!: Subscription;

  @ViewChild(AdditionalNamedInsuredsComponent) aniComp!: AdditionalNamedInsuredsComponent;
  @ViewChildren(AdditionalNamedInsuredsComponent) components: QueryList<AdditionalNamedInsuredsComponent> | undefined;

  constructor(private route: ActivatedRoute, private userAuth: UserAuth, private policyService: PolicyService, private notification: NotificationService) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.aniData = data['aniData'].additionalNamedInsureds;
      this.endorsementNumber = Number(this.route.parent?.snapshot.paramMap.get('end') ?? 0);
      this.policyId = Number(this.route.parent?.snapshot.paramMap.get('id') ?? 0);
      this.aniCollapsed = false;
    });
  }


  isValid(): boolean {
    if (this.components != null) {
      for (let child of this.components) {
        if (child.aniForm.status != 'VALID') {
          return false;
        }
      }
    }
    return true;
  }

  isDirty() {
    if (this.components != null) {
      for (let child of this.components) {
        if (child.aniForm.dirty) {
          return true;
        }
      }
    }
    return false;
  }
  hideInvalid(): void {
    this.showInvalid = false;
  }

  copyExistingAni(existingAni: AdditionalNamedInsureds) {
    this.copyAni = JSON.parse(JSON.stringify(existingAni));
    this.copyAni.name = 'CopyOf ' + existingAni.name
    this.copyAni.sequenceNo = this.getNextSequence();
    this.copyAni.createdDate = new Date();
    this.copyAni.isNew = true;
    this.aniData.push(this.copyAni);
  }

  deleteExistingAni(existingAni: AdditionalNamedInsureds) {
    const index = this.aniData.indexOf(existingAni, 0);
    if (index > -1) {
      this.aniData.splice(index, 1);
      this.notification.show('Additional Named Insureds deleted.', { classname: 'bg-success text-light', delay: 5000 });
    }
  }
  getNextSequence(): number {
    if (this.aniData.length == 0) {
      return 1;
    }
    else {
      return Math.max(...this.aniData.map(o => o.sequenceNo)) + 1;
    }
  }

  addNewAdditionalNamedInsured(): void {
    this.newAni = this.createNewAni();
    this.aniData.push(this.newAni);
  }

  createNewAni(): AdditionalNamedInsureds {
    return {
      name: "",
      role: undefined,
      createdBy: 0,
      policyId: this.policyId,
      sequenceNo: this.getNextSequence(),
      endorsementNo: this.endorsementNumber,
      modifiedBy: 0,
      createdDate: new Date(),
      isNew: true
    }
  }

  async saveAdditionalNamedInsureds(): Promise<boolean> {
    if (this.canEditPolicy && this.isDirty()) {
      let saveCount: number = 0;
      if (this.components != null) {
        for (let child of this.components) {
          if (child.aniForm.dirty) {         
            let result = await child.save();
            if (result === false) {
              this.notification.show('Additional Named Insureds ' + child.aniData.sequenceNo.toString() + ' not saved.', { classname: 'bg-danger text-light', delay: 5000 });
            }
            else {
              saveCount++;
            }
          }
        }
        if (saveCount > 0) {
          this.notification.show('Additional Named Insureds successfully saved.', { classname: 'bg-success text-light', delay: 5000 });
        }
      }
      if (!this.isValid()) {
        this.notification.show('Additional Named Insureds not saved.', { classname: 'bg-danger text-light', delay: 5000 });
        return false;
      }
    }
    return false;
  }

}
