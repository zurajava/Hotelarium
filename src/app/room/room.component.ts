import { BranchService } from './../branch/branch.service';
import { RoomService } from './room.service';
import { Component, Injectable, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { NgForm, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Room } from './model';

import { Observable } from 'rxjs/Rx';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { AuthService } from './../core/auth.service';


@Component({
  moduleId: module.id,
  selector: 'parking-register',
  templateUrl: 'room.html',
  styleUrls: ['./room.scss']
})

export class RoomComponent implements OnInit {

  public view: GridDataResult;
  public data: Object[];
  public items: Room[];

  public formGroup: FormGroup;
  public editedRowIndex: number;

  public pageSize: number = 10;
  public skip: number = 0;

  public userOrganisation: Array<any>;
  public orgSelectedValue: number;

  public userBranch: Array<any>;
  public brSelectedValue: number;

  constructor(private roomService: RoomService, public toastr: ToastsManager, vcr: ViewContainerRef, private router: Router, private authservice: AuthService) {
    this.toastr.setRootViewContainerRef(vcr);
    

  }

  ngOnInit() {
    this.roomService.getUserOrganisation(this.authservice.getUserID()).subscribe(data => {
      this.userOrganisation = data.json().organisation;
      this.orgSelectedValue = this.userOrganisation[0].id

      this.roomService.getUserBranch(this.authservice.getUserID(), this.orgSelectedValue).subscribe(data => {

        this.userBranch = data.json().branch;
        this.brSelectedValue = this.userBranch[0].id

        this.loadData(this.brSelectedValue);
      });
    });
  }
  public orgValueChange(value: any): void {
    this.orgSelectedValue = value;
    this.roomService.getUserBranch(this.authservice.getUserID(), this.orgSelectedValue).subscribe(data => {
      this.userBranch = data.json().branch;
      this.brSelectedValue = this.userBranch[0].id
      this.loadData(this.brSelectedValue);
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
    this.formGroup = new FormGroup({
      'room_no': new FormControl("", Validators.required),
      'name': new FormControl("", Validators.required),
      'price': new FormControl("", Validators.required),
      'currency': new FormControl("", Validators.required),
      'description': new FormControl()
    });
    sender.addRow(this.formGroup);
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    this.formGroup = new FormGroup({
      'id': new FormControl(dataItem.id),
      'room_no': new FormControl(dataItem.room_no),
      'name': new FormControl(dataItem.name, Validators.required),
      'price': new FormControl(dataItem.price, Validators.required),
      'currency': new FormControl(dataItem.currency, Validators.required),
      'description': new FormControl(dataItem.description)
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
    const product: Room = formGroup.value;
    console.log(product);
    product.branch_id = this.brSelectedValue.toString();
    if (isNew) {
      this.roomService.addRoom(product).subscribe(data => {
        sender.closeRow(rowIndex);
        this.loadData(this.brSelectedValue);
        this.toastr.success("Branch Added");
      });
    } else {
      this.roomService.editRoom(product).subscribe(data => {
        sender.closeRow(rowIndex);
        this.loadData(this.brSelectedValue);
        this.toastr.success("Branch Edited");
      });
    }
  }

  public removeHandler({ dataItem }) {
    this.roomService.deleteRoom(dataItem.id).subscribe(data => {
      this.loadData(this.brSelectedValue);
    });
  }
  public loadData(branch_id: number) {
    this.roomService.getRoom(branch_id).subscribe(data => {
      this.items = data.json().room;
      this.view = {
        data: this.items.slice(this.skip, this.skip + this.pageSize),
        total: this.items.length
      };
    });
  }



}