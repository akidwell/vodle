/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Directive, ElementRef, forwardRef, HostListener, Input } from '@angular/core';
import { Log } from '../decorators/logger';
import { ValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { Validation } from '../interfaces/validation';

@Directive({
  selector: '[validate-on-change]'
})
export class ValidateOnChangeDirective {
  @Input() validateLevel: ValidationTypeEnum = ValidationTypeEnum.Quote;
  @Input() fullValidate = false;
  @Input() markDirty = true;

  constructor(protected el: ElementRef, public pageDataService: PageDataService) { }

  // @HostListener('input', ['$event'])
  // @Log({type: 'log'})
  // change(event: any) {
  //   console.log('change event: ', event);
  //   this.updateData('change',this.validateLevel, this.fullValidate, this.markDirty);
  // }
  @HostListener('ngModelChange', ['$event'])
  @Log({type: 'log'})
  ngModelChange(event: any) {
    this.updateData('change',this.validateLevel, this.fullValidate, this.markDirty);
  }
  @HostListener('blur', ['$event.target'])
  @Log({type: 'log'})
  onLeaveEvent(target: HTMLInputElement) {
    if (!target.readOnly) {
      this.updateData('leave',this.validateLevel, this.fullValidate, this.markDirty);
    }
  }

  // @HostListener('focus', ['$event.target'])
  // @Log({type: 'log'})
  // onEnterEvent(target: HTMLInputElement) {
  //   // Convert Parenthesis to minus sign
  //   if (!target.readOnly && target.value.charAt(0) === '(') {
  //     this.el.nativeElement.value = '-' + target.value.replace(/[^,0-9.]+/g, '');
  //   }
  // }

  updateData(event: string, type: ValidationTypeEnum, fullValidate: boolean, markDirty: boolean) {
    let dataObject: Validation | null = null;
    switch (type) {
    case ValidationTypeEnum.Quote:
      dataObject = (this.pageDataService.selectedProgram && this.pageDataService.selectedProgram.quoteData) ? this.pageDataService.selectedProgram.quoteData : null;
      break;
    case ValidationTypeEnum.Department:
      dataObject = (this.pageDataService.quoteData) ? this.pageDataService.quoteData : null;
      break;
    default:
      break;
    }
    if (dataObject) {
      if (markDirty) {
        dataObject.markDirty ? dataObject.markDirty() : null;
      }
      if (event === 'leave' && fullValidate){
        dataObject.validate ? dataObject.validate() : null;
      }
    }
  }
  //public onChange = (_: any) => {};
  public onTouch = () => {};
  public onNgModelChange = (_: any) => {};

  // public registerOnChange(fn: any): void {
  //   this.onChange = fn;
  // }

  public registerOnNgChange(fn: any): void {
    this.onNgModelChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
