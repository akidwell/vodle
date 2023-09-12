import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LimitsPatternHelperService {

  constructor() { }

  public parseLimitsPattern(limitsPattern: string, numberOfLimitsExpected: number): string {
    const limits: string[] = limitsPattern?.split('/') || [];
    if (limits.length != numberOfLimitsExpected) {
      console.warn('Incorrect count');
    }
    let newLimitsPattern: string = '';
    limits.forEach(limit => {
      if(limit.toLowerCase() == 'e' || limit.toLowerCase() == 'exclude'|| limit.toLowerCase() == 'excluded') {
        limit = 'Excluded';
      } else if (limit.toLowerCase() == 'i' || limit.toLowerCase() == 'include'|| limit.toLowerCase() == 'included') {
        limit = 'Included';
      } else if (!parseInt(limit)){
        limit = '0';
      } else if (parseInt(limit) < 100){
        limit = (parseInt(limit) * 1000000).toString();
      } else {
        limit = parseInt(limit).toString();
      }
      newLimitsPattern += limit + '/';
    });
    //remove trailing slash
    newLimitsPattern = newLimitsPattern.substring(0, newLimitsPattern.length - 1);
    return newLimitsPattern;
  }
}
