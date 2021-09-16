import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  template: `<div class='content'>
    <h1>Policy Not Found!</h1>
    <h2>{{errorMessage}}</h2>
    </div>`,
  styleUrls: ['../app.component.css']
})
export class PolicyNotFoundComponent {
  errorMessage: string = "";

  constructor(private router: Router) {
    this.errorMessage = this.router.getCurrentNavigation()?.extras.state?.error;
  }
}
