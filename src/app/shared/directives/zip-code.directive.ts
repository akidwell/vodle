import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';
import { ZipCodePipe } from '../pipes/zip-code.pipe';

@Directive({
  selector: '[zip-code]',
})
export class ZipCodeDirective {

  constructor(
    protected el: ElementRef,
    protected control: NgControl,
    private zipPipe: ZipCodePipe
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.control.value != null) {
        this.el.nativeElement.value = this.zipPipe.transform(this.control.value.toString());
      }
    });
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const numberPattern = /^[0-9]\d*$/;
    const pattern = /^[a-zA-Z0-9]+$/;

    if (event.ctrlKey && (event.key === 'C' || event.key === 'V')) {
      return true;
    } else if (
      event.key === 'Tab' ||
      event.key === 'Backspace' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight' ||
      event.key === 'Delete'
    ) {
      return true;
    } else if (!event.key.match(pattern)){
      return false;
    }

    // Prevent typing once max length is reached
    if (this.el.nativeElement.value.replaceAll('-', '').replaceAll(' ', '').match(numberPattern)) {
      if (this.el.nativeElement.selectionStart >= 10) {
        return false;
      }
      return true;
    } else if (!this.el.nativeElement.value.replaceAll('-', '').replaceAll(' ', '').match(numberPattern)) {
      if (this.el.nativeElement.selectionStart >= 7) {
        return false;
      }
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  @HostListener('input', ['$event'])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  change(event: { target: any }) {
    const original = event.target.value;
    const target = event.target;
    const posStart = target.selectionStart;
    const posEnd = target.selectionEnd;
    const usBeforeLength = target.value.toString().split('-').length - 1;
    const canBeforeLength = target.value.toString().split(' ').length - 1;
    target.value = this.zipPipe.transform(
      target.value.toString().replaceAll('-', '').replaceAll(' ', '')
    );
    const usLength = target.value.toString().split('-').length - 1;
    const canLength = target.value.toString().split(' ').length - 1;
    let offset = usLength - usBeforeLength + (canLength - canBeforeLength);

    // Handle offset around dash or space
    if (original.indexOf('-') < target.value.indexOf('-') && posStart == 5) {
      offset = 0;
    }
    if (original.indexOf(' ') < target.value.indexOf(' ') && posStart == 3) {
      offset = 0;
    }
    // Handle position to auto adjust for dash or space
    target.selectionStart = +posStart + (posStart + offset < 0 ? 0 : offset);
    target.selectionEnd = +posEnd + (posEnd + offset < 0 ? 0 : offset);

    // If value changed then force update
    if (target.value != original) {
      this.control.reset(target.value);
    }
    this.control.viewToModelUpdate(
      target.value === '' ? null : target.value.toString().replaceAll('-', '')
    );
  }
}