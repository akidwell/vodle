import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {merge, Observable, of, OperatorFunction, Subject} from 'rxjs';
import {catchError, debounceTime, map, tap, switchMap} from 'rxjs/operators';
import { FormatDateForDisplay } from 'src/app/core/services/format-date/format-date-display.service';
import { ProducerContact } from 'src/app/features/submission/models/producer-contact';
import { faAngleDown, faAngleUp, faPlus, faX } from '@fortawesome/free-solid-svg-icons';
import { ProducerContactService } from 'src/app/features/submission/services/producer-contact-service/producer-contact-service';
import { ProducerContactClass } from 'src/app/features/submission/classes/ProducerContactClass';

export interface FuzzyProducerContactSearchResponse {
  query: string,
  results: ProducerContact[]
}


@Component({
  selector: 'producer-contact-fuzzy-search',
  templateUrl: './producer-contact-search.html',
  providers: [ProducerContactService],
  styleUrls: ['./producer-contact-search.css']
})
export class ProducerContactSearch implements OnInit{
  model!: ProducerContactClass | null;
  originalModel!: ProducerContactClass;
  allowSearching = true;
  searching = false;
  searchFailed = false;
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  showContactMaintenance = false;
  lockSubmissionFields = false;
  searchResponse!: ProducerContactClass[];
  formatDateForDisplay: FormatDateForDisplay;
  pcCollapsed = true;
  canEditSubmission = false;
  newProducerContact! : ProducerContactClass;
  addNewProducer = false;
  faPlus = faPlus;
  faX = faX;
  public _producerCode!: number | null;
  focus$ = new Subject<string>();

  @Input() set producerCode(value: number | null) {
    this._producerCode = value;
    this.newProducerContact = new ProducerContactClass(undefined, value || 0);
    this.resetSearch();
  }
  get producerCode(): number | null {
    return this._producerCode;
  }
  @ViewChild('producerContact') producerContact!: ElementRef;
  @Input() public canEdit!: boolean;
  @Input() public isRequired!: boolean;
  @Input() public producerContactOnLoad!: ProducerContactClass | null;
  @Output() producerContactSelected: EventEmitter<ProducerContactClass | null> = new EventEmitter();

  constructor(private _service: ProducerContactService, private formatDateService: FormatDateForDisplay) {
    this.formatDateForDisplay = formatDateService;
  }

  ngOnInit(): void {
    if (this.producerContactOnLoad) {
      this.allowSearching = false;
      this.model = this.producerContactOnLoad;
      this.originalModel = this.model;
    }
  }
  // formatter = (producer: ProducerContact) => producer.firstName + '\xa0' + producer.lastName;
  displayFormatter = (producer: ProducerContactClass) => producer.display;

  leaveSearchBar() {
    if ((this.model?.display || !this.allowSearching)) {
      this.showContactMaintenance = false;
    } else {
      this.showContactMaintenance = this.searchResponse.length > 0 ? true : false;
    }
  }
  selectedProducerContact(producer: ProducerContactClass){
    this.allowSearching = false;
    this.model = producer;
    this.originalModel = producer;
    this.showContactMaintenance = false;
    this.producerContactSelected.emit(producer);
  }

  handleEmptyResultSet(): never[] {
    this.allowSearching = true;
    this.producerContactSelected.emit(null);
    return [];
  }
  resetDisplay(): never[] {
    if (!this.allowSearching) {
      this.model = this.originalModel;
    }
    if (this.producerContact && this.producerContact.nativeElement != null){
      this.producerContact.nativeElement.blur();
    }
    return [];
  }
  resetSearch(): void {
    this.model = null;
    this.searchResponse = [];
  }
  openPanelAndCreate() {
    this.performSearch('').subscribe();
    this.addNewProducerContact();
    this.showContactMaintenance = true;
  }
  closePanel() {
    this.addNewProducer = false;
    this.showContactMaintenance = false;
  }
  cancelAddProducer() {
    this.addNewProducer = false;
  }
  addNewProducerContact() {
    this.newProducerContact.resetClass(undefined, this._producerCode || 0);
    this.addNewProducer = true;
  }
  saveNewProducerContact() {
    this._service.addProducerContact(this.newProducerContact).subscribe(data => this.selectedProducerContact( new ProducerContactClass(data)));
  }
  async producerContactActions(contact: ProducerContactClass, event: any){
    switch (event.target.value) {
    case 'status':
      await this.updateProducerContactStatus(contact);
      break;
    case 'select':
      this.selectedProducerContact(contact);
      break;
    default:
      break;
    }
  }
  updateProducerContactStatus(contact: ProducerContactClass) {
    contact.toggleActive();
    this._service.updateProducerContact(contact).subscribe(data => contact.resetClass(data));
  }
  search: OperatorFunction<string, readonly ProducerContactClass[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(300));
    const inputFocus$ = this.focus$;
    return merge(debouncedText$, inputFocus$).pipe(
      tap(() => {
        this.searching = true;
        this.showContactMaintenance = false;
        this.pcCollapsed = true;
      }),
      switchMap(term => {
        if (term !== '') {
          if (this.allowSearching) {
            return this.performSearch(term);
          } else {
            return this.resetDisplay();
          }
        } else {
          if (this.allowSearching) {
            return this.performSearch(term);
          } else {
            this.allowSearching = true;
            return this.performSearch(term);
          }
        }
      }
      ),
      tap(() => {
        this.searching = false;
      })
    );
  };
  performSearch(term: string): Observable<ProducerContactClass[]> {
    return this._service.searchProducerContacts(term, this.producerCode ? this.producerCode : 0).pipe(
      tap((response) => {
        this.searchFailed = false;
        this.searchResponse = response;
      }),
      map(obj => obj.filter(r => r.isActive)),
      catchError(() => {
        this.searchFailed = true;
        return of([]);
      }));
  }
}
