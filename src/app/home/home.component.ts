import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DirectPolicyCreateComponent } from './direct-policy/direct-policy-create/direct-policy-create.component';
import { DirectPolicyServiceService } from './direct-policy/direct-policy-service/direct-policy-service.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['../app.component.css','./home.component.css']
})
export class HomeComponent implements OnInit {
  collapsePanelSubscription!: Subscription;

  constructor(private router: Router,private route: ActivatedRoute,private directPolicyServiceService: DirectPolicyServiceService) {
    // this.collapsePanelSubscription = this.directPolicyServiceService.collapseEndorsementLocationsObservable$.subscribe(() => {
    //   console.log("Direct");
    //   this.directPolicyComponent.open();
    // });


   }

  ngOnInit(): void {
   

   

    // this.route.data.subscribe( c => {
    //   if (c.test){
    //     this.createQuote();
    //   }});
    // if (this.router.data.saveComponent){
    //   this.createQuote();
    // }
   // if (this.route.parent?.data.saveComponent)
  }


  ngOnDestroy(): void {
    this.collapsePanelSubscription.unsubscribe();
  }

  @ViewChild('modal') private directPolicyComponent!: DirectPolicyCreateComponent

  createQuote() {
    var result = this.directPolicyComponent.open();
  }
}
