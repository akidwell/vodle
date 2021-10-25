import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { UserAuth } from 'src/app/authorization/user-auth';
import { EndorsementLocation, newEndorsementLocation, PolicyInformation } from '../../policy';
import { EndorsementLocationComponent } from './endorsement-location/endorsement-location.component';

@Component({
  selector: 'rsps-endorsement-location-group2',
  templateUrl: './endorsement-location-group.component.html',
  styleUrls: ['./endorsement-location-group.component.css']
})
export class EndorsementLocationGroupComponent2 implements OnInit {
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  locationCollapsed: boolean = false;
  locationData: EndorsementLocation[] = [];
  policyInfo!: PolicyInformation;
  endorsementNumber!: number;

  @ViewChildren(EndorsementLocationComponent) components: QueryList<EndorsementLocationComponent> | undefined;

  constructor(private route: ActivatedRoute, private userAuth: UserAuth) { }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.locationData = data['endorsementLocationData'].endorsementLocation;
      this.policyInfo = data['policyInfoData'].policyInfo;
      this.endorsementNumber = Number(this.route.snapshot.paramMap.get('end') ?? 0);
    });
  }

  addNewEndorsementLocation(): void {
    // this.newAni = this.createNewAni();
    // this.incrementSequence.emit(this.currentSequence + 1);
    let newLocation = newEndorsementLocation();
    newLocation.policyId = this.policyInfo.policyId;
    newLocation.endorsementNumber = this.endorsementNumber;
    newLocation.sequence = this.getNextSequence();
    this.locationData.push(newLocation);
    console.log(newLocation)
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
    // newCoverage.collapsed = true;
    //newLocation.isNew = true;
    //this.incrementSequence.emit(this.currentSequence + 1);
    //console.log('new: ', newCoverage, 'existing: ', existingCoverage)
    this.locationData.push(newLocation);
  }

  deleteLocation(existingLocation: EndorsementLocation) {
    const index = this.locationData.indexOf(existingLocation, 0);
    if (index > -1) {
      this.locationData.splice(index, 1);
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

}
