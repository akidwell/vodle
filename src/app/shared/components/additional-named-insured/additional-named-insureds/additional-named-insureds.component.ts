import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { Code } from 'src/app/core/models/code';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { PolicyService } from 'src/app/features/policy/services/policy/policy.service';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog/confirmation-dialog.service';
import { AdditionalNamedInsured } from '../additional-named-insured';

@Component({
  selector: 'rsps-shared-additional-named-insureds',
  templateUrl: './additional-named-insureds.component.html',
  styleUrls: ['./additional-named-insureds.component.css']
})
export class SharedAdditionalNamedInsuredsComponent implements OnInit {
  authSub: Subscription;
  canEditPolicy: boolean = false;
  aniRoles$: Observable<Code[]> | undefined;
  collapsed: boolean = true;
  deleteSub!: Subscription;
  addSub!: Subscription;
  updateSub!: Subscription;
  saveSub!: Subscription;
  aniCollapsed = false;
  isReadOnly: boolean = true;
  // ani!: AdditionalNamedInsured[];
  nameRoleArray: string[] = new Array;
  nameRoleDuplicates: string[] = new Array;
  isNameRoleValid: boolean = true;
  canEditEndorsement: boolean = false;

  @Input() index!: number;
  @Input() aniData!: AdditionalNamedInsured;
  @Input() ani!: AdditionalNamedInsured[];
  @ViewChild(NgForm, { static: false }) aniForm!: NgForm;
  @Output() copyExistingAni: EventEmitter<AdditionalNamedInsured> = new EventEmitter();
  @Output() deleteExistingAni: EventEmitter<AdditionalNamedInsured> = new EventEmitter();

  constructor(private route: ActivatedRoute, private dropdowns: DropDownsService, private userAuth: UserAuth, private policyService: PolicyService, private confirmationDialogService: ConfirmationDialogService) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {
    // this.route.parent?.data.subscribe(data => {
    //   this.ani = data['aniData'].additionalNamedInsureds;
    // });
    this.aniRoles$ = this.dropdowns.getAdditonalNamedInsuredsRoles();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.aniData.isNew) {
        this.aniForm.form.markAsDirty();
      }
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    this.deleteSub?.unsubscribe();
    this.updateSub?.unsubscribe();
    this.addSub?.unsubscribe();
  }
  
  copyAni(): void {
    this.copyExistingAni.emit(this.aniData);
  }

  openDeleteConfirmation() {
    this.confirmationDialogService.open("Delete Confirmation","Are you sure you want to delete this Additional Named Insured?").then((result: boolean) => {
        if (result) {
          this.deleteAni();
        }
      });
  }

  async deleteAni() {
    if (this.aniData.isNew) {
      this.deleteExistingAni.emit(this.aniData);
    } else {
      this.aniData.delete();
      // this.deleteSub = this.policyService.deleteAdditionalNamedInsureds(this.aniData).subscribe(result => {
      //   this.deleteExistingAni.emit(this.aniData);
      //   return result;
      // });
    }
  }

  async save(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.aniData.isNew) {
        console.log("SAVE");
        this.aniData.save();
        // this.addSub = this.policyService.addAdditionalNamedInsureds(this.aniData).subscribe(result => {
        //   resolve(result);
        //   this.aniForm.form.markAsPristine();
        //   this.aniForm.form.markAsUntouched();
        //   this.aniData.isNew = false;
        // });
      } else {
        console.log("SAVE");
        this.aniData.save();
        // this.updateSub = this.policyService.updateAdditionalNamedInsureds(this.aniData).subscribe(result => {
        //   this.aniForm.form.markAsPristine();
        //   this.aniForm.form.markAsUntouched();
        //   this.aniData.isNew = false;
        //   resolve(result);
        // });
      }
    })
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
