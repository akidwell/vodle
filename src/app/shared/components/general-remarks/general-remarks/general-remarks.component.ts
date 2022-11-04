import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { lastValueFrom, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog/confirmation-dialog.service';
import { HeaderPaddingService } from 'src/app/core/services/header-padding-service/header-padding.service';
import { QuoteClass } from 'src/app/features/quote/classes/quote-class';
import { QuoteSavingService } from 'src/app/features/quote/services/quote-saving-service/quote-saving-service.service';
import { QuoteService } from 'src/app/features/quote/services/quote-service/quote.service';
import { GeneralRemarksClass } from 'src/app/shared/classes/general-remarks-class';
import { SharedComponentBase } from 'src/app/shared/component-base/shared-component-base';

@Component({
  selector: 'rsps-general-remarks',
  templateUrl: './general-remarks.component.html',
  styleUrls: ['./general-remarks.component.css']
})
export class GeneralRemarksComponent extends SharedComponentBase implements OnInit {

  collapsed = true;
  allRemarksCount = 0;

  isSaving = false;
  saveSub!: Subscription;

  confirmation = '';
  faAngleDown = faAngleDown;
  firstExpand = true;
  faArrowUp = faAngleUp;
  anchorId!: string;

  private _generalRemarks!: GeneralRemarksClass[];

  @Input() set generalRemarks(value: GeneralRemarksClass[]) {
    this._generalRemarks = value;
    this.refreshRemarks();
  }
  get generalRemarks(): GeneralRemarksClass[] {
    return this._generalRemarks;
  }

  private modalRef!: NgbModalRef;
  @Output() copyExisitingRemark: EventEmitter<GeneralRemarksClass> = new EventEmitter();
  @Output() deleteExistingRemark: EventEmitter<GeneralRemarksClass> = new EventEmitter();

  @Input() generalRemarkData!: GeneralRemarksClass;
  @Input() remarks!: GeneralRemarksClass[] ;
  @Input() quote!: QuoteClass;


  constructor(
    userAuth: UserAuth,
    public headerPaddingService: HeaderPaddingService,
    private quoteSavingService: QuoteSavingService,
    private confirmationDialogService: ConfirmationDialogService,
    private quoteService: QuoteService
  ) {
    super(userAuth);
  }

  ngOnInit(): void {
    this.saveSub = this.quoteSavingService.isSaving$.subscribe(
      (isSaving) => (this.isSaving = isSaving)
    );
    this.handleSecurity(this.type);
    console.log(this.canEdit);

  }

  ngOnDestroy() {
    this.saveSub?.unsubscribe();
  }

  openDeleteConfirmation() {
    this.confirmation = 'overlay';
    this.confirmationDialogService.open('Delete General Remarks Confirmation','Are you sure you want to delete Remark?').then((result: boolean) => {
      this.confirmation = '';
      if (result) {
        this.delete();
      }
    });
  }

  async delete() {
    if (this.generalRemarkData.isNew) {
      setTimeout(() => {
        this.deleteExistingRemark.emit(this.generalRemarkData);
      });
    } else {
      const results$ = this.quoteService.deleteGeneralRemark(this.quote?.quoteId, this.generalRemarkData?.remarkId === null ? 0 : this.generalRemarkData.remarkId);
      return await lastValueFrom(results$).then(() => {
        this.deleteExistingRemark.emit(this.generalRemarkData);
      });
    }
  }

  copyRemark(): void {
    this.copyExisitingRemark.emit(this.generalRemarkData);
    console.log(this.copyExisitingRemark);
  }

  async cancel(): Promise<void> {
    this.modalRef.close('cancel');
  }

  collapseExpand(event: boolean) {
    if (this.firstExpand) {
      this.firstExpand = false;
    }
    this.collapsed = event;
  }

  focus(): void {
    this.collapsed = false;
    setTimeout(() => {
      document.getElementById(this.anchorId)?.scrollIntoView();
    }, 250);
  }

  refreshRemarks() {
    this.setRemarksCount();
  }


  setRemarksCount() {
    this.allRemarksCount = this.generalRemarks.length;

  }


}
