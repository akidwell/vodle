import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { ClassTypeEnum } from 'src/app/core/enums/class-type-enum';
import { PropertyQuoteBuildingClass } from 'src/app/features/quote/classes/property-quote-building-class';
import { PropertyBuilding } from 'src/app/features/quote/models/property-building';
import { QuoteService } from 'src/app/features/quote/services/quote-service/quote.service';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'rsps-property-building-group',
  templateUrl: './property-building-group.component.html',
  styleUrls: ['./property-building-group.component.css']
})
export class PropertyBuildingGroupComponent implements OnInit {
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

  addBuilding() {
    if (this.classType == ClassTypeEnum.Quote) {
      const newBuilding = new PropertyQuoteBuildingClass();
      this.buildings.push(newBuilding);
    }
    else if (this.classType == ClassTypeEnum.Policy) {
      //TODO
    }
  }

  copyBuilding(building: PropertyBuilding) {
    if (this.classType == ClassTypeEnum.Quote) {
      const newBuilding: PropertyQuoteBuildingClass = Object.create(building);
      newBuilding.propertyQuoteBuildingId = null;
      newBuilding.isNew = true;
      newBuilding.markDirty();
      this.buildings.push(newBuilding);
    }
  }

  deleteBuilding(building: PropertyBuilding) {
    const index = this.buildings.indexOf(building, 0);
    if (index > -1) {
      this.buildings.splice(index, 1);
      if (!building.isNew && building.propertyQuoteBuildingId != null) {
        this.deleteSub = this.quoteService
          .deleteBuilding(building.propertyQuoteBuildingId)
          .subscribe((result) => {
            if (result) {
              setTimeout(() => {
                this.notification.show('Building deleted.', { classname: 'bg-success text-light', delay: 5000 });
              });
            }
          });
      }
    }
  }
}
