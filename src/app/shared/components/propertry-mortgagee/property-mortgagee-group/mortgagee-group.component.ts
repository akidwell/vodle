import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { NotificationService } from 'src/app/core/components/notification/notification-service';

import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { MortgageeClass } from '../mortgagee-class';
import { MortgageeComponent } from '../property-mortgagee/mortgagee.component';
import { Subscription } from 'rxjs';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { ProgramClass } from 'src/app/features/quote/classes/program-class';

@Component({
  selector: 'rsps-mortgagee-group',
  templateUrl: './mortgagee-group.component.html',
  styleUrls: ['./mortgagee-group.component.css']
})
export class MortgageeGroupComponent implements OnInit {

  invalidMessage = '';
  showInvalid = false;
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  color: ThemePalette = 'warn';
  canDrag = false;
  dragDropClass = '';
  invalidList: string[] = [];
  isNew = false;
  collapsed = false;
  program!: ProgramClass | null;
  quoteId = 0;
  programSub!: Subscription;
  constructor(private notification: NotificationService,private userAuth: UserAuth, private route: ActivatedRoute, private pageDataService: PageDataService) {
  }

  @ViewChild(MortgageeComponent) mortgageeComp!: MortgageeComponent;
  @Input() public quoteData: MortgageeClass[] = [];
  @Input() public newMortgagee!: MortgageeClass;
  @Input() public canEdit = false;

  ngOnInit(): void {
    this.route.parent?.params.subscribe(routeParams => {
      this.pageDataService.getProgramWithQuote(routeParams.quoteId);
    });
    this.programSub = this.pageDataService.selectedProgram$.subscribe(
      (selectedProgram: ProgramClass | null) => {
        this.program = selectedProgram;
        if (this.program?.quoteData?.propertyQuoteMortgagee){
          this.quoteData = this.program?.quoteData?.propertyQuoteMortgagee;
        }
      });
    this.collapsed = false;
  }

  isValid(): boolean {
    let valid = true;
    this.invalidList = [];
    this.quoteData?.forEach(c => {
      if (!c.isValid) {
        valid = false;
        this.invalidList = this.invalidList.concat(c.invalidList);
      }
    });
    return valid;
  }

  isDirty() {
    return this.quoteData?.some(item => item.isDirty);
  }

  hideInvalid(): void {
    this.showInvalid = false;
  }

  copyExisitingMortgagee(existingMortgagee: MortgageeClass) {
    const copy: MortgageeClass = Object.create(existingMortgagee);
    copy.mortgageHolder = 'CopyOf ' + existingMortgagee.mortgageHolder;
    console.log(existingMortgagee);
    copy.isNew = true;
    this.quoteData?.push(copy);
  }

  deleteExistingMortgagee(existingMortgagee: MortgageeClass) {
    const index = this.quoteData?.indexOf(existingMortgagee, 0);
    if (index > -1) {
      this.quoteData?.splice(index, 1);
      if (!existingMortgagee.isNew) {
        this.notification.show('Mortgagee deleted.', { classname: 'bg-success text-light', delay: 5000 });
      }
    }
  }

  addNewMortgagee(): void {
    const mort: MortgageeClass = new MortgageeClass();
    mort.isNew = true;
    this.quoteData?.push(mort);
  }




}