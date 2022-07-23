import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { ProgramClass } from 'src/app/features/quote/classes/program-class';
import { AdditionalInterestComponent } from '../additional-interest/additional-interest.component';
import { AdditionalInterestClass } from '../additional-interest-class';

@Component({
  selector: 'rsps-additional-interest-group',
  templateUrl: './additional-interest-group.component.html',
  styleUrls: ['./additional-interest-group.component.css']
})
export class AdditionalInterestGroupComponent implements OnInit {

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

  @ViewChild(AdditionalInterestComponent) aiComp!: AdditionalInterestComponent;
  @Input() public quoteData: AdditionalInterestClass[] = [];
  @Input() public newAi!: AdditionalInterestClass;
  @Input() public canEdit = false;

  ngOnInit(): void {
    this.route.parent?.params.subscribe(routeParams => {
      this.pageDataService.getProgramWithQuote(routeParams.quoteId);
    });
    this.programSub = this.pageDataService.selectedProgram$.subscribe(
      (selectedProgram: ProgramClass | null) => {
        this.program = selectedProgram;
        if (this.program?.quoteData?.propertyQuoteMortgagee){
          this.quoteData = this.program?.quoteData?.propertyQuoteAdditionalInterest;
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

  copyExisitingAdditionalInterest(existingAi: AdditionalInterestClass) {
    const copy: AdditionalInterestClass = Object.create(existingAi);
    copy.interest = 'CopyOf ' + existingAi.interest;
    console.log(existingAi);
    copy.isNew = true;
    this.quoteData?.push(copy);
  }

  deleteExistingAdditionalInterest(existingAi: AdditionalInterestClass) {
    const index = this.quoteData?.indexOf(existingAi, 0);
    if (index > -1) {
      this.quoteData?.splice(index, 1);
      if (!existingAi.isNew) {
        this.notification.show('Mortgagee deleted.', { classname: 'bg-success text-light', delay: 5000 });
      }
    }
  }

  addNewAdditionalInterest(): void {
    const mort: AdditionalInterestClass = new AdditionalInterestClass();
    mort.isNew = true;
    this.quoteData?.push(mort);
  }




}