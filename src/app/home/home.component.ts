import { HttpErrorResponse } from '@angular/common/http';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['../app.component.css','./home.component.css']
})
export class HomeComponent implements OnInit {
  error!: HttpErrorResponse ;
  errorMessage: string = '';

  constructor() { }

  ngOnInit(): void {
  }


  throwHttpError() {
    throw new HttpErrorResponse({ error: 'server error', status: 403 })
    
  }
  throwClientError() {
    this.errorMessage = 'client error'
    throw Error("client error")
    
  }

  onDismissError() {
    this.errorMessage = "";
  }
}
