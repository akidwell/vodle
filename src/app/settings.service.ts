import { Injectable } from '@angular/core';
import { ValidationErrors, AbstractControl } from '@angular/forms';

import { environment } from '../environments/environment';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private G: GlobalService;

  constructor() { }

  init(G:GlobalService) { 
    this.G = G; 
  }

  public get email(): string { return this.G.D.getu('email'); }
  public set email(value: string) { this.G.D.setu('email', value); }

  public get password(): string { return this.G.D.getu('password'); }
  public set password(value: string) { this.G.D.setu('password', value); }

  public get db(): string { return this.G.D.getu('db'); }
  public set db(value: string) { 
    this.G.D.setu('db', value); 
    this.set_db_credentials();
  }

  public get db_from_pid(): string { return this.G.D.getu('db_from_pid'); }
  public set db_from_pid(value: string) { 
    this.G.D.setu('db_from_pid', value); 
    this.set_db_credentials();
  }

  public get db_other_server_url(): string { return this.G.D.getu('db_other_server_url'); }
  public set db_other_server_url(value: string) { 
    this.G.D.setu('db_other_server_url', value); 
    this.set_db_credentials();
  }

  public get db_other_password(): string { return this.G.D.getu('db_other_password'); }
  public set db_other_password(value: string) { 
    this.G.D.setu('db_other_password', value); 
    this.set_db_credentials();
  }

  public get db_server_url(): string { return this.G.D.getu('db_server_url'); }
  private set db_server_url(value: string) { 
    // will be set automatically 
    this.G.D.setu('db_server_url', value); 
  }

  public get db_password(): string { return this.G.D.getu('db_password'); }
  private set db_password(value: string) { 
    // will be set automatically 
    this.G.D.setu('db_password', value); 
  }

  public get language(): string { return this.G.D.getu('language'); }
  public set language(value: string) { this.G.D.setu('language', value); }

  public get theme(): string { return this.G.D.getu('theme'); }
  public set theme(value: string) { this.G.D.setu('theme', value); }

  public password_regexp = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$';

  public passwords_match(control: AbstractControl): ValidationErrors | null {
    // password validation function to be used in forms
    if (control) {
      const password = control.get('password');
      const confirm_password = control.get('confirm_password');
      if (password.errors) {
        return (password.errors);
      }
      if (confirm_password.value !== password.value) {
        return ({must_match: true});
      }
    }
    return null;
  }
  
  // OTHER METHODS:

  public set_db_credentials() {
    // set db credentials according to this.db... settings:
    if (this.db=='central') {
      this.db_server_url = environment.data_service.central_db_server_url; 
      this.db_password = environment.data_service.central_db_password;
    } else if (this.db=='poll') {
      this.db_server_url = this.G.P.polls[this.db_from_pid].db_server_url;
      this.db_password = this.G.P.polls[this.db_from_pid].db_password;
    } else if (this.db=='other') {
      this.db_server_url = this.db_other_server_url;
      this.db_password = this.db_other_password;
    }
    this.db_server_url = this.G.D.fix_url(this.db_server_url);
  }

  // OTHER CONSTANTS:

  language_names = {
    de: 'Deutsch',
    en: 'English'
  };

  validation_messages = {
    email: [
      { type: 'required', message: 'validation.email-required' },
      { type: 'email', message: 'validation.email-valid' }
    ],
    password: [
      { type: 'required', message: 'validation.password-required' },
      { type: 'minlength', message: 'validation.password-length' },
      { type: 'pattern', message: 'validation.password-pattern' }
    ],
    passwords_match: [
      { message: 'validation.passwords-match' }
    ],
  };

}

/* TEMPLATE:

  public get (): string { return this.G.D.getu(''); }
  public set (value: string) { this.G.D.setu('', value); }
*/
