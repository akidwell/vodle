import { Component, Input, OnInit } from '@angular/core';
import { map, Observable, tap, zipAll } from 'rxjs';
import { ClassTypeEnum } from 'src/app/core/enums/class-type-enum';
import { Code } from 'src/app/core/models/code';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { ClassCode } from 'src/app/features/quote/models/class-code';
import { NaicsCode } from 'src/app/features/quote/models/naics';
import { Quote } from 'src/app/features/quote/models/quote';

@Component({
  selector: 'rsps-quote-property-detail-right',
  templateUrl: './quote-property-detail-right.component.html',
  styleUrls: ['./quote-property-detail-right.component.css']
})
export class QuotePropertyDetailRightComponent implements OnInit {
  @Input() public quote!: Quote;
  @Input() public classType!: ClassTypeEnum;
  @Input() public canEdit = false;
  sicCodes$: Observable<Code[]> | undefined;
  naicsCodes: NaicsCode[] = [];
  classCodes$: Observable<ClassCode[]> | undefined;
  code!: NaicsCode;
  loadingSic = true;
  loadingNaics = true;
  loadingClass = true;

  selectedAttribute!: string;
  naicsSelectedAttribute!: string;


  constructor( private dropdowns: DropDownsService) { }

  ngOnInit(): void {
    // this.sicCodes$ = this.dropdowns.getSicCodes()
    //   .pipe(tap(() => this.loadingSic = false));

  }


  // dropDownSearch(term: string, item: Code) {
  //   term = term.toLowerCase();
  //   return item.code?.toLowerCase().indexOf(term) > -1 || item.key?.toString().toLowerCase().indexOf(term) > -1 || item.description?.toLowerCase().indexOf(term) > -1;
  // }

  // classDropDownSearch(term: string, item: ClassCode) {
  //   term = term.toLowerCase();
  //   return item.classCode?.toLowerCase().indexOf(term) > -1 || item.description?.toLowerCase().indexOf(term) > -1;
  // }

  // naicsDropDownSearch(term: string, item: NaicsCode) {
  //   term = term.toLowerCase();
  //   return item.naicsCode?.toLowerCase().indexOf(term) > -1 || item.longDescription?.toLowerCase().indexOf(term) > -1;
  // }


  // changeSicCode() {
  //   if (this.quote.sicCode != null) {
  //     this.loadingNaics = true;
  //     this.quote.naicsCode = null;
  //     this.classCodes$ = this.dropdowns.postSicCode(this.quote.sicCode)
  //       .pipe(tap(() => this.loadingClass = false))
  //       .pipe(tap(() => this.loadingNaics = false))
  //       .pipe(tap((x) => {
  //         //to do: check values in DB once save is finished
  //         this.naicsCodes = x.map(y => y.sicCode.map(z => z.naicsCodes).reduce((x,y) => x.concat(y), [])).reduce((x,y) => x.concat(y), []);
  //         if (this.naicsCodes.length > 0){
  //           this.naicsSelectedAttribute = this.naicsCodes[0].naicsCode;
  //         }
  //       }));
  //     this.classCodes$.subscribe(classCode =>
  //     {
  //       if(classCode.length > 0)
  //         this.selectedAttribute = classCode[0].classCode;
  //       console.log(this.selectedAttribute);
  //     });

  //   }
  //   else {
  //     this.classCodes$ = new Observable<ClassCode[]>();
  //   }
  // }
}
