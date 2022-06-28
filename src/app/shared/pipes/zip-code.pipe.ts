import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'zipCode',
})
export class ZipCodePipe implements PipeTransform {
  transform(val: string | null): string {
    const letterPattern = /^[a-zA-Z]+$/;
    val = val?.replace(' ', '') ?? '';
    if (val != null && val.length > 0) {
      if (val[0].match(letterPattern)) {
        return this.parseCAN(val);
      } else {
        return this.parseUSA(val);
      }
    }
    return '';
  }

  private parseUSA(val: string): string {
    let newvalue = '';
    //  Make sure no letters
    val.split('').forEach((letter) => {
      if (!isNaN(+letter)) {
        newvalue = newvalue + letter;
      }
    });
    // Format
    if (newvalue.length > 5) {
      return newvalue.toString().slice(0, 5) + '-' + newvalue.toString().slice(5, 9);
    } else {
      return newvalue;
    }
  }

  private parseCAN(val: string): string {
    let newvalue = '';
    let counter = 1;
    // Check that correct combination of letters and numbers
    val.split('').forEach((letter) => {
      if (counter % 2 == 0) {
        if (!isNaN(+letter)) {
          newvalue = newvalue + letter;
          counter++;
        }
      } else {
        if (isNaN(+letter)) {
          newvalue = newvalue + letter;
          counter++;
        }
      }
    });
    if (newvalue.length > 3) {
      return (
        newvalue.toString().toUpperCase().slice(0, 3) +
        ' ' +
        newvalue.toString().toUpperCase().slice(3, 6)
      );
    } else {
      return newvalue.toUpperCase();
    }
  }
}
