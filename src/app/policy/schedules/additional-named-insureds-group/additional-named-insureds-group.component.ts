import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { AdditionalNamedInsureds, Endorsement, PolicyInformation } from '../../policy';
import { PolicyService } from '../../policy.service';
import { AdditionalNamedInsuredsComponent } from '../additional-named-insureds/additional-named-insureds.component';

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
  faPlus = faPlus;
  faMinus = faMinus;
  aniCollapsed = false;
  newAni!: AdditionalNamedInsureds;
  copyAni!: AdditionalNamedInsureds;
  deletedAni!: AdditionalNamedInsureds;
  endorsementNumber!: number;
  policyId!: number;
  aniSub!: Subscription;
 
  @Input()  public additionalNamedInsuredsGroup!: AdditionalNamedInsuredsGroupComponent;

  @Output() status: EventEmitter<any> = new EventEmitter();
  @ViewChild(AdditionalNamedInsuredsComponent) aniComp!: AdditionalNamedInsuredsComponent;
  @ViewChild(NgForm, { static: false }) aniForm!: NgForm;
  @Output() incrementSequence: EventEmitter<number> = new EventEmitter();
  @Input()  public currentSequence!: number;

  constructor(private route: ActivatedRoute, private userAuth: UserAuth,  private policyService: PolicyService) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {    
    this.route.parent?.data.subscribe(data => {
    this.aniData = data['aniData'].additionalNamedInsureds;
    this.endorsementNumber = Number(this.route.parent?.snapshot.paramMap.get('end') ?? 0);
    this.policyId = Number(this.route.parent?.snapshot.paramMap.get('id') ?? 0);
  });
  console.log(this.aniComp)
  }


  isValid(): boolean {
    console.log(this.aniComp.aniForm.status)
    if (this.aniComp != null) {
        if (this.aniComp.aniForm.status != 'VALID') {
          return false;
        }
      }
    
    return true;
  }
  
  isDirty() {
    if (this.aniComp != null) {
        if (this.aniComp.aniForm.dirty) {
          return true;
        }
      }
    return false;
  }

  hideInvalid(): void {
    this.showInvalid = false;
  }

  copyExistingAni(existingAni: AdditionalNamedInsureds){
    this.copyAni = JSON.parse(JSON.stringify(existingAni));
    this.copyAni.name = 'CopyOf ' + existingAni.name
    this.copyAni.sequenceNo = this.currentSequence;
    this.copyAni.createdDate = new Date();
    this.incrementSequence.emit(this.currentSequence + 1);
    console.log('new: ', this.copyAni, 'existing: ', existingAni, this.currentSequence)
    this.aniData.push(this.copyAni);
  }

  deleteExistingAni(existingAni: AdditionalNamedInsureds){
    this.deletedAni = existingAni;
    this.aniData.forEach((value,index)=>{
        if(value.sequenceNo==existingAni.sequenceNo) this.aniData.splice(index,1);
        console.log(existingAni)
    });
    console.log(this.aniData)
  }

  addNewAdditionalNamedInsured(): void {
    this.newAni = this.createNewAni();
    this.incrementSequence.emit(this.currentSequence + 1);
    this.aniData.push(this.newAni);
    console.log(this.aniData)
   }

   createNewAni(): AdditionalNamedInsureds {
    return {
 name: "",
 role: 1,
 createdBy: 0,
 policyId: this.policyId,
 sequenceNo: this.currentSequence, 
 endorsementNo: this.endorsementNumber,
 modifiedBy: 0,
 createdDate: new Date()
    }
  }

  saveAdditionalNamedInsureds(): any {
    console.log(this.isDirty)
    this.aniData.forEach((ani)=>{
      this.aniSub = this.policyService.updateAdditionalNamedInsureds(ani).subscribe(() => {
        console.log(ani + "in update")
      });
  });
    if (this.newAni != null) {
    this.aniSub = this.policyService.addAdditionalNamedInsureds(this.newAni).subscribe(() => {
    });
    }
    if (this.copyAni != null) {
    this.aniSub = this.policyService.addAdditionalNamedInsureds(this.copyAni).subscribe(() => {
    });
    }
    if (this.deletedAni != null) {
    this.aniSub = this.policyService.deleteAdditionalNamedInsureds(this.deletedAni.policyId, this.deletedAni.endorsementNo, this.deletedAni.sequenceNo).subscribe(() => {
    });
    }
  }
}
