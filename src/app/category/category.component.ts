import { Component, OnInit, ViewContainerRef, OnDestroy } from '@angular/core';
import { CategoryService } from './category.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Category } from './model';
import { AuthService } from './../core/auth.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  moduleId: module.id,
  selector: 'app-category',
  templateUrl: './category.html',
  styleUrls: ['./category.scss']
})
export class CategoryComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  public items: Category[];
  public selectedCategory: Category;
  public btnText: string;
  public brSelectedValue: number;

  constructor(private categoryService: CategoryService, public toastr: ToastsManager, vcr: ViewContainerRef, private router: Router, private authservice: AuthService) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.selectedCategory = new Category('', '', false);
    this.btnText = "ADD";
    this.brSelectedValue = this.authservice.getBranchId();
    if (!this.brSelectedValue) {
      this.subscription = this.authservice.getMessage().subscribe(message => {
        this.brSelectedValue = message;
        this.loadData(this.brSelectedValue);
      });
    } else {
      this.subscription = this.authservice.getMessage().subscribe(message => {
        this.loadData(message);
      }
      );
      this.loadData(this.brSelectedValue);
    }
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  public brValueChange(value: any): void {
    this.brSelectedValue = value;
    this.loadData(this.brSelectedValue);
  }

  public loadData(branch_id: number) {
    this.categoryService.getCategory(branch_id).subscribe(data => {
      if (data.json().success === true) {
        this.items = data.json().category;
        for (var i = 0; i < this.items.length; i++) {
          if (this.items[i].parking == 'YES') {
            this.items[i].parkingForm = true;
          } else {
            this.items[i].parkingForm = false;
          }
        }
      } else {
        this.items = [];
        this.toastr.error(data.json().message);
      }
    });
  }

  public editCategory(category: Category) {
    this.btnText = "Update";
    this.selectedCategory = category;
  }
  public deleteCategory(category: Category) {
    this.categoryService.deleteCategory(category.id, category.branch_id).subscribe(data => {
      this.loadData(this.brSelectedValue);
    });
  }
  public saveCategory() {
    this.selectedCategory.branch_id = this.brSelectedValue.toString();
    if (this.selectedCategory.parkingForm === true) {
      this.selectedCategory.parking = "YES";
    } else {
      this.selectedCategory.parking = "NO";
    }
    if (this.selectedCategory.name == null || this.selectedCategory.name.length <= 0) {
      this.toastr.error("Name is required");
      return;
    }
    if (this.btnText == "ADD") {
      this.categoryService.addCategory(this.selectedCategory).subscribe(data => {
        this.loadData(this.brSelectedValue);
        this.selectedCategory = new Category('', '', false);
        this.toastr.success("Category Added");
      });
    } else if (this.btnText == "Update") {
      this.categoryService.editCategory(this.selectedCategory).subscribe(data => {
        this.loadData(this.brSelectedValue);
        this.selectedCategory = new Category('', '', false);
        this.btnText = "ADD";
        this.toastr.success("Category Edited");
      });
    }
  }
  public resetCategory() {
    this.btnText = "ADD";
    this.selectedCategory = new Category('', '', false);
  }
}
