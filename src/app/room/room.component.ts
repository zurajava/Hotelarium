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

const formGroup = dataItem => {
  var smoke;
  if (dataItem.smoke === 'YES') {
    smoke = true;
  } else {
    smoke = false;
  }
  var wifi;
  if (dataItem.wifi === 'YES') {
    wifi = true;
  } else {
    wifi = false;
  }

  return new FormGroup({
    'id': new FormControl(dataItem.id),
    'room_no': new FormControl(dataItem.room_no),
    'category_name': new FormControl(dataItem.category_id, Validators.required),
    'price': new FormControl(dataItem.price, Validators.required),
    'currency': new FormControl(dataItem.currency, Validators.required),
    'smoke': new FormControl(smoke),
    'wifi': new FormControl(wifi),
    'tag': new FormControl(dataItem.tag),
    'description': new FormControl(dataItem.description)
  })
};


@Component({
  moduleId: module.id,
  selector: 'parking-register',
  templateUrl: 'room.html',
  styleUrls: ['./room.scss']
})

export class RoomComponent implements OnInit {

  public currencys: any[] = [{
    "currencyId": "GEL",
    "currencyName": "GEL"
  },
  {
    "currencyId": "USD",
    "currencyName": "USD"
  },
  {
    "currencyId": "EUR",
    "currencyName": "EUR"
  }];

  public room_category: any[];

  public view: GridDataResult;
  public data: Object[];
  public items: Room[];

  public formGroup: FormGroup;
  public editedRowIndex: number;

  public pageSize: number = 10;
  public skip: number = 0;

  public userBranch: Array<any>;
  public brSelectedValue: number;

  constructor(private roomService: RoomService, public toastr: ToastsManager, vcr: ViewContainerRef, private router: Router, private authservice: AuthService) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.roomService.getUserBranch(this.authservice.getUserID()).subscribe(data => {
      this.userBranch = data.json().branch;
      this.brSelectedValue = this.userBranch[0].id
      this.roomService.getCategory(this.brSelectedValue).subscribe(data => {
        this.room_category = data.json().category;
        this.loadData(this.brSelectedValue);
      });

    });
  }
  public category(id: number): any {
    return this.currencys.find(x => x.currencyId === id);
  }
  public category_id(id: number): any {
    return this.room_category.find(x => x.name === id);
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
      'room_no': "",
      'category_name': "",
      'price': 0,
      'currency': "",
      'smoke': true,
      'wifi': true,
      'tag': "",
      'description': "",
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
    const room: Room = formGroup.value;
    console.log(room);
    room.branch_id = this.brSelectedValue.toString();
    if (isNew) {
      this.roomService.addRoom(room).subscribe(data => {
        sender.closeRow(rowIndex);
        this.loadData(this.brSelectedValue);
        this.toastr.success("Room Added");
      });
    } else {
      this.roomService.editRoom(room).subscribe(data => {
        sender.closeRow(rowIndex);
        this.loadData(this.brSelectedValue);
        this.toastr.success("Room Edited");
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