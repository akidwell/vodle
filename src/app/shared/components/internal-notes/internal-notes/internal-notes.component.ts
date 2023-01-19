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
import { InternalNotesClass } from 'src/app/shared/classes/internal-notes-class';
import { SharedComponentBase } from 'src/app/shared/component-base/shared-component-base';

@Component({
  selector: 'rsps-internal-notes',
  templateUrl: './internal-notes.component.html',
  styleUrls: ['./internal-notes.component.css']
})
export class InternalNotesComponent extends SharedComponentBase implements OnInit {

  collapsed = true;
  allNotesCount = 0;

  isSaving = false;
  saveSub!: Subscription;

  confirmation = '';
  faAngleDown = faAngleDown;
  firstExpand = true;
  faArrowUp = faAngleUp;
  anchorId!: string;

  private _internalNotes!: InternalNotesClass[];

  @Input() set internalNotes(value: InternalNotesClass[]) {
    this._internalNotes = value;
    this.refreshNotes();
  }
  get internalNotes(): InternalNotesClass[] {
    return this._internalNotes;
  }

  private modalRef!: NgbModalRef;
  @Output() copyExisitingNote: EventEmitter<InternalNotesClass> = new EventEmitter();
  @Output() deleteExistingNote: EventEmitter<InternalNotesClass> = new EventEmitter();

  @Input() internalNoteData!: InternalNotesClass;
  @Input() notes!: InternalNotesClass[] ;
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
  }

  ngOnDestroy() {
    this.saveSub?.unsubscribe();
  }

  openDeleteConfirmation() {
    this.confirmation = 'overlay';
    this.confirmationDialogService.open('Delete General Notes Confirmation','Are you sure you want to delete Note?').then((result: boolean) => {
      this.confirmation = '';
      if (result) {
        this.delete();
      }
    });
  }

  async delete() {
    if (this.internalNoteData.isNew) {
      setTimeout(() => {
        this.deleteExistingNote.emit(this.internalNoteData);
      });
    } else {
      const results$ = this.quoteService.deleteInternalNote(this.quote?.quoteId, this.internalNoteData?.noteId === null ? 0 : this.internalNoteData.noteId);
      return await lastValueFrom(results$).then(() => {
        this.deleteExistingNote.emit(this.internalNoteData);
      });
    }
  }

  copyNote(): void {
    this.copyExisitingNote.emit(this.internalNoteData);
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

  refreshNotes() {
    this.setNotesCount();
  }

  setNotesCount() {
    this.allNotesCount = this.internalNotes.length;

  }


}
