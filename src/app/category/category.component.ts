import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { CategoryService } from './category.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router, RouterModule } from '@angular/router';

import { Observable } from 'rxjs/Rx';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Category } from './model.js';
import { AuthService } from './../core/auth.service';

const formGroup = dataItem => {
  var parking;
  if (dataItem.parking === 'YES') {
    parking = true;
  } else {
    parking = false;
  }
  return new FormGroup({
    'id': new FormControl(dataItem.id),
    'name': new FormControl(dataItem.name, Validators.required),
    'description': new FormControl(dataItem.description),
    'parking': new FormControl(parking)
  })
};


@Component({
  moduleId: module.id,
  selector: 'app-category',
  templateUrl: './category.html',
  styleUrls: ['./category.scss']
})
export class CategoryComponent implements OnInit {

  public view: GridDataResult;
  public data: Object[];
  public items: Category[];

  public formGroup: FormGroup;
  public editedRowIndex: number;

  public pageSize: number = 10;
  public skip: number = 0;

  public userBranch: Array<any>;
  public brSelectedValue: number;

  constructor(private categoryService: CategoryService, public toastr: ToastsManager, vcr: ViewContainerRef, private router: Router, private authservice: AuthService) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {

    this.categoryService.getUserBranch(this.authservice.getUserID()).subscribe(data => {
      if (data.json().success === true) {
        this.userBranch = data.json().branch;
        this.brSelectedValue = this.userBranch[0].id
        this.loadData(this.brSelectedValue);
      } else {
        this.toastr.error(data.json().message);
      }
    });


  }
  public brValueChange(value: any): void {
    this.brSelectedValue = value;
    this.loadData(this.brSelectedValue);
  }
  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.view = {
      data: this.items.slice(this.skip, this.skip + this.pageSize),
      total: this.items.length
    };
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.formGroup = formGroup({
      'name': "",
      'description': "",
      'parking': 'YES'
    });
    sender.addRow(this.formGroup);
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    this.formGroup = formGroup(dataItem);
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.formGroup);
  }
  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }) {
    const product: Category = formGroup.value;
    console.log(product);
    product.branch_id = this.brSelectedValue.toString();
    if (isNew) {
      this.categoryService.addCategory(product).subscribe(data => {
        sender.closeRow(rowIndex);
        this.loadData(this.brSelectedValue);
        this.toastr.success("Category Added");
      });
    } else {
      this.categoryService.editCategory(product).subscribe(data => {
        sender.closeRow(rowIndex);
        this.loadData(this.brSelectedValue);
        this.toastr.success("Category Edited");
      });
    }
  }

  public removeHandler({ dataItem }) {
    this.categoryService.deleteCategory(dataItem.id).subscribe(data => {
      this.loadData(this.brSelectedValue);
    });
  }
  public loadData(branch_id: number) {
    this.categoryService.getCategory(branch_id).subscribe(data => {
      this.items = data.json().category;
      this.view = {
        data: this.items.slice(this.skip, this.skip + this.pageSize),
        total: this.items.length
      };
    });
  }
}
