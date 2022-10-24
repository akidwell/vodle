import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faE, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { HeaderPaddingService } from 'src/app/core/services/header-padding-service/header-padding.service';
import { QuoteClass } from 'src/app/features/quote/classes/quote-class';
import { QuoteWarrantiesClass } from 'src/app/features/quote/classes/quote-warranties-class';
import { QuoteSavingService } from 'src/app/features/quote/services/quote-saving-service/quote-saving-service.service';
import { WarrantiesClass } from 'src/app/shared/classes/warranties-class';
import { SharedComponentBase } from 'src/app/shared/component-base/shared-component-base';

@Component({
  selector: 'rsps-warranties',
  templateUrl: './warranties.component.html',
  styleUrls: ['./warranties.component.css']
})
export class WarrantiesComponent extends SharedComponentBase implements OnInit {
  collapsed = true;
  filteredWarranties: WarrantiesClass[] = [];

  documentType: string[] = ['Quote', 'Binder','Both'];
  faExclamationTriangle = faExclamationTriangle;
  faCircleE = faE;
  faCircle = faCircle;
  showExpiring = false;
  //expiringFormsLoading = false;
  //expiringForms: EndorsementSubjectivityData[] | null = null;
  allWarrantiesCount = 0;
  mandatoryWarrantiesCount = 0;
  optionalWarrantiesCount = 0;
  onPolicyWarrantiesCount = 0;
  expiringWarrantiesCount = 0;
  isSaving = false;
  saveSub!: Subscription;
  private _warranties!: WarrantiesClass[];
  private _optionalWarranties: WarrantiesClass[] = [];
  private _addedWarranties: WarrantiesClass[] = [];



  @ViewChild(NgForm, { static: false }) userForm!: NgForm;
  @ViewChild('editModal') private modalContent!: TemplateRef<WarrantiesComponent>;
  @ViewChild('userModal') private modalContent2!: TemplateRef<WarrantiesComponent>;

  private modalRef!: NgbModalRef;
  userDefinedInfo: WarrantiesClass = ({} as any) as WarrantiesClass;
  editWarranty: WarrantiesClass = ({} as any) as WarrantiesClass;
  desc = '';
  warrantyOfs = '';
  userWarranty = '';
  sectionHeaderList: WarrantiesClass[] = [];
  mainHeaderList: WarrantiesClass[] = [];



  @Input() quote!: QuoteClass;
  @Input() submissionNumber!: number;
  @Input() quoteNumber!: number;
  @Input() set warranties(value: WarrantiesClass[]) {
    this._warranties = value;
    this.refreshWarranties();
  }
  get warranties(): WarrantiesClass[] {
    return this._warranties;
  }

  set optionalWarranties(value: WarrantiesClass[]) {
    this._optionalWarranties = value;
  }
  get optionalWarranties(): WarrantiesClass[] {
    return this._optionalWarranties;

  }

  get addedWarranties(){
    return this._addedWarranties;
  }
  set addedWarranties(value: WarrantiesClass[]) {
    this._addedWarranties = value;
  }

  constructor(
    userAuth: UserAuth,
    public headerPaddingService: HeaderPaddingService,
    private quoteSavingService: QuoteSavingService,
    public modalService: NgbModal
  ) {
    super(userAuth);
  }

  ngOnInit(): void {
    this.saveSub = this.quoteSavingService.isSaving$.subscribe(
      (isSaving) => (this.isSaving = isSaving)
    );
    this._warranties.map(x => {
      if (!x.ysnDefault || !x.isIncluded){
        this.optionalWarranties.push(x);
      }
    });

    //The warranty of dropdown list at the top of the card
    // Just want the distinct warrantys
    this.optionalWarranties = this._optionalWarranties.filter((item,i,arr) => arr.findIndex((x) => (x.warrantyOf === item.warrantyOf)) === i);

    //when we first display the list, only show those that are included and default
    this.filteredWarranties = this.warranties.filter(x => x.ysnDefault || x.isIncluded);
    //sort by the warranty of
    this.filteredWarranties.sort((x,y) => x.warrantyOf?.localeCompare(y.warrantyOf));

    // determine if it's the first main header/ section header that way they're only displayed once, not repeated
    let fMainHeader : string | null = '';
    let fSectionHeader : string | null = '';
    for (const x of this.filteredWarranties) {
      if (x.mainHeader != fMainHeader) {
        x.firstFilteredMainHeaderRow = true;
        fMainHeader = x.mainHeader;
      }
      if (x.sectionHeader != fSectionHeader){
        x.firstFilteredSectionHeaderRow = true;
        fSectionHeader = x.sectionHeader;
      }
    }

  }

  ngOnDestroy() {
    this.saveSub?.unsubscribe();
  }

