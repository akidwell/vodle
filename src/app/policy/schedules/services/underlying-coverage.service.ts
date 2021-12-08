import { Injectable, Inject, OnInit } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { Code } from 'src/app/drop-downs/code';
import { DropDownsService } from 'src/app/drop-downs/drop-downs.service';
@Injectable({
  providedIn: 'root'
})
export class UnderlyingCoverageService{
  public limitBasisDescriptions: Code[] = [];
  public coverageTypeDescriptions: Code[] = [];

  constructor(private dropdowns: DropDownsService){
    this.dropdowns.getLimitsBasis().subscribe((limitBasisList) =>
    {
      this.limitBasisDescriptions = limitBasisList
    });
    this.dropdowns.getUnderlyingCoverageDescriptions().subscribe((coverageTypes) =>
    {
      this.coverageTypeDescriptions = coverageTypes
    });
  }
}
