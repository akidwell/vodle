import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { Code } from 'src/app/drop-downs/code';
import { DropDownsService } from 'src/app/drop-downs/drop-downs.service';
import { NotificationService } from 'src/app/notification/notification-service';
import { AdditionalNamedInsureds } from '../../../policy';
import { PolicyService } from '../../../policy.service';

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
  isDirty: boolean = false;
  dirtySub!: Subscription | undefined;
  deleteSub!: Subscription;
  addSub!: Subscription;
  updateSub!: Subscription;
  saveSub!: Subscription;
  aniCollapsed = false;
  isReadOnly: boolean = true;
  ani!: AdditionalNamedInsureds[];
  nameRoleArray: string[] = new Array;
  nameRoleDuplicates: string[] = new Array;
  isNameRoleValid: boolean = true;

  @Input() index!: number;
  @Input() aniData!: AdditionalNamedInsureds;
  @ViewChild(NgForm, { static: false }) aniForm!: NgForm;
  @Output() copyExistingAni: EventEmitter<AdditionalNamedInsureds> = new EventEmitter();
  @Output() deleteExistingAni: EventEmitter<AdditionalNamedInsureds> = new EventEmitter();
  @ViewChild('modalConfirmation') modalConfirmation: any;

  constructor(private route: ActivatedRoute, private dropdowns: DropDownsService, private userAuth: UserAuth, private notification: NotificationService, private policyService: PolicyService, private modalService: NgbModal) {
    // GAM - TEMP -Subscribe
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.ani = data['aniData'].additionalNamedInsureds;
    });
    this.aniRoles$ = this.dropdowns.getAdditonalNamedInsuredsRoles();
  }

  ngAfterViewInit(): void {
    this.dirtySub = this.aniForm.statusChanges?.subscribe(() => {
      this.isDirty = this.aniForm.dirty ?? false;
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    this.dirtySub?.unsubscribe();
    this.deleteSub?.unsubscribe();
    this.updateSub?.unsubscribe();
    this.addSub?.unsubscribe();
  }

  copyAni(): void {
    this.copyExistingAni.emit(this.aniData);
    this.aniForm.form.markAsDirty();
  }

  openDeleteConfirmation() {
    this.modalService.open(this.modalConfirmation, { backdrop: 'static', centered: true }).result.then((result) => {
      if (result == 'Yes') {
        this.deleteAni();
      }
    });
  }

  async deleteAni() {
    if (this.aniData.isNew) {
      this.deleteExistingAni.emit(this.aniData);
    } else {
      this.deleteSub = this.policyService.deleteAdditionalNamedInsureds(this.aniData).subscribe(result => {
        this.deleteExistingAni.emit(this.aniData);
        return result;
      });
    }
  }


  async save(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.aniData.isNew) {
        this.addSub = this.policyService.addAdditionalNamedInsureds(this.aniData).subscribe(result => {
          resolve(result);
          this.aniForm.form.markAsPristine();
          this.aniForm.form.markAsUntouched();
          this.aniData.isNew = false;
        });
      } else {
        this.updateSub = this.policyService.updateAdditionalNamedInsureds(this.aniData).subscribe(result => {
          this.aniForm.form.markAsPristine();
          this.aniForm.form.markAsUntouched();
          this.aniData.isNew = false;
         // return result;
          resolve(result);
        });
      }
    })
    // return false;
  }

  checkDuplicateNameRoleCombo(): void {

    if (this.aniForm.controls['role'].errors?.duplicate == true || this.aniForm.controls['name'].errors?.duplicate == true || this.aniForm.controls['name'].value == '') {
      this.aniForm.controls['name'].setErrors(null);
      this.aniForm.controls['role'].setErrors(null);
    }
    this.nameRoleArray = this.ani.map(a => a.role + a.name);
    this.nameRoleDuplicates = this.nameRoleArray.filter((item, index) => this.nameRoleArray.indexOf(item) != index);
    if (this.nameRoleDuplicates.length == 0 && this.aniForm.controls['name'].value != '') {
      this.isNameRoleValid = true;
      this.nameRoleArray = [];
    } else if (this.nameRoleDuplicates.length != 0) {
      this.isNameRoleValid = false;
      this.nameRoleArray = [];
      this.nameRoleDuplicates = [];
      this.aniForm.controls['name'].setErrors({ 'duplicate': true });
      this.aniForm.controls['role'].setErrors({ 'duplicate': true });
    } else if (this.aniForm.controls['name'].value == '') {
      this.isNameRoleValid = true;
      this.aniForm.controls['name'].setErrors({ nullName: true });
    }
  }
}
