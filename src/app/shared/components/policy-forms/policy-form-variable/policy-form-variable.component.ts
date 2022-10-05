import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { lastValueFrom } from 'rxjs';
import { PolicyFormsService } from '../services/policy-forms.service';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import { PolicyFormClass } from 'src/app/shared/classes/policy-form-class';
import { newVariableFormRequest } from '../services/variable-form-request';
import { VariableColumnData } from '../services/variable-column-data';
import { QuoteClass } from 'src/app/features/quote/classes/quote-class';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';

@Component({
  selector: 'rsps-policy-form-variable',
  templateUrl: './policy-form-variable.component.html',
  styleUrls: ['./policy-form-variable.component.css']
})
export class PolicyFormVariableComponent {
  private modalRef!: NgbModalRef;
  formName!: string;
  formHTML: string | SafeHtml = '';
  columnData: VariableColumnData[] | null = [];
  hasGuideline = false;
  form!: PolicyFormClass;
  quote!: QuoteClass;
  isFormatting = false;
  showBusy = false;
  totalCount = 0;
  populatedCount = 0;

  @Input() canEdit = false;
  @ViewChild('modal') private modalContent!: TemplateRef<PolicyFormVariableComponent>;

  constructor(private messageDialogService: MessageDialogService, private modalService: NgbModal, private policyFormsService: PolicyFormsService, private sanitizer: DomSanitizer) { }

  async open(form: PolicyFormClass, quote: QuoteClass): Promise<boolean> {
    this.formName = form.formName ?? '';
    this.quote = quote;
    this.form = form;
    this.showBusy = true;
    await this.checkGuideline(this.formName);
    const isLoaded = await this.populateHTML(this.formName);
    if (!isLoaded) {
      return false;
    }
    return new Promise<boolean>(resolve => {
      this.modalRef = this.modalService.open(this.modalContent, { scrollable: true, backdrop: 'static', size: 'xl' });
      this.modalRef.result.then(resolve, resolve);
      return true;
    });
  }

  private async checkGuideline(formName: string) {
    const response$ = this.policyFormsService.hasGuideline(formName);
    await lastValueFrom(response$)
      .then(guideline => {
        this.hasGuideline = guideline;
      });
  }

  private async populateHTML(formName: string) {
    const request = newVariableFormRequest();
    request.companycode = this.quote.submission.companyCode ?? 3;
    request.businessUnit = '*';
    request.departmentCode = this.quote.submission.departmentCode?.toString() ?? '*';
    request.effectiveDate = this.quote.policyEffectiveDate;
    request.formName = formName;
    request.pacCode = this.quote.pacCode;
    request.programId = this.quote.programId;
    request.underwriterId = this.quote.submission.underwriter?.toString() ?? '*';
    request.producerCode = this.quote.submission.producerCode;
    request.formData = this.form.formData;

    const response$ = this.policyFormsService.getVariable(request);
    return await lastValueFrom(response$)
      .then(result => {
        if (result) {
          new Blob([result], { type: 'application/html', }).text().then(html => {
            this.formHTML = this.sanitizer.bypassSecurityTrustHtml(html);
          });
          return true;
        }
        return false;
      })
      .catch((error) => {
        this.showBusy = false;
        const message = String.fromCharCode.apply(null, new Uint8Array(error.error) as any);
        this.messageDialogService.open('Variable Form Error', message);
        return false;
      });
  }

  async formatField(element: HTMLInputElement) {
    const columnTypeRegex = /columnType="([0-9a-z]+)"/gi;
    const formatRegex = /format="([0-9a-z]+)"/gi;
    const columnType = columnTypeRegex.exec(element.outerHTML);
    const format = formatRegex.exec(element.outerHTML);
    if (format && columnType) {
      this.isFormatting = true;
      const response$ = this.policyFormsService.getVariableFormattedValue(element.value, format[1], columnType[1]);
      await lastValueFrom(response$)
        .then(formattedValue => {
          if (formattedValue) {
            element.value = formattedValue;
          }
        });
      this.isFormatting = false;
    }
    this.totalCount = 0;
    this.populatedCount = 0;
    this.form.formData?.map(c => {
      const element = document.getElementById(c.name) as HTMLInputElement | null;
      if (element) {
        this.totalCount++;
        if (element.value !== ''){
          this.populatedCount++;
        }
      }
    });
  }

  save() {
    this.form.formData?.map(c => {
      const element = document.getElementById(c.name) as HTMLInputElement | null;
      if (element) {
        c.value = element.value;
      }
    });

    this.form.markDirty();
    this.close();
  }

  close() {
    this.form.formData?.map(c => {
      const element = document.getElementById(c.name) as HTMLInputElement | null;
      if (element) {
        element.removeEventListener('blur',this.formatField.bind(this, element));
      }
    });
    this.formHTML = '';
    this.modalRef.close(false);
  }

  cancel() {
    this.close();
  }

  async showGuideline() {
    const response$ = this.policyFormsService.getGuideline(this.formName);
    await lastValueFrom(response$)
      .then(guideline => {
        if (guideline) {
          const file = new Blob([guideline], { type: 'application/pdf', });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        }
      });
  }

  onDomChange() {
    this.totalCount = 0;
    this.populatedCount = 0;
    this.form.formData?.map(c => {
      const element = document.getElementById(c.name) as HTMLInputElement | null;
      if (element) {
        this.totalCount++;
        element.addEventListener('blur',this.formatField.bind(this, element));
        if (element.value !== ''){
          this.populatedCount++;
        }
      }
    });
    this.showBusy = false;
  }
}
