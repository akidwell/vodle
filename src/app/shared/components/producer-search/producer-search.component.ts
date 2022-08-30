import {Component, ElementRef, EventEmitter, Injectable, Input, OnInit, Output, ViewChild} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, of, OperatorFunction} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, map, tap, switchMap, filter} from 'rxjs/operators';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { Producer } from 'src/app/features/submission/models/producer';
import { FormatDateForDisplay } from 'src/app/core/services/format-date/format-date-display.service';
import * as moment from 'moment';

export interface FuzzySearchResponse {
  query: string,
  results: Producer[]
}

@Injectable()
export class ProducerSearchService {
  constructor(private http: HttpClient, private config: ConfigService) {}

  search(query: string, department: number, policyDate: Date) {
    if (query === '') {
      return of([]);
    }
    const policyDateString = moment.isMoment(policyDate) ? policyDate.format('YYYY-MM-DD HH:mm') : policyDate.toString();
    const params = new HttpParams().append('query', query ).append('departmentCode', department).append('policyDate', policyDateString);
    return this.http
      .get<FuzzySearchResponse>(this.config.apiBaseUrl + 'api/lookups/producer-branch/', {params}).pipe(
        map(response => response.results)
      );
  }
}

@Component({
  selector: 'producer-fuzzy-search',
  templateUrl: './producer-search.html',
  providers: [ProducerSearchService],
  styleUrls: ['./producer-search.css']
})
export class ProducerSearch {
  model!: Producer | null;
  originalModel!: Producer;
  allowSearching = true;
  searching = false;
  searchFailed = false;
  formatDateForDisplay: FormatDateForDisplay;
  public _department!: number | null;
  private _producerOnLoad!: Producer | null;

  @Input() public policyDate!: Date;
  @Input() set department(value: number | null) {
    if (this._department != value) {
      this._department = value;
      this.resetSearch();
    }
  }
  get department(): number | null {
    return this._department;
  }
  @ViewChild('producer') producer!: ElementRef;
  @Input() public canEdit!: boolean;
  @Input() public isRequired!: boolean;
  @Output() producerSelected: EventEmitter<Producer | null> = new EventEmitter();
  @Input() set producerOnLoad(value: Producer | null) {
    this._producerOnLoad = value;
    this.reload();
  }
  get producerOnLoad(): Producer | null {
    return this._producerOnLoad;
  }

  constructor(private _service: ProducerSearchService, private formatDateService: FormatDateForDisplay) {
    this.formatDateForDisplay = formatDateService;
  }

  private reload() {
    if (this.producerOnLoad) {
      this.allowSearching = false;
      this.model = this.producerOnLoad;
      this.originalModel = this.producerOnLoad;
      this.formatDisplay(this.producerOnLoad);
    }
  }

  formatter = (producer: Producer) => producer.name;
  displayFormatter = (producer: Producer) => producer.display;

  selectedProducer(producer: any){
    this.originalModel = producer;
    this.producerSelected.emit(producer.item);
  }
  formatDisplay(producer: Producer) {
    producer.display = producer.name + '\xa0\xa0\xa0\xa0\xa0\xa0' + producer.city + '\xa0\xa0\xa0' + producer.state + '\xa0\xa0\xa0' + producer.profitCenter+ '\xa0\xa0\xa0' + this.formatDateForDisplay.formatDateForDisplay(producer.createdDate) + '\xa0\xa0\xa0' + '(' + producer.producerCode + ')';
  }
  handleEmptyResultSet(): never[] {
    this.allowSearching = true;
    this.producerSelected.emit(null);
    return [];
  }
  resetDisplay(): never[] {
    if (!this.allowSearching) {
      this.model = this.originalModel;
    }
    if (this.producer && this.producer.nativeElement != null){
      this.producer.nativeElement.blur();
    }
    return [];
  }
  resetSearch(): void {
    this.model = null;
  }

  search: OperatorFunction<string, readonly Producer[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.searching = true;
      }),
      switchMap(term =>{
        if (term.length >= 3) {
          if (this.allowSearching) {
            return this.performSearch(term);
          } else {
            return this.resetDisplay();
          }
        } else {
          return this.handleEmptyResultSet();
        }
      }
      ),
      tap(() => {
        this.searching = false;
      })
    );
  performSearch(term: string): Observable<Producer[]> {
    return this._service.search(term, this.department ? this.department : 0, this.policyDate).pipe(
      tap((response) => {
        this.searchFailed = false;
        response.forEach((producer) => {
          this.formatDisplay(producer);
        });
      }),
      catchError(() => {
        this.searchFailed = true;
        return of([]);
      }));
  }
}
