import { BranchService } from './branch.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Component, ViewContainerRef, OnInit } from '@angular/core';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { Router, RouterModule } from '@angular/router';

import { Observable } from 'rxjs/Rx';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Branch } from './model';
import { AuthService } from './../core/auth.service';

@Component({
  moduleId: module.id,
  selector: 'parking-viewOwner',
  templateUrl: 'branch.html',
  styleUrls: ['./branch.scss']
})
export class BranchComponent implements OnInit {
  public items: Branch[];
  public selectedBranch: Branch;
  public btnText: string;

  public userOrganisation: Array<any>;
  public orgSelectedValue: number;

  constructor(private branchService: BranchService, public toastr: ToastsManager, vcr: ViewContainerRef, private router: Router, private authservice: AuthService) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.btnText = "ADD";
    this.selectedBranch = new Branch('', '', '', '', '');
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

  public loadData(org_id: number) {
    this.branchService.getBranch(org_id).subscribe(data => {
      if (data.json().success === true) {
        this.items = data.json().branch;
      } else {
        this.toastr.error(data.json().message);
      }
    });
  }

  public editBranch(category: Branch) {
    this.btnText = "Update";
    this.selectedBranch = category;
  }
  public deleteBranch(category: Branch) {
    this.branchService.deleteBranch(category.id).subscribe(data => {
      this.loadData(this.orgSelectedValue);
    });
  }
  public saveBranch() {
    this.selectedBranch.org_id = this.orgSelectedValue.toString();
    if (this.selectedBranch.name == null || this.selectedBranch.name.length <= 0) {
      this.toastr.error("Name is required");
      return;
    }
    if (this.btnText == "ADD") {
      this.branchService.addBranch(this.selectedBranch).subscribe(data => {
        this.loadData(this.orgSelectedValue);
        this.toastr.success("Branch Added");
      });
    } else if (this.btnText == "Update") {
      this.branchService.editBranch(this.selectedBranch).subscribe(data => {
        this.loadData(this.orgSelectedValue);
        this.toastr.success("Branch Edited");
      });
    }
  }
  public resetBranch() {
    this.btnText = "ADD";
    this.selectedBranch = new Branch('', '', '', '', '');
  }
}