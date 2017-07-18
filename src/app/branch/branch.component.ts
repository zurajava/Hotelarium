import { BranchService } from './branch.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Component, ViewContainerRef, OnInit } from '@angular/core';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { Router, RouterModule } from '@angular/router';
@Component({
  moduleId: module.id,
  selector: 'parking-viewOwner',
  templateUrl: 'branch.html',
  styleUrls: ['./branch.scss']
})
export class BranchComponent implements OnInit {

  allOwnerDetails: any = [];

  constructor(private viewownerservice: BranchService, public toastr: ToastsManager, vcr: ViewContainerRef, private router: Router) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
  }


}