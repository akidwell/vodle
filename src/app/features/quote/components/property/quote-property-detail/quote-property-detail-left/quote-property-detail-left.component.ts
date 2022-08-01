import { Component, Input, OnInit } from '@angular/core';
import { ClassTypeEnum } from 'src/app/core/enums/class-type-enum';
import { PropertyQuoteBuildingCoverageClass } from 'src/app/features/quote/classes/property-quote-building-coverage-class';
import { PropertyBuilding } from 'src/app/features/quote/models/property-building';
import { PropertyBuildingCoverage } from 'src/app/features/quote/models/property-building-coverage';
import { Quote } from 'src/app/features/quote/models/quote';

@Component({
  selector: 'rsps-quote-property-detail-left',
  templateUrl: './quote-property-detail-left.component.html',
  styleUrls: ['./quote-property-detail-left.component.css']
})
export class QuotePropertyDetailLeftComponent implements OnInit {
  @Input() public quote!: Quote;
  @Input() public classType!: ClassTypeEnum;
  @Input() public canEdit = false;
  @Input() public buildings!: PropertyBuilding[];
  number!: number;

  propBuildings: PropertyBuildingCoverage[] = [];



  constructor() { }

  ngOnInit(): void {
  }


  calcTotal(): number {
    let total = 0;
    this.buildings.forEach(building => {
      building.propertyQuoteBuildingCoverage.forEach(coverage => {
        total += Number.isNaN(Number(coverage.limit)) ? 0 : Number(coverage.limit);
      });
    });
    return total;
  }

  findLargest(): number {
    if (this.buildings.length == 0){
      return 0;
    } else{
      const mortgagee: PropertyBuildingCoverage[] = [];
      this.buildings.forEach(element => {
        element.propertyQuoteBuildingCoverage.forEach(x => {
          mortgagee.push(new PropertyQuoteBuildingCoverageClass(x));
        });
      });
      console.log(mortgagee);
      console.log(Math.max(...mortgagee.map( c => c.limit? c.limit : 0)));
      return Math.max(...mortgagee.map( c => c.limit? c.limit : 0));

    }
  }

 
}
