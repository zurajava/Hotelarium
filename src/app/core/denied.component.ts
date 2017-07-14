import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';


import { AuthService } from './auth.service';



@Component({
    moduleId: module.id,
    selector: 'app-parking-denied',
    templateUrl: './denied.html'
})

export class DeniedComponent implements OnInit {
    constructor(private router: Router, private authservice: AuthService) {
    }
    ngOnInit() {
      //  this.authservice.logout();
      //  this.router.navigate(['/login']);
      //  this.authservice.announceLogin();
    }
}