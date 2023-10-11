import { Component, Input, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { HeaderPaddingService } from 'src/app/core/services/header-padding-service/header-padding.service';
import { deepClone } from 'src/app/core/utils/deep-clone';
import { ProgramClass } from 'src/app/features/quote/classes/program-class';
import { QuoteClass } from 'src/app/features/quote/classes/quote-class';
import { QuoteInternalNotesClass } from 'src/app/features/quote/classes/quote-internal-notes-class';
import { InternalNotesClass } from 'src/app/shared/classes/internal-notes-class';

import { SharedComponentBase } from 'src/app/shared/component-base/shared-component-base';
@Component({
  selector: 'rsps-internal-notes-group',
  templateUrl: './internal-notes-group.component.html',
  styleUrls: ['./internal-notes-group.component.css']
})
export class InternalNotesGroupComponent extends SharedComponentBase implements OnInit {

  invalidMessage = '';
  showInvalid = false;
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  color: ThemePalette = 'warn';
  invalidList: string[] = [];
  isNew = false;
  collapsed = false;
  quoteId = 0;
  programSub!: Subscription;

  private _internalNotes!: InternalNotesClass[];

  constructor(
    userAuth: UserAuth,
    public headerPaddingService: HeaderPaddingService,
    private notification: NotificationService
  ) {
    super(userAuth);
  }
  @Input() public newNote!: InternalNotesClass;
  @Input() quote!: QuoteClass;
  @Input() submissionNumber!: number;
  @Input() quoteNumber!: number;
  @Input() program!: ProgramClass;


  @Input() set internalNotes(value: InternalNotesClass[]) {
    this._internalNotes = value;
  }
  get internalNotes(): InternalNotesClass[] {
    return this._internalNotes;
  }

  ngOnInit(): void {
    this.collapsed = false;
    this.handleSecurity(this.type);
    this.internalNotes = this.quote.internalNotesData;
  }
  isValid(): boolean {
    let valid = true;
    this.invalidList = [];
    this.internalNotes?.forEach(c => {
      if (!c.isValid) {
        valid = false;
        this.invalidList = this.invalidList.concat(c.invalidList);
      }
    });
    return valid;
  }

  isDirty() {
    return this.internalNotes?.some(item => item.isDirty);
  }

  hideInvalid(): void {
    this.showInvalid = false;
  }

  copyExisitingNote(existingNote: InternalNotesClass) {
    const clone = deepClone(existingNote.toJSON());
    const newNote = new QuoteInternalNotesClass(clone);
    const date = new Date();
    newNote.note = clone.note;
    newNote.isDirty = true;
    newNote.isNew = true;
    newNote.createdDate = date;
    newNote.createdByName = this.userName;
    if (this.internalNotes.length == 0) {
      newNote.noteId = 1;
    } else {
      newNote.noteId = Math.max(...this.internalNotes.map(v => v.noteId === null ? 0 : v.noteId)) + 1;
    }
    this.internalNotes?.push(newNote);
    const lastAdded = this.quote.internalNotesData.length - 1;
    this.quote.internalNotesData[lastAdded].isDirty = true;
  }


  deleteExistingNote(existingNote: InternalNotesClass) {
    const index = this.internalNotes?.indexOf(existingNote, 0);
    if (index > -1) {
      this.internalNotes?.splice(index, 1);
      if (!existingNote.isNew) {
        this.notification.show('Note deleted.', { classname: 'bg-success text-light', delay: 5000 });
      }
    }
  }

  addnewNote(): void {
    const newNote = new QuoteInternalNotesClass();
    newNote.isDirty = true;
    newNote.isNew = true;
    newNote.quoteId = this.quote.quoteId;
    newNote.createdByName = this.userName;
    const date = new Date();
    newNote.createdDate = date;
    if (this.internalNotes.length == 0) {
      newNote.noteId = 1;
    } else {
      newNote.noteId = Math.max(...this.internalNotes.map(v => v.noteId === null ? 0 : v.noteId)) + 1;
    }
    this.quote.internalNotesData?.push(newNote);
    const lastAdded = this.quote.internalNotesData.length - 1;
    this.quote.internalNotesData[lastAdded].isDirty = true;
    this.quote.showDirty = true;
    this.collapsed = false;
  }
}
