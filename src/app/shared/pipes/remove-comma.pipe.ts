import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeComma'
})
export class RemoveCommaPipe implements PipeTransform {

  transform(val: string | null): string {
    if (val != null) {
      // here we just remove the commas from value
      return val.toString().replace(/,/g, '');
    } else {
      return '';
    }
  }
}