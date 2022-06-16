import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { insuredANI } from 'src/app/shared/components/additional-named-insured/additional-named-insured';
import { SharedAdditionalNamedInsuredsGroupComponent } from 'src/app/shared/components/additional-named-insured/additional-named-insureds-group/additional-named-insureds-group.component';
import { InsuredService } from '../../services/insured-service/insured.service';
import { PreviousRouteService } from '../../../../core/services/previous-route/previous-route.service';
import { InsuredAccountComponent } from '../insured-account/insured-account.component';
import { InsuredContactGroupComponent } from '../insured-contact-group/insured-contact-group.component';
import { InsuredClass } from '../../classes/insured-class';

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

