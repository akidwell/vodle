import { Component, Input, OnInit } from '@angular/core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { ClassTypeEnum } from 'src/app/core/enums/class-type-enum';
import { PropertyQuoteBuildingClass } from 'src/app/features/quote/classes/property-quote-building-class';
import { PropertyQuoteBuildingCoverageClass } from 'src/app/features/quote/classes/property-quote-building-coverage-class';
import { PropertyBuilding } from 'src/app/features/quote/models/property-building';
import { PropertyBuildingCoverage } from 'src/app/features/quote/models/property-building-coverage';
import { QuoteService } from 'src/app/features/quote/services/quote-service/quote.service';

@Component({
  selector: 'rsps-property-building-coverage-group',
  templateUrl: './property-building-coverage-group.component.html',
  styleUrls: ['./property-building-coverage-group.component.css']
})
export class PropertyBuildingCoverageGroupComponent implements OnInit {
  deleteSub!: Subscription;
  collapsed = false;
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;

  @Input() public buildings!: PropertyBuilding[];
  @Input() public canEdit = false;
  @Input() public classType!: ClassTypeEnum;

  constructor(private notification: NotificationService, private quoteService: QuoteService) { }

  ngOnInit(): void {
  }

  get coverageCount(): number {
    let count = 0;
    this.buildings.forEach( c => count += c.propertyQuoteBuildingCoverage.length);
    return count;
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

  addCoverage() {
    if (this.classType == ClassTypeEnum.Quote) {
      const newCoverage = new PropertyQuoteBuildingCoverageClass();
      this.buildings[0].propertyQuoteBuildingCoverage.push(newCoverage);
    }
    else if (this.classType == ClassTypeEnum.Policy) {
      //TODO
    }
  }

  copyCoverage(coverage: PropertyBuildingCoverage) {
    if (this.classType == ClassTypeEnum.Quote) {
      const newBuilding: PropertyQuoteBuildingClass = Object.create(coverage);
      newBuilding.propertyQuoteBuildingId = null;
      newBuilding.isNew = true;
      newBuilding.markDirty();
      this.buildings[0].propertyQuoteBuildingCoverage.push(coverage);
      // this.coverages.push(coverage);
    }
  }

  deleteCoverage(coverage: PropertyBuildingCoverage) {
    // const index = this.coverages.indexOf(coverage, 0);
    // if (index > -1) {
    //   this.coverages.splice(index, 1);
    //   if (!coverage.isNew && coverage.propertyQuoteCoverageId != null) {
    //     this.deleteSub = this.quoteService
    //       .deleteDeductible(coverage.propertyQuoteBuildingId)
    //       .subscribe((result) => {
    //         if (result) {
    //           setTimeout(() => {
    //             this.notification.show('Building deleted.', { classname: 'bg-success text-light', delay: 5000 });
    //           });
    //         }
    //       });
    //   }
    // }
  }
}
