import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faSearch, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import {
  OperatorFunction,
  Observable,
  debounceTime,
  tap,
  switchMap,
  catchError,
  of,
  distinctUntilChanged,
  lastValueFrom,
} from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { QuoteClass } from 'src/app/features/quote/classes/quote-class';
import { QuotePolicyFormClass } from 'src/app/features/quote/classes/quote-policy-forms-class';
import { SharedComponentBase } from 'src/app/shared/component-base/shared-component-base';
import { PolicyForm } from 'src/app/shared/interfaces/policy-form';
import { PolicyFormsService } from '../services/policy-forms.service';
import { deepClone } from 'src/app/core/utils/deep-clone';

@Component({
  selector: 'rsps-policy-forms-search',
  templateUrl: './policy-forms-search.component.html',
  styleUrls: ['./policy-forms-search.component.css'],
})
export class PolicyFormsSearchComponent extends SharedComponentBase implements OnInit {
  faSearch = faSearch;
  faCopy = faCopy;
  faTimesCircle = faTimesCircle;
  searchFormName = '';
  searching = false;
  searchResponse!: PolicyForm[];
  canAddForm = false;
  private _selected: QuotePolicyFormClass | null = null;

  @Input() quote!: QuoteClass;
  @Output() refreshForms = new EventEmitter();

  constructor(
    userAuth: UserAuth,
    private policyFormsService: PolicyFormsService,
    private messageDialogService: MessageDialogService
  ) {
    super(userAuth);
  }

  ngOnInit(): void {}

  async add() {
    if (this._selected) {
      this._selected.isIncluded = true;
      this._selected.formIndex = 1;
      const duplicates = this.quote.quotePolicyForms.filter(
        (c) => c.formName == this._selected?.formName
      );
      if (duplicates.length > 0) {
        if (!this._selected.allowMultiples && duplicates.length == 1 && !duplicates[0].isIncluded) {
          duplicates[0].isIncluded = true;
          this.searchFormName = '';
          this._selected = null;
          this.canAddForm = false;
        } else if (!this._selected.allowMultiples) {
          this.messageDialogService.open('Error', 'Duplicate not allowed for this form');
        } else {
          let index = 1;
          duplicates.forEach((dupe) => {
            if ((dupe.formIndex ?? 1) > index) {
              index = dupe.formIndex ?? 1;
            }
          });
          this._selected.formIndex = index + 1;
          await this.addForm(this._selected);
          this.refreshForms.emit();
        }
      } else {
        await this.addForm(this._selected);
        this.refreshForms.emit();
      }
    }
  }

  private async addForm(form: QuotePolicyFormClass) {
    if (form) {
      const cloneForm = Object.create(form);
      const response$ = this.policyFormsService.getIsVariable(this.quote.programId, form.formName ?? '');
      await lastValueFrom(response$)
        .then(isVariable => {
          cloneForm.isVariable = isVariable;
        })
        .catch(() => {
          // If an error just default to false, it will try to pick it up again on fetch
          cloneForm.isVariable = false;
        });
      cloneForm.quoteId = this.quote.quoteId;
      cloneForm.markDirty();
      this.quote.quotePolicyForms.push(cloneForm);
      this.quote.sortForms();
      if (!cloneForm.allowMultiples) {
        this.searchFormName = '';
        this._selected = null;
        this.canAddForm = false;
      }
    }
  }

  displayFormatter(form: PolicyForm) {
    if (form.formName) {
      return (form.formName ?? '') + ' - ' + (form.formTitle ?? '');
    }
    return form.formTitle ?? '';
  }

  search: OperatorFunction<string, readonly PolicyForm[]> = (text$: Observable<string>) =>
    text$.pipe(
      tap(() => {
        this._selected = null;
        this.canAddForm = false;
      }),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) => {
        if (term.length >= 2) {
          this.searching = true;
          return this.performSearch(term);
        } else {
          return of([]);
        }
      }),
      tap(() => {
        this.searching = false;
      })
    );

  performSearch(term: string): Observable<QuotePolicyFormClass[]> {
    return this.policyFormsService.searchForms(term).pipe(
      tap((response) => {
        this.quote.quotePolicyForms.map((c) => {
          const match = response.find((r) => r.formName == c.formName);
          if (match && !match.allowMultiples && (c.isMandatory || c.isIncluded)) {
            match.canAdd = false;
          }
        });
        return response;
      }),
      catchError((error) => {
        this.searchFormName = '';
        this.messageDialogService.open('Error', 'Error searching forms' + error.message);
        return of([]);
      })
    );
  }

  selectedItem(form: QuotePolicyFormClass) {
    if (form.canAdd) {
      this._selected = form;
      this.canAddForm = true;
    }
  }
}
