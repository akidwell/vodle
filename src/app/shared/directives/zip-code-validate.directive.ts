import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, UntypedFormControl } from '@angular/forms';
import { ZipCodeCountry } from 'src/app/core/utils/zip-code-country';

@Directive({
  selector: 'input[zip-code]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => ZipCodeValidator), multi: true }
  ]
})
export class ZipCodeValidator {

  validate(c: UntypedFormControl) {
    if (!ZipCodeCountry(c.value?.toString())) {
      return {validateZipCode: {
        valid: false}
      };
    }
    return null;
  }
}