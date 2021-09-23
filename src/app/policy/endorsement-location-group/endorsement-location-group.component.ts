import { Component, Input, OnInit } from '@angular/core';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { DropDownsService } from 'src/app/drop-downs/drop-downs.service';
import { EndorsementCoveragesGroup } from '../coverages/coverages';

@Component({
  selector: 'rsps-endorsement-location-group',
  templateUrl: './endorsement-location-group.component.html',
  styleUrls: ['./endorsement-location-group.component.css']
})
export class EndorsementLocationGroupComponent implements OnInit {
  ecCollapsed = true;
  faPlus = faPlus;
  faMinus = faMinus;
  authSub: Subscription;
  canEditPolicy: boolean = false;

  constructor(private dropdowns: DropDownsService, private userAuth: UserAuth) {
    // GAM - TEMP -Subscribe
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
     (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
   );
 }

  ngOnInit(): void {

  }
  @Input()
  public endorsementCoveragesGroup!: EndorsementCoveragesGroup;
}

