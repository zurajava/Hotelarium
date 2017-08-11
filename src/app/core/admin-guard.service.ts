import { AuthService } from './auth.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private authservice: AuthService, private router: Router) { }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let roles = route.data["roles"] as Array<string>;
        let status = this.authservice.getRoleID();// === 'ADMIN';
        if (roles.includes(status)) {
            return true;
        } else {
            this.router.navigate(['denied']);
            return false;
        }

        /*  if (status === 'ADMIN') {
              return true;
          } else if (status === 'RESIDENT') {
              return true;
          } else if (status === 'GUEST') {
              return true;
          } else {
              return false;
          } */

        //else {
        //   this.router.navigate(['reservation'])
        // }
    }
}