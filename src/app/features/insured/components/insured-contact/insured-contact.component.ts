import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { faAngleUp, faStar as faSolidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { Code } from 'src/app/core/models/code';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { NgForm } from '@angular/forms';
import { AddressLookupService } from 'src/app/core/services/address-lookup/address-lookup.service';
import { PolicyService } from 'src/app/features/policy/services/policy/policy.service';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog/confirmation-dialog.service';
import { InsuredContact } from '../../models/insured-contact';
import { InsuredService } from '../../services/insured-service/insured.service';

@Component({
  selector: 'rsps-insured-contact',
  templateUrl: './insured-contact.component.html',
  styleUrls: ['./insured-contact.component.css']
})
export class InsuredContactComponent implements OnInit {
  canEditInsured: boolean = false;
  authSub: Subscription;
  collapsed: boolean = true;
  firstExpand: boolean = true;
  faArrowUp = faAngleUp;
  isLoadingAddress: boolean = false;
  states$: Observable<Code[]> | undefined;
  counties: string[] = [];
  deleteSub!: Subscription;
  addSub!: Subscription;
  updateSub!: Subscription;
  anchorId!: string;
  saveSub!: Subscription;
  faSolidStar = faSolidStar;
  faStar = faStar;
  isHover: boolean = false;

  @Input() contact!: InsuredContact;
  @Input() index!: number;
  @ViewChild(NgForm, { static: false }) contactForm!: NgForm;
  @Output() copyExistingContact: EventEmitter<InsuredContact> = new EventEmitter();
  @Output() deleteThisContact: EventEmitter<InsuredContact> = new EventEmitter();
  @Output() primaryContact: EventEmitter<InsuredContact> = new EventEmitter();

  constructor(private userAuth: UserAuth, private dropdowns: DropDownsService, private addressLookupService: AddressLookupService, private insuredService: InsuredService, private confirmationDialogService: ConfirmationDialogService) {
    this.authSub = this.userAuth.canEditInsured$.subscribe(
      (canEditInsured: boolean) => {
        this.canEditInsured = canEditInsured
      }
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    this.deleteSub?.unsubscribe();
    this.updateSub?.unsubscribe();
    this.addSub?.unsubscribe();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.contact.isNew) {
        this.contactForm.form.markAsDirty();
      }
    });
  }

  copyContact(): void {
    this.copyExistingContact.emit(this.contact);
  }

  openDeleteConfirmation() {
    this.confirmationDialogService.open("Delete Confirmation", "Are you sure you want to delete this contact?").then((result: boolean) => {
      if (result) {
        this.deleteLocation();
      }
    });
  }

  async deleteLocation() {
    if (this.contact.isNew) {
      this.deleteThisContact.emit(this.contact);
    } else {
      this.deleteSub = this.insuredService.deleteInsureContact(this.contact).subscribe(result => {
        this.deleteThisContact.emit(this.contact);
        return result;
      });
    }
  }

  async save(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.contact.isNew) {
        this.addSub = this.insuredService.addInsuredContact(this.contact).subscribe(result => {
          this.contact.isNew = false;
          this.contact.insuredCode = result.insuredCode;
          this.contactForm.form.markAsPristine();
          this.contactForm.form.markAsUntouched();
          resolve(true);
        });
      } else {
        this.updateSub = this.insuredService.updateInsuredContact(this.contact).subscribe(result => {
          this.contactForm.form.markAsPristine();
          this.contactForm.form.markAsUntouched();
          resolve(result);
        });
      }
    })
  }

  collapseExpand(event: boolean) {
    if (this.firstExpand) {
      this.states$ = this.dropdowns.getStates();
      this.firstExpand = false;
    }
    this.collapsed = event;
  }

  favorite(contact: InsuredContact) {
    this.primaryContact.emit(this.contact);
    this.contactForm.form.markAsDirty();
    contact.isPrimary = true;
  }
  unfavorite(contact: InsuredContact) {
   // contact.isPrimary = false;
  }

}
