import { BranchService } from './branch.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Component, ViewContainerRef, OnInit } from '@angular/core';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { Router, RouterModule } from '@angular/router';

import { Observable } from 'rxjs/Rx';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Branch } from './model.js';
import { AuthService } from './../core/auth.service';

@Component({
  moduleId: module.id,
  selector: 'parking-viewOwner',
  templateUrl: 'branch.html',
  styleUrls: ['./branch.scss']
})
export class BranchComponent implements OnInit {

  public view: GridDataResult;
  public data: Object[];
  public items: Branch[];

  public formGroup: FormGroup;
  public editedRowIndex: number;

  public pageSize: number = 10;
  public skip: number = 0;

  public userOrganisation: Array<any>;
  public orgSelectedValue: number;

  constructor(private branchService: BranchService, public toastr: ToastsManager, vcr: ViewContainerRef, private router: Router, private authservice: AuthService) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.branchService.getUserOrganisation(this.authservice.getUserID()).subscribe(data => {
      if (data.json().success === true) {
        this.userOrganisation = data.json().organisation;
        this.orgSelectedValue = this.userOrganisation[0].id
        this.loadData(this.orgSelectedValue);
      } else {
        this.toastr.error(data.json().message);
      }
    });
  }
  public orgValueChange(value: any): void {
    this.orgSelectedValue = value;
    this.loadData(this.orgSelectedValue);
    console.log("orgValueChange", value + " : " + this.orgSelectedValue);
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
    this.formGroup = new FormGroup({
      'name': new FormControl("", Validators.required),
      'description': new FormControl(),
      'address': new FormControl("", Validators.required),
      'mail': new FormControl("", Validators.required),
      'phone': new FormControl("", Validators.required)
    });
    sender.addRow(this.formGroup);
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    this.formGroup = new FormGroup({
      'id': new FormControl(dataItem.id),
      'name': new FormControl(dataItem.name, Validators.required),
      'description': new FormControl(dataItem.description),
      'address': new FormControl(dataItem.address, Validators.required),
      'mail': new FormControl(dataItem.mail, Validators.required),
      'phone': new FormControl(dataItem.phone, Validators.required)
    });
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
    const product: Branch = formGroup.value;
    product.org_id = this.orgSelectedValue.toString();
    if (isNew) {
      this.branchService.addBranch(product).subscribe(data => {
        sender.closeRow(rowIndex);
        this.loadData(this.orgSelectedValue);
        this.toastr.success("Branch Added");
      });
    } else {
      this.branchService.editBranch(product).subscribe(data => {
        sender.closeRow(rowIndex);
        this.loadData(this.orgSelectedValue);
        this.toastr.success("Branch Edited");
      });
    }
  }

  public removeHandler({ dataItem }) {
    this.branchService.deleteBranch(dataItem.id).subscribe(data => {
      this.loadData(this.orgSelectedValue);
    });
  }
  public loadData(org_id: number) {
    this.branchService.getBranch(org_id).subscribe(data => {
      this.items = data.json().branch;
      this.view = {
        data: this.items.slice(this.skip, this.skip + this.pageSize),
        total: this.items.length
      };
    });
  }
}