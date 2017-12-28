import { AuthService } from './core/auth.service';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  roleID: any;
  user_name: any;
  subscription: Subscription;
  toggleState = false;
  constructor(private authservice: AuthService) {
    this.getRoleID();
    this.getUserName();
    this.subscription = authservice.userLoggedIn$.subscribe(
      data => {
        this.getRoleID();
        this.getUserName();
      });
  }

  getRoleID() {
    this.roleID = this.authservice.getRoleID();

  }
  getUserName() {
    this.user_name = this.authservice.getUserName();

  }
}
