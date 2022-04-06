import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NavigationConfirmationComponent } from '../../components/navigation-confirmation/navigation-confirmation.component';

@Injectable({
  providedIn: 'root'
})
export class NavigationConfirmationService {

  constructor(private modalService: NgbModal) { }

  public async open(): Promise<boolean> {

    const result = await this.modalService.open(NavigationConfirmationComponent, { backdrop: 'static' }).result.then((result) => {
      if (result == 'Yes') {
        return true;
      }
      return false;
    });;
    return result;
  }
}
