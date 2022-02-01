import { Injectable } from "@angular/core";
import { HttpInterceptor,HttpRequest, HttpEvent, HttpHandler } from "@angular/common/http";
import { Observable } from "rxjs";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private jwtHelper: JwtHelperService){};

    intercept(req: HttpRequest<any>,
              next: HttpHandler): Observable<HttpEvent<any>> {
        const idToken = localStorage.getItem("jwt_token");
        if (idToken && this.isTokenValid(idToken)) {
            const cloned = req.clone({
                headers: req.headers.set("Authorization",
                    "Bearer " + idToken)
            });
            return next.handle(cloned);
        }
        else {
            return next.handle(req);
        }
    }

    isTokenValid(token : string | null): boolean {
      if (token == null) {
        return false;
      }
      const expirationDate = this.jwtHelper.getTokenExpirationDate(token);
      if (expirationDate != null && expirationDate > new Date()) {
        return true;
      } else {
        return false;
      }
    }
}
