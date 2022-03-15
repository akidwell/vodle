import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { NotificationService } from 'src/app/notification/notification-service';
import { EndorsementLocation, newEndorsementLocation, PolicyInformation } from '../../policy';
import { EndorsementStatusService } from '../../services/endorsement-status.service';
import { EndorsementLocationComponent } from './endorsement-location/endorsement-location.component';

@Component({
  selector: 'rsps-endorsement-location-group',
  templateUrl: './endorsement-location-group.component.html',
  styleUrls: ['./endorsement-location-group.component.css']
})
export class EndorsementLocationGroupComponent implements OnInit {
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  locationCollapsed: boolean = false;
  locationData: EndorsementLocation[] = [];
  policyInfo!: PolicyInformation;
  endorsementNumber!: number;
  authSub!: Subscription;
  canEditPolicy: boolean = false;
  statusSub!: Subscription;
  canEditEndorsement: boolean = false;

  @ViewChildren(EndorsementLocationComponent) components: QueryList<EndorsementLocationComponent> | undefined;

  constructor(private route: ActivatedRoute, private userAuth: UserAuth, private notification: NotificationService, private endorsementStatusService: EndorsementStatusService) { 
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.locationData = data['endorsementLocationData'].endorsementLocation;
      this.policyInfo = data['policyInfoData'].policyInfo;
      this.endorsementNumber = Number(this.route.snapshot.paramMap.get('end') ?? 0);
    });
    this.statusSub = this.endorsementStatusService.canEditEndorsement.subscribe({
      next: canEdit => {
        this.canEditEndorsement = canEdit;  
      }
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    this.statusSub?.unsubscribe();
  }

  addNewEndorsementLocation(): void {
    let newLocation = newEndorsementLocation();
    newLocation.policyId = this.policyInfo.policyId;
    newLocation.endorsementNumber = this.endorsementNumber;
    newLocation.sequence = this.getNextSequence();
    this.locationData.push(newLocation);
    this.locationCollapsed = false;
  }

  getNextSequence(): number {
    if (this.locationData.length == 0) {
      return 1;
    }
    else {
      return Math.max(...this.locationData.map(o => o.sequence)) + 1;
    }
  }

  copyExistingLocation(existingLocation: EndorsementLocation) {
    const newLocation: EndorsementLocation = JSON.parse(JSON.stringify(existingLocation));
    newLocation.sequence = this.getNextSequence();
    newLocation.isNew = true;
    this.locationData.push(newLocation);
  }

  deleteLocation(existingLocation: EndorsementLocation) {
    const index = this.locationData.indexOf(existingLocation, 0);
    if (index > -1) {
      this.locationData.splice(index, 1);
      if (!existingLocation.isNew) {
        this.notification.show('Endorsement Location deleted.', { classname: 'bg-success text-light', delay: 5000 });
      }
    }
  }

  isValid(): boolean {
    if (this.components != null) {
      for (let child of this.components) {
        if (child.locationForm.status != 'VALID') {
          return false;
        }
      }
    }
    return true;
  }

  isDirty() {
    if (this.components != null) {
      for (let child of this.components) {
        if (child.locationForm.dirty) {
          return true;
        }
      }
    }
    return false;
  }

  async save(): Promise<boolean> {
    if (this.canEditPolicy && this.isDirty()) {
      let saveCount: number = 0;
      if (this.components != null) {
        for (let child of this.components) {
          if (child.locationForm.dirty) {
            let result = await child.save();
            if (result === false) {
              this.notification.show('Endorsesement Locations ' + child.location.sequence.toString() + ' not saved.', { classname: 'bg-danger text-light', delay: 5000 });
            }
            else {
              saveCount++;
            }
          }
        }
        if (saveCount > 0) {
          this.notification.show('Endorsement Locations successfully saved.', { classname: 'bg-success text-light', delay: 5000 });
        }
      }
      if (!this.isValid()) {
        this.notification.show('Endorsesement Locations not saved.', { classname: 'bg-danger text-light', delay: 5000 });
        return false;
      }
    }
    return false;
  }
  
}
