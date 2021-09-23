import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { Code } from 'src/app/drop-downs/code';
import { DropDownsService } from 'src/app/drop-downs/drop-downs.service';
import { Endorsement } from '../../policy';

@Component({
  selector: 'rsps-endorsement-header',
  templateUrl: './endorsement-header.component.html',
  styleUrls: ['./endorsement-header.component.css']
})
export class EndorsementHeaderComponent implements OnInit {
  endorsement!: Endorsement;
  isReadOnly: boolean = false;
  canEditPolicy: boolean = false;
  authSub: Subscription;
  transactionTypes$: Observable<Code[]> | undefined;
  terrorismCodes$: Observable<Code[]> | undefined;

  constructor(private route: ActivatedRoute, private userAuth: UserAuth, private dropdowns: DropDownsService) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      console.log("Init");
      this.endorsement = data['endorsementData'].endorsement;
      console.log(this.endorsement);
    });

    this.transactionTypes$ = this.dropdowns.getTransactionTypes();
    this.terrorismCodes$ = this.dropdowns.getTerrorismCodes();
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  dropDownSearch(term: string, item: Code) {
    term = term.toLowerCase();
    return item.code.toLowerCase().indexOf(term) > -1 || item.description.toLowerCase() === term;
  }

}
