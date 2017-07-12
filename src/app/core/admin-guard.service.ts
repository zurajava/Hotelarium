import { AuthService } from './auth.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private authservice: AuthService,private router : Router) {}
 
    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      
        let status =  this.authservice.getRoleID();// === 'ADMIN';
            if(status === 'ADMIN') {
                return true;
            }else if(status === 'RESIDENT'){
                return true;
            }else{
                return false;
            }
            //else {
            //   this.router.navigate(['reservation'])
            // }
    }
}