import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'src/app/core/authorization/auth.service';
import { UserAuth } from 'src/app/core/authorization/user-auth';


@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private userAuth: UserAuth) { }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    console.log(await this.authService.isAuthenticated());
    console.log(this.userAuth.canEditInsured);
    return await this.authService.isAuthenticated();// && this.userAuth.canEditSubmission;
  }

}
