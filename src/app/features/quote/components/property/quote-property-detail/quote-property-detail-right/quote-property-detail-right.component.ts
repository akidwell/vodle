import { Component, Input, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ClassTypeEnum } from 'src/app/core/enums/class-type-enum';
import { Code } from 'src/app/core/models/code';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog/confirmation-dialog.service';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { PropertyQuoteClass } from 'src/app/features/quote/classes/property-quote-class';

@Component({
  selector: 'rsps-quote-property-detail-right',
  templateUrl: './quote-property-detail-right.component.html',
  styleUrls: ['./quote-property-detail-right.component.css']
})
export class QuotePropertyDetailRightComponent implements OnInit {
  @Input() public quote!: PropertyQuoteClass;
  @Input() public classType!: ClassTypeEnum;
  @Input() public canEdit = false;
  @Input() public rateEffectiveDate!: Date | null;
  cspCodes$: Observable<Code[]> | undefined;
  loadingCsp = true;
  cspCode: Code = {code:'', key:0, description:''};
  previousCspCode: any = undefined;
  testArray: Code[] = [];

  selectedAttribute!: string;
  naicsSelectedAttribute!: string;


  constructor( private dropdowns: DropDownsService,
               private confirmationDialogService: ConfirmationDialogService
  ) { }

  ngOnInit(): void {
    this.cspCodes$ = this.dropdowns.getCspCodes('IUS', this.rateEffectiveDate?.toString() ?? '', this.quote.programId.toString() || '*')
      .pipe(tap(() => this.loadingCsp = false));

    this.previousCspCode = this.quote.classCode;
  }


  dropDownSearch(term: string, item: Code) {
    term = term.toLowerCase();
    return item.code?.toLowerCase().indexOf(term) > -1 || item.key?.toString().toLowerCase().indexOf(term) > -1 || item.description?.toLowerCase().indexOf(term) > -1;
  }


  changeCspCode(cspCode: Code) {
    if ((this.previousCspCode != null || undefined || 0)) {
      this.confirmationDialogService
        .open(
          'CSP Code Change Confirmation',
          'Do you wish to overwrite existing CSP Codes?'
        )
        .then(async (result: boolean) => {
          if (result) {
            this.previousCspCode = cspCode;
            this.quote.clearCspCodes();
            this.quote.cspCode = cspCode;
            this.quote.classCode = Number(cspCode);
          } else {
            this.quote.classCode = this.previousCspCode;
          }});
    } else {
      this.previousCspCode = cspCode;
      this.quote.cspCode = cspCode;
      this.quote.classCode = Number(cspCode);
    }
  }
}