  //this gets called any time you choose a warranty of the warranty list (optional warranties)
  // or anytime a warranty is edited/user defined warranty is added
  refreshWarranties() {
    // reget any warranties that were added
    this.filteredWarranties = this.warranties.filter(x => x.ysnDefault || x.isIncluded);
    console.log(this.filteredWarranties);
    // re add any warranties that were chosed from the warranty dropdown that could be unchecked
    this.addedWarranties.map(element => {
      this.filteredWarranties.push(element);
    });

    // sort by warranty of
    this.filteredWarranties = this.filteredWarranties.sort((x,y) => x.warrantyOf?.localeCompare(y.warrantyOf));

    // remove duplicates. the same warranty could be included
    // but could also be not included if in the list of "added warranties"
    this.filteredWarranties = Array.from(this.filteredWarranties.reduce((m, t) => m.set(t.warrantyCode, t), new Map()).values());

    // reset the firstrow flags
    this.filteredWarranties.map(
      x => {
        x.firstFilteredMainHeaderRow = false;
        x.firstFilteredSectionHeaderRow = false;
      }
    );

    // determine if it's the first main header/ section header that way they're only displayed once, not repeated
    console.log(this.filteredWarranties);
    let fMainHeader : string | null = '';
    let fSectionHeader : string | null = '';
    console.log(this.filteredWarranties);
    for (const x of this.filteredWarranties) {
      if (x.mainHeader != fMainHeader) {
        x.firstFilteredMainHeaderRow = true;
        fMainHeader = x.mainHeader;
      }
      if (x.sectionHeader != fSectionHeader){
        x.firstFilteredSectionHeaderRow = true;
        fSectionHeader = x.sectionHeader;
      }
    }
    this.setWarrantiesCount();
  }

  getDocumentType(item: WarrantiesClass){
    if(item.document == 'Q'){
      return 'Quote';
    } else if(item.document == 'B'){
      return 'Binder';
    } else {
      return 'Both';
    }
  }

  populateSectionHeaders(item : WarrantiesClass){
    this.sectionHeaderList = this.warranties.filter(x => x.warrantyOf == item.warrantyOf).filter((item,i,arr) => arr.findIndex((x) => (x.sectionHeader === item.sectionHeader)) === i);
  }

  setWarrantiesCount() {
    this.allWarrantiesCount = this.warranties.length;
    this.mandatoryWarrantiesCount = this.warranties.filter((c) => c.ysnDefault).length;
    this.optionalWarrantiesCount = this.warranties.filter((c) => !c.ysnDefault).length;
    this.onPolicyWarrantiesCount = this.warranties.filter((c) => c.isIncluded).length;
  }

  async userDefinedPopup(): Promise<void> {
    return new Promise<void>(resolve => {
      this.userDefinedInfo.warrantyCode = Math.max(...this.warranties.map(o => o.warrantyCode ?? 0)) + 1;
      this.userDefinedInfo.isIncluded = true;
      this.userDefinedInfo.description = this.desc;
      this.userDefinedInfo.isUserDefined = true;
      this.userDefinedInfo.isDirty = true;
      this.modalRef = this.modalService.open(this.modalContent2, { backdrop: 'static', centered: true });
      this.modalRef.result.then(resolve, resolve);
    });
  }

  async editWarrantyPopup(sub: WarrantiesClass): Promise<void> {
    return new Promise<void>(resolve => {
      this.userDefinedInfo.warrantyOf = sub.warrantyOf ?? null;
      this.userDefinedInfo.mainHeader = sub.mainHeader;
      this.userDefinedInfo.sectionHeader = sub.sectionHeader ?? null;
      this.userDefinedInfo.warrantyCode = Math.max(...this.warranties.map(o => o.warrantyCode ?? 0)) + 1;
      this.desc = sub.description ?? '';
      this.userDefinedInfo.isIncluded = true;
      this.userDefinedInfo.isDirty = true;
      this.userDefinedInfo.isUserDefined = true;
      this.modalRef = this.modalService.open(this.modalContent, { backdrop: 'static', centered: true });
      this.modalRef.result.then(resolve, resolve);
      sub.isIncluded = false;
      console.log(this.userDefinedInfo);
    });
  }

  addWarranties(sub: WarrantiesClass){
    this.addedWarranties = this.warranties.filter(x => x.warrantyOf == sub.warrantyOf);
    this.refreshWarranties();
  }
  clearAndClose(): void {
    const newUserDefinedInfo: WarrantiesClass = ({} as any) as WarrantiesClass;
    this.userDefinedInfo = newUserDefinedInfo;
    this.desc = '';
    this.userDefinedInfo.description = null;
    this.userDefinedInfo.document = null;
    this.modalRef.close();
  }

  async submit(): Promise<void> {
    console.log(this.userDefinedInfo);
    this.userDefinedInfo.description = this.desc;
    this.editWarranty = this.userDefinedInfo;
    console.log(this.editWarranty);
    this.modalRef.close();
    this.desc = '';
    this.quote.warrantyData.push(new QuoteWarrantiesClass(this.editWarranty));
    const newUserDefinedInfo: WarrantiesClass = ({} as any) as WarrantiesClass;
    this.editWarranty = newUserDefinedInfo;
    this.refreshWarranties();
  }

}
