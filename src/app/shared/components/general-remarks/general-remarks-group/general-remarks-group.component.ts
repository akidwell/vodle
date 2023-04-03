import { Component, Input, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { HeaderPaddingService } from 'src/app/core/services/header-padding-service/header-padding.service';
import { deepClone } from 'src/app/core/utils/deep-clone';
import { ProgramClass } from 'src/app/features/quote/classes/program-class';
import { QuoteClass } from 'src/app/features/quote/classes/quote-class';
import { QuoteGeneralRemarksClass } from 'src/app/features/quote/classes/quote-general-remarks-class';
import { GeneralRemarksClass } from 'src/app/shared/classes/general-remarks-class';
import { SharedComponentBase } from 'src/app/shared/component-base/shared-component-base';

@Component({
  selector: 'rsps-general-remarks-group',
  templateUrl: './general-remarks-group.component.html',
  styleUrls: ['./general-remarks-group.component.css']
})
export class GeneralRemarksGroupComponent extends SharedComponentBase implements OnInit {

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

  private _generalRemarks!: GeneralRemarksClass[];

  constructor(
    userAuth: UserAuth,
    public headerPaddingService: HeaderPaddingService,
    private notification: NotificationService
  ) {
    super(userAuth);
  }
  @Input() public newremark!: GeneralRemarksClass;
  @Input() quote!: QuoteClass;
  @Input() submissionNumber!: number;
  @Input() quoteNumber!: number;

  @Input() set generalRemarks(value: GeneralRemarksClass[]) {
    this._generalRemarks = value;
  }
  get generalRemarks(): GeneralRemarksClass[] {
    return this._generalRemarks;
  }

  ngOnInit(): void {
    this.collapsed = false;
    this.handleSecurity(this.type);
  }
  isValid(): boolean {
    let valid = true;
    this.invalidList = [];
    this.generalRemarks?.forEach(c => {
      if (!c.isValid) {
        valid = false;
        this.invalidList = this.invalidList.concat(c.invalidList);
      }
    });
    return valid;
  }

  isDirty() {
    return this.generalRemarks?.some(item => item.isDirty);
  }

  hideInvalid(): void {
    this.showInvalid = false;
  }

  copyExisitingRemark(existingRemark: GeneralRemarksClass) {
    const clone = deepClone(existingRemark.toJSON());
    const newRemark = new QuoteGeneralRemarksClass(clone);
    newRemark.remark = clone.remark;
    newRemark.isDirty = true;
    newRemark.isNew = true;
    if (this.generalRemarks.length == 0) {
      newRemark.remarkId = 1;
      newRemark.sortSequence = 1;
    } else {
      newRemark.remarkId = Math.max(...this.generalRemarks.map(v => v.remarkId === null ? 0 : v.remarkId)) + 1;
      newRemark.sortSequence = newRemark.remarkId;
    }
    this.generalRemarks?.push(newRemark);
    const lastAdded = this.quote.generalRemarksData.length - 1;
    this.quote.generalRemarksData[lastAdded].isDirty = true;
  }


  deleteExistingRemark(existingRemark: GeneralRemarksClass) {
    const index = this.generalRemarks?.indexOf(existingRemark, 0);
    if (index > -1) {
      this.generalRemarks?.splice(index, 1);
      if (!existingRemark.isNew) {
        this.notification.show('Remark deleted.', { classname: 'bg-success text-light', delay: 5000 });
      }
    }
  }

  addNewRemark(): void {
    const newRemark = new QuoteGeneralRemarksClass();
    newRemark.isDirty = true;
    newRemark.isNew = true;
    newRemark.quoteId = this.quote.quoteId;
    if (this.generalRemarks.length == 0) {
      newRemark.remarkId = 1;
      newRemark.sortSequence = 1;
    } else {
      newRemark.remarkId = Math.max(...this.generalRemarks.map(v => v.remarkId === null ? 0 : v.remarkId)) + 1;
      newRemark.sortSequence = newRemark.remarkId;
    }
    this.quote.generalRemarksData?.push(newRemark);
    const lastAdded = this.quote.generalRemarksData.length - 1;
    this.quote.generalRemarksData[lastAdded].isDirty = true;
    this.collapsed = false;
  }
}
