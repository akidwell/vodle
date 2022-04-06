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
        const tokenRegEx = /\/userauth\/gettoken/gi;
        const versionRegEx = /\monitoring\/version/gi;
        //need to make sure /gettoken and /version are unsecured calls
        if (req.url.search(tokenRegEx) === -1 && req.url.search(versionRegEx) === -1 ) {
            const cloned = req.clone({
                headers: req.headers.set("Authorization",
                    "Bearer " + idToken)
            });
            return next.handle(cloned);
        }
        else {
          const cloned = req.clone({
            headers: req.headers.delete("Authorization")
              });
            return next.handle(cloned);
        }
    }
}
