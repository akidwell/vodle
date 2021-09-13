import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'zipCode'
})
export class ZipCodePipe implements PipeTransform {

  transform(val: string | null): string {
    if (val != null) {
      if (val.length >= 9)
        return val.toString().slice(0, 5) + "-" + val.toString().slice(5);
      else
        return val;
    } else {
      return "";
    }
  }
}