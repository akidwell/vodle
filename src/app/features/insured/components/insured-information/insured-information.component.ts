import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, lastValueFrom, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { insuredANI } from 'src/app/shared/components/additional-named-insured/additional-named-insured';
import { SharedAdditionalNamedInsuredsGroupComponent } from 'src/app/shared/components/additional-named-insured/additional-named-insureds-group/additional-named-insureds-group.component';
import { newInsuredDupeRequst } from '../../models/insured-dupe-request';
import { InsuredService } from '../../services/insured-service/insured.service';
import { PreviousRouteService } from '../../../../core/services/previous-route/previous-route.service';
import { InsuredAccountComponent } from '../insured-account/insured-account.component';
import { InsuredContactGroupComponent } from '../insured-contact-group/insured-contact-group.component';
import { InsuredDuplicatesComponent } from '../insured-duplicates/insured-duplicates.component';
import { InsuredClass } from '../../classes/insured-class';
import { deepClone } from 'src/app/core/utils/deep-clone';

@Component({
  selector: 'rsps-insured-information',
  templateUrl: './insured-information.component.html',
  styleUrls: ['./insured-information.component.css']
})
export class InsuredInformationComponent implements OnInit {
  insured!: InsuredClass;
  canEditInsured = false;
  newInsuredANI!: insuredANI;
  authSub: Subscription;
  addSub!: Subscription;
  updateSub!: Subscription;
  prevSub!: Subscription;
  showInvalid = false;
  invalidMessage = '';
  showBusy = false;
  previousUrl = '';
  previousLabel = 'Previous';

  // @Input() public insured!: InsuredClass;
  @ViewChild(SharedAdditionalNamedInsuredsGroupComponent) aniComp!: SharedAdditionalNamedInsuredsGroupComponent;
  @ViewChild(InsuredAccountComponent) accountInfoComp!: InsuredAccountComponent;
  @ViewChild(InsuredContactGroupComponent) contactComp!: InsuredContactGroupComponent;
  @ViewChild('modal') private dupeComponent!: InsuredDuplicatesComponent;

  constructor(private route: ActivatedRoute, private router: Router, private insuredService: InsuredService, private userAuth: UserAuth, private messageDialogService: MessageDialogService, private notification: NotificationService, private previousRouteService: PreviousRouteService) {
    this.authSub = this.userAuth.canEditInsured$.subscribe(
      (canEditInsured: boolean) => this.canEditInsured = canEditInsured
    );
    this.newInsuredANI = new insuredANI(this.insuredService);

    this.prevSub = this.previousRouteService.previousUrl$.subscribe((previousUrl: string) => {
      this.previousUrl = previousUrl;
      this.previousLabel = this.previousRouteService.getPreviousUrlFormatted();
    });
  }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.insured = data['insuredData'].insured;
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    this.addSub?.unsubscribe();
    this.updateSub?.unsubscribe();
    this.prevSub?.unsubscribe();
  }

  prev() {
    this.router.navigate([this.previousUrl]);
  }

  isValid(): boolean {
    if (!this.canEditInsured) {
      return true;
    }
    if (this.insured.isValid) {
      this.hideInvalid();
    }
    return this.insured.isValid;
  }

  isDirty(): boolean {
    return this.insured.isDirty;
  }

  async save(): Promise<void> {
    let save: boolean | null = true;
    if (this.insured.isNew && this.isValid()) {
      save = await this.checkDuplicates();
    }
    if (save) {
      this.showBusy = true;
      await this.saveInsured();
    }
    this.showBusy = false;
  }

  private async checkDuplicates(): Promise<boolean | null> {
    const dupe = newInsuredDupeRequst(this.insured);
    const results$ = this.insuredService.checkDuplicates(dupe);
    const results = await lastValueFrom(results$);

    if (results.length > 0) {
      if (this.dupeComponent != null) {
        return await this.dupeComponent.open(this.insured, results);
      }
    }
    return true;
  }

  async saveInsured(): Promise<boolean> {
    if (this.isValid()) {
      this.hideInvalid();
      if (this.insured.isNew) {
        const results$ = this.insuredService.addInsured(this.insured);
        return await lastValueFrom(results$)
          .then(async result => {
            this.insured.isNew = false;
            this.notification.show('Insured successfully saved.', { classname: 'bg-success text-light', delay: 5000 });
            this.showBusy = false;
            this.insured.markClean();
            this.router.navigate(['/insured/' + result.insuredCode?.toString() + '/information']);
            return true;
          },
          (error) => {
            this.notification.show('Insured Not Saved.', { classname: 'bg-danger text-light', delay: 5000 });
            const errorMessage = error.error?.Message ?? error.message;
            this.messageDialogService.open('Insured Save Error', errorMessage);
            return false;
          });
      }
      else {
        if (this.isDirty()) {
          const results$ = this.insuredService.updateInsured(this.insured);
          return await lastValueFrom(results$)
            .then(async insured => {
              this.insured.modifiedBy = insured.modifiedBy;
              this.insured.modifiedDate = insured.modifiedDate;
              this.insured.contacts = insured.contacts;
              this.insured.additionalNamedInsureds = insured.additionalNamedInsureds;
              this.insured.markClean();
              this.notification.show('Insured successfully saved.', { classname: 'bg-success text-light', delay: 5000 });
              return true;
            },
            (error) => {
              this.notification.show('Insured Not Saved.', { classname: 'bg-danger text-light', delay: 5000 });
              const errorMessage = error.error?.Message ?? error.message;
              this.messageDialogService.open('Insured Save Error', errorMessage);
              return false;
            });
        }
        return true;
      }
    }
    else {
      this.showInvalidControls();
      window.scroll(0, 0);
    }
    return false;
  }

  showInvalidControls(): void {
    this.invalidMessage = '';
    // Compile all invalid controls in a list
    if (this.insured.invalidList.length > 0) {
      this.showInvalid = true;
      for (const error of this.insured.invalidList) {
        this.invalidMessage += '<br><li>' + error;
      }
    }
    if (this.showInvalid) {
      this.invalidMessage = 'Following fields are invalid' + this.invalidMessage;
    }
    else {
      this.hideInvalid();
    }
  }

  hideInvalid(): void {
    this.showInvalid = false;
  }

}

