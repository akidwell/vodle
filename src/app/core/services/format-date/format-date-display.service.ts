import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class FormatDateForDisplay {

  public formatDateForDisplay(date: Date | moment.Moment | null) : string | null {
    let displayString: string | null;
    if (date == null) {
      return null;
    }
    if (moment.isMoment(date)){
      displayString = date.format('MM/DD/YYYY');
    } else {
      const datePipe = new DatePipe('en-US');
      displayString = datePipe.transform(date, 'MM/dd/yyyy');
    }
    return displayString;
  }

  public formatDateTimeForDisplay(date: Date | moment.Moment | null) : string | null {
    let displayString: string | null;
    if (date == null) {
      return null;
    }
    if (moment.isMoment(date)){
      displayString = date.format('MM/DD/YYYY hh:mm:ss a');
    } else {
      const datePipe = new DatePipe('en-US');
      displayString = datePipe.transform(date, 'MM/dd/yyyy hh:mm:ss a');
    }
    return displayString;
  }
}
