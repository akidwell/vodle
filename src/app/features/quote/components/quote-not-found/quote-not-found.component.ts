import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  template: `<div class='error-message'>
    <h1>Quote Not Found!</h1>
    <h4>{{errorMessage}}</h4>
    </div>`,
  styleUrls: ['../../../../app.component.css']
})
export class QuoteNotFoundComponent {
  errorMessage = '';

  constructor(private router: Router) {
    this.errorMessage = this.router.getCurrentNavigation()?.extras.state?.error;
  }
}
