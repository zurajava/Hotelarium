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
  public items: Room[];
  public selectedRoom: Room;
  public btnText: string;

  public room_category: any[];
  public dataCategory: any[];

  public userBranch: Array<any>;
  public brSelectedValue: number;

  constructor(private roomService: RoomService, public toastr: ToastsManager, vcr: ViewContainerRef, private router: Router, private authservice: AuthService) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.selectedRoom = new Room('', '', null, null, null, null, null, null, '', '', '');
    this.btnText = "ADD"
    this.roomService.getUserBranch(this.authservice.getUserID()).subscribe(data => {
      if (data.json().success === true) {
        this.userBranch = data.json().branch;
        this.brSelectedValue = this.userBranch[0].id
        this.roomService.getCategory(this.brSelectedValue).subscribe(data => {
          this.room_category = data.json().category;
          this.loadData(this.brSelectedValue);
        });
      } else {
        this.toastr.error(data.json().message);
      }


    });
  }
  public brValueChange(value: any): void {
    this.brSelectedValue = value;
    this.loadData(this.brSelectedValue);
  }
  public brCategoryValueChange(value: any): void {
    var priceValue;
  }
  public loadData(branch_id: number) {
    this.roomService.getRoom(branch_id).subscribe(data => {
      if (data.json().success === true) {
        this.items = data.json().room;
      } else {
        this.toastr.error(data.json().message);
      }
    });
  }

  public editRoom(category: Room) {
    this.btnText = "Update";
    this.selectedRoom = category;
  }
  public deleteRoom(category: Room) {
    this.roomService.deleteRoom(category.id).subscribe(data => {
      if (data.json().success === true) {
        this.loadData(this.brSelectedValue);
        this.toastr.success("Room delete");
      } else {
        this.toastr.error(data.json().message);
      }
    });
  }
  public saveRoom() { 
    this.selectedRoom.branch_id = this.brSelectedValue.toString();
    if (this.selectedRoom.room_no == null || this.selectedRoom.room_no.length <= 0) {
      this.toastr.error("room_no is required");
      return;
    }
    if (this.btnText == "ADD") { 
      this.roomService.addRoom(this.selectedRoom).subscribe(data => {
        if (data.json().success === true) {
          this.loadData(this.brSelectedValue);
          this.toastr.success("Room Added");
        } else {
          this.toastr.error(data.json().message);
        }
      });
    } else if (this.btnText == "Update") { 
      this.roomService.editRoom(this.selectedRoom).subscribe(data => {
        if (data.json().success === true) {
          this.loadData(this.brSelectedValue);
          this.toastr.success("Room Edited");
        } else {
          this.toastr.error(data.json().message);
        }
      });
    }
  }
  public resetRoom() {
    this.btnText = "ADD";
    this.selectedRoom = new Room('', '', null, null, null, null, null, null, '', '', '');
  }
}