import { Injectable } from '@angular/core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root'
})
export abstract class ComponentBase {
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  canEdit = false;
}
