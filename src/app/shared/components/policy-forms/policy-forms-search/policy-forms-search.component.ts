import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { OperatorFunction, Observable, debounceTime, tap, switchMap, catchError, of, distinctUntilChanged } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { QuoteClass } from 'src/app/features/quote/classes/quote-class';
import { QuotePolicyFormClass } from 'src/app/features/quote/classes/quote-policy-forms-class';
import { SharedComponentBase } from 'src/app/shared/component-base/shared-component-base';
import { PolicyForm } from 'src/app/shared/interfaces/policy-form';
import { SpecimenPacketService } from '../services/policy-forms.service';

@Component({
  selector: 'rsps-policy-forms-search',
  templateUrl: './policy-forms-search.component.html',
  styleUrls: ['./policy-forms-search.component.css']
})
export class PolicyFormsSearchComponent extends SharedComponentBase implements OnInit {
  faSearch = faSearch;
  searchFormName = '';
  searching = false;
  searchResponse!: PolicyForm[];
  canAddForm = false;
  private _selected: PolicyForm | null = null;

  @Input() quote!: QuoteClass;
  @Output() addForm: EventEmitter<PolicyForm> = new EventEmitter();

  constructor(userAuth: UserAuth, private specimenPacketService: SpecimenPacketService, private messageDialogService: MessageDialogService) {
    super(userAuth);
  }

  ngOnInit(): void {
    console.log('type: ' + this.type);
  }

  add() {
    if (this._selected) {
      this.addForm.emit(this._selected);
    }
  }

  displayFormatter = (form: PolicyForm) => (form.formName ?? '');
  listFormatter(form: PolicyForm) {
    return (form.formName ?? '') + ' - ' + (form.formTitle ?? '');
  }

  search: OperatorFunction<string, readonly PolicyForm[]> = (text$: Observable<string>) =>
    text$.pipe(
      tap(() => {
        this._selected = null;
        this.canAddForm = false;
      }),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term =>{
        if (term.length >= 2) {
          this.searching = true;
          return this.performSearch(term);
        } else {
          return of([]);
        }
      }
      ),
      tap(() => {
        this.searching = false;
      })
    );

  performSearch(term: string): Observable<PolicyForm[]> {
    return this.specimenPacketService.searchForms(term).pipe(
      tap((response) => {
        return response;
      }),
      catchError((error) => {
        this.searchFormName = '';
        this.messageDialogService.open('Error','Error searching forms' + error.message);
        return of([]);
      }));
  }

  dropDownSearch(term: string, item: PolicyForm) {
    term = term.toLowerCase();
    return (
      (item.formName?.toLowerCase().indexOf(term) ?? 0) > -1 ||
      (item.formTitle?.toString().toLowerCase().indexOf(term) ?? 0) > -1
    );
  }

  selectedItem(form: PolicyForm){
    this._selected = form;
    this.canAddForm = true;
  }

}
