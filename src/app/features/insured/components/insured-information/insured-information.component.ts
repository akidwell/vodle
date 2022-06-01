import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { insuredANI } from 'src/app/shared/components/additional-named-insured/additional-named-insured';
import { SharedAdditionalNamedInsuredsGroupComponent } from 'src/app/shared/components/additional-named-insured/additional-named-insureds-group/additional-named-insureds-group.component';
import { Insured } from '../../models/insured';
import { InsuredContact } from '../../models/insured-contact';
import { newInsuredDupeRequst } from '../../models/insured-dupe-request';
import { InsuredService } from '../../services/insured-service/insured.service';
import { PreviousRouteService } from '../../services/previous-route/previous-route.service';
import { InsuredAccountComponent } from '../insured-account/insured-account.component';
import { InsuredContactGroupComponent } from '../insured-contact-group/insured-contact-group.component';
import { InsuredDuplicatesComponent } from '../insured-duplicates/insured-duplicates.component';

@Component({
  selector: 'rsps-insured-information',
  templateUrl: './insured-information.component.html',
  styleUrls: ['./insured-information.component.css']
})
export class InsuredInformationComponent implements OnInit {
  insured!: Insured;
  contacts: InsuredContact[] = [];
  aniInsuredData: insuredANI[] = [];
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
      const position = previousUrl.lastIndexOf('/') + 1;
      this.previousLabel = 'Previous - ' + previousUrl.substring(position,position + 1).toUpperCase() + previousUrl.substring(position + 1, previousUrl.length);
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
    return this.accountInfoComp.accountInfoForm.status == 'VALID' && this.contactComp.isValid() && this.aniComp.isValid() && this.adddressValid();
  }

  private adddressValid() {
    return this.insured.isAddressOverride || this.insured.addressVerifiedDate != null;
  }

  isDirty(): boolean {
    return this.canEditInsured && (this.accountInfoComp?.isDirty() || this.contactComp?.isDirty() || this.aniComp?.isDirty());
  }

  async save(): Promise<void> {
    let save: boolean | null = true;

    const refresh = this.insured.isNew;
    if (this.insured.isNew && this.isValid()) {
      save = await this.checkDuplicates();
    }
    if (save) {
      this.showBusy = true;
      await this.saveInsured();
      this.showBusy = false;
      if (refresh && this.insured.insuredCode !== null) {
        this.router.navigate(['/insured/' + this.insured.insuredCode?.toString() + '/information']);
      }
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
          .then(async insured => {
            this.insured = insured;
            this.insured.isNew = false;
            this.markClean();
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
      else {
        if (this.isDirty()) {
          const results$ = this.insuredService.updateInsured(this.insured);
          return await lastValueFrom(results$)
            .then(async insured => {
              this.insured = insured;
              this.insured.isNew = false;
              this.markClean();
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

  public markClean() {
    this.accountInfoComp.markClean();
    if (this.aniComp.components != null) {
      for (const child of this.aniComp.components) {
        child.aniForm.form.markAsPristine();
        child.aniForm.form.markAsUntouched();
      }
    }
    if (this.contactComp.components != null) {
      for (const child of this.contactComp.components) {
        child.contactForm.form.markAsPristine();
        child.contactForm.form.markAsUntouched();
      }
    }
  }

  showInvalidControls(): void {
    const invalid = [];

    // Check each control in account information component if it is valid
    const accountControls = this.accountInfoComp.accountInfoForm.controls;
    for (const name in accountControls) {
      if (accountControls[name].invalid) {
        invalid.push(name);
      }
    }

    // Loop through each child component to see it any of them have invalid controls
    if (this.aniComp.components != null) {
      for (const child of this.aniComp.components) {
        for (const name in child.aniForm.controls) {
          if (child.aniForm.controls[name].invalid) {
            invalid.push(name + ' - ANI: #' + child.aniData.sequenceNo.toString());
          }
        }
      }
    }
    if (this.contactComp.components != null) {
      for (const child of this.contactComp.components) {
        for (const name in child.contactForm.controls) {
          if (child.contactForm.controls[name].invalid) {
            invalid.push(name + ' - Contact: #' + (child.index + 1));
          }
        }
      }
    }

    if (this.contactComp.hasDuplicates()) {
      const name = this.contactComp.getDuplicateName();
      invalid.push('Contact ' + name + ' is duplicated');
    }
    if (!this.adddressValid()) {
      invalid.push('Address not Verified');
    }

    this.invalidMessage = '';
    // Compile all invalide controls in a list
    if (invalid.length > 0) {
      this.showInvalid = true;
      for (const error of invalid) {
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
