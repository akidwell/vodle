import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { faAngleUp, faStar as faSolidStar} from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog/confirmation-dialog.service';
import { InsuredContact } from '../../models/insured-contact';
import { InsuredService } from '../../services/insured-service/insured.service';
import { InsuredContactClass } from '../../classes/insured-contact-class';

@Component({
  selector: 'rsps-insured-contact',
  templateUrl: './insured-contact.component.html',
  styleUrls: ['./insured-contact.component.css'],
})
export class InsuredContactComponent {
  canEditInsured = false;
  authSub: Subscription;
  faArrowUp = faAngleUp;
  deleteSub!: Subscription;
  faSolidStar = faSolidStar;
  faStar = faStar;
  isHover = false;
  contacts: InsuredContact[] = [];

  @Input() contact!: InsuredContactClass;
  @Input() insuredContacts: InsuredContactClass[] = [];
  @Input() index!: number;
  @Input() canDrag = false;
  @Output() copyExistingContact: EventEmitter<InsuredContactClass> = new EventEmitter();
  @Output() deleteThisContact: EventEmitter<InsuredContactClass> = new EventEmitter();
  @Output() setPrimaryContact: EventEmitter<InsuredContactClass> = new EventEmitter();

  constructor(
    private userAuth: UserAuth,
    private insuredService: InsuredService,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    this.authSub = this.userAuth.canEditInsured$.subscribe(
      (canEditInsured: boolean) => {
        this.canEditInsured = canEditInsured;
      }
    );
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    this.deleteSub?.unsubscribe();
  }

  copyContact(): void {
    this.copyExistingContact.emit(this.contact);
  }

  openDeleteConfirmation() {
    this.confirmationDialogService
      .open(
        'Delete Confirmation',
        'Are you sure you want to delete this contact?'
      )
      .then((result: boolean) => {
        if (result) {
          this.deleteContact();
        }
      });
  }

  async deleteContact() {
    if (this.contact.isNew) {
      setTimeout(() => {
        this.deleteThisContact.emit(this.contact);
      });
    } else {
      this.deleteSub = this.insuredService
        .deleteInsuredContact(this.contact)
        .subscribe((result) => {
          setTimeout(() => {
            this.deleteThisContact.emit(this.contact);
          });
          return result;
        });
    }
  }

  setPrimary(contact: InsuredContactClass) {
    if (this.canEditInsured && !this.canDrag) {
      this.setPrimaryContact.emit(this.contact);
      contact.isPrimary = true;
    }
  }

  public get canRemove(): boolean {
    return (
      this.contact.isNew &&
      this.canEditInsured &&
      (!this.contact.isPrimary || this.insuredContacts.length == 1)
    );
  }
  public get canDelete(): boolean {
    return (
      !this.contact.isNew &&
      this.canEditInsured &&
      ((!this.contact.isPrimaryTracked && !this.contact.isPrimary) ||
        this.insuredContacts.length == 1)
    );
  }
}
