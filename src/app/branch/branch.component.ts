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

  public userBranch: Array<any>;
  public branchSelectedValue: number;

  constructor(private branchService: BranchService, public toastr: ToastsManager, vcr: ViewContainerRef, private router: Router) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.loadData();
    this.branchService.getUserBranch('4').subscribe(data => {
      this.userBranch = data.json().branch;
      this.branchSelectedValue = this.userBranch[0].id;
    });;
    this.branchService.getUserOrganisation('4').subscribe(data => {
      this.userOrganisation = data.json().organisation;
      this.orgSelectedValue = this.userOrganisation[0].id
    });;
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
      'org_id': new FormControl("", Validators.required)
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
      'org_id': new FormControl(dataItem.org_id, Validators.required)
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
    if (isNew) {
      this.branchService.addBranch(product).subscribe(data => {
        sender.closeRow(rowIndex);
        this.loadData();
        this.toastr.success("Branch Added");
      });
    } else {
      this.branchService.editBranch(product).subscribe(data => {
        sender.closeRow(rowIndex);
        this.loadData();
        this.toastr.success("Branch Edited");
      });
    }
  }

  public removeHandler({ dataItem }) {
    this.branchService.deleteBranch(dataItem.id).subscribe(data => {
      this.loadData();
    });
  }
  public loadData() {
    this.branchService.getBranch().subscribe(data => {
      this.items = data.json().branch;
      this.view = {
        data: this.items.slice(this.skip, this.skip + this.pageSize),
        total: this.items.length
      };
    });
  }
}