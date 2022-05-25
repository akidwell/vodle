import {Component, ElementRef, EventEmitter, Injectable, Input, OnInit, Output, ViewChild} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, of, OperatorFunction} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, map, tap, switchMap, filter} from 'rxjs/operators';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { FormatDateForDisplay } from 'src/app/core/services/format-date/format-date-display.service';
import { ProducerContact } from 'src/app/features/submission/models/producer-contact';
import * as moment from 'moment';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { deepClone } from 'src/app/core/utils/deep-clone';

export interface FuzzyProducerContactSearchResponse {
  query: string,
  results: ProducerContact[]
}

@Injectable()
export class ProducerContactSearchService {
  constructor(private http: HttpClient, private config: ConfigService) {}

  search(query: string, producerCode: number) {
    if (query === '') {
      return of([]);
    }
    const params = new HttpParams().append('query', query ).append('producerCode', producerCode);
    return this.http
      .get<FuzzyProducerContactSearchResponse>(this.config.apiBaseUrl + 'api/lookups/producer-contact/', {params}).pipe(
        tap(response => {
          console.log(response);
        }),
        map(response => response.results)
      );
  }
}

@Component({
  selector: 'producer-contact-fuzzy-search',
  templateUrl: './producer-contact-search.html',
  providers: [ProducerContactSearchService],
  styles: ['ngb-typeahead-window { max-height: 200px !important; overflow-y: auto;} .card-header { color: white; background-color: #00274e; }']
})
export class ProducerContactSearch implements OnInit{
  model!: ProducerContact | null;
  originalModel!: ProducerContact;
  allowSearching = true;
  searching = false;
  searchFailed = false;
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  showContactMaintenance = false;
  searchResponse!: ProducerContact[];
  formatDateForDisplay: FormatDateForDisplay;
  pcCollapsed = true;
  public _producerCode!: number | null;
  @Input() set producerCode(value: number | null) {
    console.log(value);
    this._producerCode = value;
    this.resetSearch();
  }
  get producerCode(): number | null {
    return this._producerCode;
  }
  @ViewChild('producerContact') producerContact!: ElementRef;
  @Input() public canEdit!: boolean;
  @Input() public producerContactOnLoad!: ProducerContact | null;
  @Output() producerContactSelected: EventEmitter<ProducerContact | null> = new EventEmitter();

  constructor(private _service: ProducerContactSearchService, private formatDateService: FormatDateForDisplay) {
    this.formatDateForDisplay = formatDateService;
  }
  ngOnInit(): void {
    if (this.producerContactOnLoad) {
      this.allowSearching = false;
      this.model = this.producerContactOnLoad;
      this.originalModel = this.model;
      this.formatDisplay(this.model);
    }
  }

  // formatter = (producer: ProducerContact) => producer.firstName + '\xa0' + producer.lastName;
  displayFormatter = (producer: ProducerContact) => producer.display;

  leaveSearchBar() {
    console.log(this.model, this.allowSearching);
    if (this.model?.display || !this.allowSearching) {
      this.showContactMaintenance = false;
    } else {
      this.showContactMaintenance = true;
    }
  }
  selectedProducerContact(producer: any){
    console.log(producer);
    this.allowSearching = false;
    this.model = producer;
    this.originalModel = producer;
    this.showContactMaintenance = false;
    this.producerContactSelected.emit(producer.item);
  }
  formatDisplay(producer: ProducerContact) {
    producer.isActive = producer.closedDate == null || moment(producer.closedDate) > moment();
    producer.display = producer.firstName + '\xa0' + producer.lastName + '\xa0\xa0\xa0' + producer.email + (producer.phone ? '\xa0\xa0\xa0' + producer.phone : '');
  }
  handleEmptyResultSet(): never[] {
    console.log('empty');
    this.allowSearching = true;
    this.producerContactSelected.emit(null);
    return [];
  }
  resetDisplay(): never[] {
    console.log('reset');
    this.allowSearching = false;
    this.model = deepClone(this.originalModel);
    this.producerContact.nativeElement.blur();
    return [];
  }
  resetSearch(): void {
    this.model = null;
    this.searchResponse = [];
  }
  addNewProducerContact() {
    console.log('add new');
  }
  search: OperatorFunction<string, readonly ProducerContact[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.searching = true;
        this.showContactMaintenance = false;
        this.pcCollapsed = true;
      }),
      switchMap(term =>
        term.length < 3 ? this.handleEmptyResultSet() : this.allowSearching == false ? this.resetDisplay() :
          this._service.search(term, this.producerCode ? this.producerCode : 0).pipe(
            tap((response) => {
              this.searchFailed = false;
              response.forEach((producerContact) => {
                this.formatDisplay(producerContact);
              });
              this.searchResponse = response;
            }),
            map(obj => obj.filter(r => r.isActive)),
            catchError(() => {
              this.searchFailed = true;
              return of([]);
            }))
      ),
      tap((obj) => {
        console.log(obj);
        this.searching = false;
      })
    );
}
