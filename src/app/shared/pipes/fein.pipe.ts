import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fein'
})
export class FeinPipe implements PipeTransform {

  transform(val: string | null): string {
    if (val != null) {
      if (val.length > 2)
        return val.toString().slice(0, 2) + '-' + val.toString().slice(2);
      else
        return val;
    } else {
      return '';
    }
  }
}