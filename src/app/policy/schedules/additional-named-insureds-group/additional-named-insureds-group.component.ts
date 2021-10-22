import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { EndorsementHeaderComponent } from '../../coverages/endorsement-header/endorsement-header.component';
import { AdditionalNamedInsureds } from '../../policy';
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
 
  @Input()  public additionalNamedInsuredsGroup!: AdditionalNamedInsuredsGroupComponent;

  @Output() status: EventEmitter<any> = new EventEmitter();
  @ViewChild(AdditionalNamedInsuredsComponent) aniComp!: AdditionalNamedInsuredsComponent;
  @ViewChild(NgForm, { static: false }) aniForm!: NgForm;
  @Output() incrementSequence: EventEmitter<number> = new EventEmitter();
  @Input()  public currentSequence!: number;

  constructor(private route: ActivatedRoute, private userAuth: UserAuth) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {    
    this.route.parent?.data.subscribe(data => {
    this.aniData = data['aniData'].additionalNamedInsureds;
  });
  console.log(this.aniComp)
  }


  isValid(): boolean {
    console.log(this.aniComp.aniForm.status)
    if (this.aniComp != null) {
        if (this.aniForm.status != 'VALID') {
          return false;
        }
      }
    
    return true;
  }

  isDirty() {
    if (this.aniComp != null) {
        if (this.aniForm.dirty) {
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
    this.copyAni.strName = 'CopyOf ' + existingAni.strName
    this.copyAni.intSequenceNo = this.currentSequence;
    this.copyAni.dtmCreatedDate = new Date();
    this.incrementSequence.emit(this.currentSequence + 1);
    console.log('new: ', this.copyAni, 'existing: ', existingAni, this.currentSequence)
    this.aniData.push(this.copyAni);
    //figure out how to get userid for createdby
  }

  deleteExistingAni(existingAni: AdditionalNamedInsureds){
    // this.deletedAni.intSequenceNo= existingAni.intSequenceNo;
    // this.deletedAni.srtEndorsementNo= existingAni.srtEndorsementNo;
    // this.deletedAni.intPolicyId= existingAni.intPolicyId;
    this.deletedAni = existingAni;
    this.aniData.forEach((value,index)=>{
        if(value.intSequenceNo==existingAni.intSequenceNo) this.aniData.splice(index,1);
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
 strName: "",
 intRole: 1,
 intCreatedBy: 0,
 intPolicyId: this.aniData[0].intPolicyId,
 intSequenceNo: this.currentSequence, 
 srtEndorsementNo: this.aniData[0].srtEndorsementNo,
 intModifiedBy: 0,
 dtmCreatedDate: new Date()
//figure out how to get userid for createdby
    }



  }
}
