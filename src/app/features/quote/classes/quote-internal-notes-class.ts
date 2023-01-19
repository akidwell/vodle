import { InternalNotesClass } from 'src/app/shared/classes/internal-notes-class';
import { QuoteInternalNotes } from '../models/quote-internal-notes';

export class QuoteInternalNotesClass extends InternalNotesClass {
  quoteId!: number;
  isNew!: boolean;

  classValidation() {
    this.invalidList = [];
    this.canBeSaved = true;
    this.errorMessages = this.invalidList;
  }

  toJSON(): QuoteInternalNotes {
    return {
      quoteId: this.quoteId,
      noteId: this.noteId,
      note: this.note,
      createdByName: this.createdByName,
      createdDate: this.createdDate,
      createdBy: this.createdBy
    };
  }
}
