import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  template: `<div class='error-message'>
    <h1>Policy Not Found!</h1>
    <h4>{{errorMessage}}</h4>
    </div>`,
  styleUrls: ['../../../../app.component.css']
})
export class PolicyNotFoundComponent {
  errorMessage: string = "";

  constructor(private router: Router) {
    this.errorMessage = this.router.getCurrentNavigation()?.extras.state?.error;
  }
}
