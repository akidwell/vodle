import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faE, faEdit, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { HeaderPaddingService } from 'src/app/core/services/header-padding-service/header-padding.service';
import { QuoteClass } from 'src/app/features/quote/classes/quote-class';
import { QuoteWarrantiesClass } from 'src/app/features/quote/classes/quote-warranties-class';
import { QuoteSavingService } from 'src/app/features/quote/services/quote-saving-service/quote-saving-service.service';
import { WarrantiesClass } from 'src/app/shared/classes/warranties-class';
import { WarrantyTypeView } from 'src/app/core/enums/form-view-type';
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
  faEdit = faEdit;
  showExpiring = false;
  //expiringFormsLoading = false;
  //expiringForms: EndorsementSubjectivityData[] | null = null;
  currentView = WarrantyTypeView.OnPolicy;
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
  userDefinedInfo: WarrantiesClass = ({}) as WarrantiesClass;
  editWarranty: WarrantiesClass = ({}) as WarrantiesClass;
  desc = '';
  warrantyOfs = '';
  userWarranty = '';
  sectionHeaderList: WarrantiesClass[] = [];
  mainHeaderList: WarrantiesClass[] = [];
  addedWarrantyOf = '';

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
    // Just want the distinct warrantyOfs to display in that dropdown
    this.optionalWarranties = this._optionalWarranties.filter((item,i,arr) => arr.findIndex((x) => (x.warrantyOf === item.warrantyOf)) === i);
  }

  ngOnDestroy() {
    this.saveSub?.unsubscribe();
  }

  public get viewType(): typeof WarrantyTypeView {
    return WarrantyTypeView;
  }

  /**
   * Updates `filteredWarranties` and warranty counts.
   * Called whenever user filters by warranty type or when a warranty is edited or added.
   * @param currentView Optionally supply a new view to filter on.
   */
  refreshWarranties(currentView?: WarrantyTypeView) {
    if (typeof currentView !== "undefined") {
      this.currentView = currentView;
    }

    // Filter warranties based on view selection
    switch (this.currentView) {
      case WarrantyTypeView.Available:
        this.filteredWarranties = [...this.warranties];
        break;
      case WarrantyTypeView.Optional:
        this.filteredWarranties = this.warranties.filter(w => !w.ysnDefault);
        break;
      case WarrantyTypeView.Mandatory:
        this.filteredWarranties = this.warranties.filter(w => w.ysnDefault);
        break;
      case WarrantyTypeView.OnPolicy:
        this.filteredWarranties = this.warranties.filter(w => w.isIncluded);
        break;
      default: break;
    }

    this.filteredWarranties.sort((a, b) =>
      // Alphabetically by warranty type
      (a.warrantyOf.localeCompare(b.warrantyOf, undefined, {sensitivity: 'base'})) ||
      // Alphabetically by section, with null headers first
      (a.sectionHeader == null ? -1 : a.sectionHeader.localeCompare(b.sectionHeader)));

    // determine if it's the first main header/ section header that way they're only displayed once, not repeated
    let fMainHeader : string | null = '';
    let fSectionHeader : string | null = '';

    // reset the firstrow flags
    this.warranties.map(
      x => {
        x.firstFilteredMainHeaderRow = false;
        x.firstFilteredSectionHeaderRow = false;
      }
    );

    for (const x of this.filteredWarranties) {
      if (x.mainHeader != fMainHeader) {
        x.firstFilteredMainHeaderRow = true;
        fMainHeader = x.mainHeader;
      }
      if (x.sectionHeader != fSectionHeader){
        x.firstFilteredSectionHeaderRow = !(!x.sectionHeader || x.sectionHeader.length === 0 );
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
    this.mandatoryWarrantiesCount = this.warranties.filter(c => c.ysnDefault).length;
    this.optionalWarrantiesCount = this.warranties.filter(c => !c.ysnDefault).length;
    this.onPolicyWarrantiesCount = this.warranties.filter(c => c.isIncluded).length;
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


  // Warranty isUserDefined
  //
  // Update New UNC Path for PeriodicProcess
  // UAT Issue
  // WaterMark in PremiumAdmin
  // THanks Everyone with testing sso
  // eSubmissions ->


  async editWarrantyPopup(sub: WarrantiesClass): Promise<void> {
    return new Promise<void>(resolve => {
      this.userDefinedInfo.warrantyOf = sub.warrantyOf ?? null;
      this.userDefinedInfo.mainHeader = sub.mainHeader;
      this.userDefinedInfo.sectionHeader = sub.sectionHeader ?? null;
      // this is to check if they are editing a preexisting userdefined warranty
      //if so we can use that warranty code to edit and just update the DB
      if (sub.isUserDefined){
        this.userDefinedInfo.warrantyCode = sub.warrantyCode;
      }
      // if not, we need to create a new warranty code because we can't edit existing/defined warranties
      // anything "edited" gets treated as a new user defined and a new userdefined will be saved to DB
      else {
        this.userDefinedInfo.warrantyCode = Math.max(...this.warranties.map(o => o.warrantyCode ?? 0)) + 1;
      }
      this.desc = sub.description ?? '';
      this.userDefinedInfo.isIncluded = true;
      this.userDefinedInfo.isUserDefined = true;
      this.modalRef = this.modalService.open(this.modalContent, { backdrop: 'static', centered: true });
      this.modalRef.result.then(resolve, resolve);
      sub.isIncluded = false;
    });
  }

  clearAndClose(): void {
    const newUserDefinedInfo: WarrantiesClass = ({}) as WarrantiesClass;
    this.userDefinedInfo = newUserDefinedInfo;
    this.desc = '';
    this.userDefinedInfo.description = null;
    this.userDefinedInfo.document = null;
    this.modalRef.close();
  }

  async submit(): Promise<void> {
    this.userDefinedInfo.description = this.desc;
    this.editWarranty = this.userDefinedInfo;
    this.editWarranty.isDirty = true;
    this.editWarranty.isIncluded = true;
    this.modalRef.close();
    this.desc = '';
    this.quote.warrantyData.push(new QuoteWarrantiesClass(this.editWarranty));
    // have to set to dirty after pushed due to abstract classes can't be instantiated
    // and don't want to set isDirty in the ExisitingInit Function as that is truly for what's from the DB
    const lastAdded = this.quote.warrantyData.length - 1;
    this.quote.warrantyData[lastAdded].isDirty = true;
    const newUserDefinedInfo: WarrantiesClass = ({}) as WarrantiesClass;
    this.editWarranty = newUserDefinedInfo;
    this.userDefinedInfo = newUserDefinedInfo;
    this.refreshWarranties();
  }

}
