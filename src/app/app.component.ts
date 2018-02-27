import { AuthService } from './core/auth.service';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { CategoryService } from './category/category.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  roleID: any;
  user_name: any;
  subscription: Subscription;
  isLoggedIn: boolean;
  public userBranch: Array<any>;
  public brSelectedValue: number;

  constructor(private categoryService: CategoryService, private authservice: AuthService) {
    this.getRoleID();
    this.getUserName();
    this.isUserLogdIn();
    this.subscription = authservice.userLoggedIn$.subscribe(
      data => {
        this.getRoleID();
        this.getUserName();
        this.isUserLogdIn();
        if (this.isLoggedIn) {
          this.loadBranchLis();
        }
      });
    if (this.isLoggedIn) {
      this.loadBranchLis();
    }
  }
  loadBranchLis() {
    this.categoryService.getUserBranch(this.authservice.getUserID()).subscribe(data => {
      if (data.json().success === true) {
        this.userBranch = data.json().branch;
        this.brSelectedValue = this.userBranch[0].id;
        this.authservice.setBranchId(this.brSelectedValue);
        this.authservice.sendMessage(this.brSelectedValue);
      }
    });
  }
  getRoleID() {
    this.roleID = this.authservice.getRoleID();

  }
  getUserName() {
    this.user_name = this.authservice.getUserName();

  }
  isUserLogdIn() {
    this.isLoggedIn = this.authservice.getIsLoggedIn();

  }
  public brValueChange(value: any): void {
    console.log("brValueChange", value);
    this.brSelectedValue = value;
    this.authservice.sendMessage(this.brSelectedValue);
  }
}
