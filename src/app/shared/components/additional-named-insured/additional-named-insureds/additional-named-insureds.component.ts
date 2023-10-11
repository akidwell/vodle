import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Code } from 'src/app/core/models/code';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog/confirmation-dialog.service';
import { AdditionalNamedInsured } from '../additional-named-insured';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { faArrows } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'rsps-shared-additional-named-insureds',
  templateUrl: './additional-named-insureds.component.html',
  styleUrls: ['./additional-named-insureds.component.css']
})
export class SharedAdditionalNamedInsuredsComponent implements OnInit {
  aniRoles$: Observable<Code[]> | undefined;
  collapsed = true;
  deleteSub!: Subscription;
  addSub!: Subscription;
  updateSub!: Subscription;
  saveSub!: Subscription;
  aniCollapsed = false;
  nameRoleArray: string[] = [];
  nameRoleDuplicates: string[] = [];
  isNameRoleValid = true;
  faArrowsV = faArrows;

  @Input() index!: number;
  @Input() aniData!: AdditionalNamedInsured;
  @Input() ani!: AdditionalNamedInsured[];
  @Input() public canEdit = false;
  @Input() canDrag = false;
  @Output() copyExistingAni: EventEmitter<AdditionalNamedInsured> = new EventEmitter();
  @Output() deleteExistingAni: EventEmitter<AdditionalNamedInsured> = new EventEmitter();

  constructor(private dropdowns: DropDownsService, private router: Router, private confirmationDialogService: ConfirmationDialogService, private messageDialogService: MessageDialogService) {
  }

  ngOnInit(): void {
    this.aniRoles$ = this.dropdowns.getAdditonalNamedInsuredsRoles();
  }


  ngOnDestroy(): void {
    this.deleteSub?.unsubscribe();
    this.updateSub?.unsubscribe();
    this.addSub?.unsubscribe();
  }

  copyAni(): void {
    this.copyExistingAni.emit(this.aniData);
  }

  openDeleteConfirmation() {
    this.confirmationDialogService.open('Delete Confirmation', 'Are you sure you want to delete this Additional Named Insured?').then((result: boolean) => {
      if (result) {
        this.deleteAni();
      }
    });
  }

  async deleteAni() {
    console.log(this.router.url);
    if (this.aniData.isNew) {
      setTimeout(() => {
        this.deleteExistingAni.emit(this.aniData);
      });
    } else if(this.router.url.includes('policy-v2')){
      this.aniData.markForDeletion = true;
    }else {
      await this.aniData.delete().then(() => {
        setTimeout(() => {
          this.deleteExistingAni.emit(this.aniData);
        });
      });
    }
  }

  async save(): Promise<boolean> {
    if (this.aniData.isNew) {
      return await this.aniData.save()
        .then(() => {
          return true;
        })
        .catch(error => {
          this.messageDialogService.open('Add error', error.error.Message ?? error.message);
          return false;
        }
        );
    } else {
      return await this.aniData.save()
        .then(() => {
          return true;
        })
        .catch(error => {
          this.messageDialogService.open('Update error', error.error.Message ?? error.message);
          return false;
        }
        );
    }
  }

  // checkDuplicateNameRoleCombo(): void {
  //   if (this.aniForm.controls['role'].errors?.duplicate == true || this.aniForm.controls['name'].errors?.duplicate == true || this.aniForm.controls['name'].value == '') {
  //     this.aniForm.controls['name'].setErrors(null);
  //     this.aniForm.controls['role'].setErrors(null);
  //   }
  //   this.nameRoleArray = this.ani.map(a => (a.role ?? '') + (a.name ?? ''));
  //   this.nameRoleDuplicates = this.nameRoleArray.filter((item, index) => this.nameRoleArray.indexOf(item) != index);
  //   if (this.nameRoleDuplicates.length == 0 && this.aniForm.controls['name'].value != '') {
  //     this.isNameRoleValid = true;
  //     this.nameRoleArray = [];
  //   } else if (this.nameRoleDuplicates.length != 0) {
  //     this.isNameRoleValid = false;
  //     this.nameRoleArray = [];
  //     this.nameRoleDuplicates = [];
  //     this.aniForm.controls['name'].setErrors({ 'duplicate': true });
  //     this.aniForm.controls['role'].setErrors({ 'duplicate': true });
  //   } else if (this.aniForm.controls['name'].value == '') {
  //     this.isNameRoleValid = true;
  //     this.aniForm.controls['name'].setErrors({ nullName: true });
  //   }
  // }
}
