import { Component, Input, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { deepClone } from 'src/app/core/utils/deep-clone';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { MortgageeClass } from '../mortgagee-class';
import { Subscription } from 'rxjs';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { ProgramClass } from 'src/app/features/quote/classes/program-class';
import { PropertyQuoteClass } from 'src/app/features/quote/classes/property-quote-class';
import { PropertyMorgageeBaseComponent } from '../property-mortgagee-base-component';
import { ClassTypeEnum } from 'src/app/core/enums/class-type-enum';
import { FilteredBuildingsService } from 'src/app/shared/services/filtered-buildings/filtered-buildings.service';
import { PolicyClass } from 'src/app/features/policy-v2/classes/policy-class';

@Component({
  selector: 'rsps-mortgagee-group',
  templateUrl: './mortgagee-group.component.html',
  styleUrls: ['./mortgagee-group.component.css']
})
export class MortgageeGroupComponent extends PropertyMorgageeBaseComponent implements OnInit {

  invalidMessage = '';
  showInvalid = false;
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  color: ThemePalette = 'warn';
  invalidList: string[] = [];
  isNew = false;
  collapsed = false;
  program!: ProgramClass | null;
  quoteId = 0;
  programSub!: Subscription;

  constructor(private notification: NotificationService,private userAuth: UserAuth, private route: ActivatedRoute, private pageDataService: PageDataService, filteredBuildingsService :FilteredBuildingsService) {
    super(filteredBuildingsService);
  }

  @Input() public mortgageeData: MortgageeClass[] = [];
  @Input() public newMortgagee!: MortgageeClass;
  @Input() public canEdit = false;
  @Input() public readOnlyQuote!: boolean;
  @Input() public classType!: ClassTypeEnum;

  ngOnInit(): void {
    //passing in the data using inputs
    this.collapsed = false;
  }

  //TODO: does this get called or used?
  isValid(): boolean {
    let valid = true;
    this.invalidList = [];
    this.mortgageeData?.forEach(c => {
      if (!c.isValid) {
        valid = false;
        this.invalidList = this.invalidList.concat(c.invalidList);
      }
    });
    return valid;
  }

  isDirty() {
    return this.mortgageeData?.some(item => item.isDirty);
  }

  hideInvalid(): void {
    this.showInvalid = false;
  }

  copyExistingMortgagee(existingMortgagee: MortgageeClass) {
    const clone = deepClone(existingMortgagee.toJSON());
    const newMortgagee = new MortgageeClass(clone);
    newMortgagee.propertyQuoteMortgageeId = 0;
    newMortgagee.guid = crypto.randomUUID();
    newMortgagee.mortgageHolder = 'CopyOf ' + existingMortgagee.mortgageHolder;
    newMortgagee.isNew = true;
    newMortgagee.markDirty();
    this.mortgageeData?.push(newMortgagee);
    //TODO: if else for propertyParent possibly
  }

  deleteExistingMortgagee(existingMortgagee: MortgageeClass) {
    const index = this.mortgageeData?.indexOf(existingMortgagee, 0);
    if (index > -1) {
      this.mortgageeData?.splice(index, 1);
      if (!existingMortgagee.isNew) {
        this.notification.show('Mortgagee deleted.', { classname: 'bg-success text-light', delay: 5000 });
      }
      //TODO: if else for propertyParent- quote deletes from DB immediately, policy deletes on the save
    }
  }

  addNewMortgagee(): void {
    const mort: MortgageeClass = new MortgageeClass();
    this.collapsed = false;
    if (this.propertyParent instanceof PolicyClass) {
      this.propertyParent.addMortgagee(mort as MortgageeClass);
    } else if (this.propertyParent instanceof PropertyQuoteClass){
      this.propertyParent.addMortgagee(mort as MortgageeClass);
    }
  }
}
