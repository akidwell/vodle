import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { Code } from 'src/app/drop-downs/code';
import { DropDownsService } from 'src/app/drop-downs/drop-downs.service';
import { NotificationService } from 'src/app/notification/notification-service';
import { AdditionalNamedInsureds } from '../../policy';
import { PolicyService } from '../../policy.service';

@Component({
  selector: 'rsps-additional-named-insureds',
  templateUrl: './additional-named-insureds.component.html',
  styleUrls: ['./additional-named-insureds.component.css']
})
export class AdditionalNamedInsuredsComponent implements OnInit {
  authSub: Subscription;
  canEditPolicy: boolean = false;
  aniRoles$: Observable<Code[]> | undefined;
  collapsed: boolean = true;

  @Input() aniData!: AdditionalNamedInsureds;
  @Input() ani!: AdditionalNamedInsureds;

  aniCollapsed = false;
  isReadOnly: boolean = true;

  @ViewChild(NgForm, { static: false }) aniForm!: NgForm;
  @ViewChild(AdditionalNamedInsuredsComponent) aniComp!: AdditionalNamedInsuredsComponent;
  @Output() copyExistingAni: EventEmitter<AdditionalNamedInsureds> = new EventEmitter();
  @Output() deleteExistingAni: EventEmitter<AdditionalNamedInsureds> = new EventEmitter();



  constructor(private route: ActivatedRoute, private dropdowns: DropDownsService, private userAuth: UserAuth, private notification: NotificationService,  private policyService: PolicyService) {
    // GAM - TEMP -Subscribe
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {    
    this.aniRoles$ = this.dropdowns.getAdditonalNamedInsuredsRoles();
  } 

  dropDownSearch(term: string, item: Code) {
    term = term.toLowerCase();
    return item.code?.toLowerCase().indexOf(term) > -1 || item.key?.toString().toLowerCase().indexOf(term) > -1 || item.description?.toLowerCase().indexOf(term) > -1;
  }


  async save(): Promise<void> {
  }

  copyAni(): void {
    this.copyExistingAni.emit(this.aniData);
  }

  deleteAni(): void{
    this.deleteExistingAni.emit(this.aniData);
  }
  

}
