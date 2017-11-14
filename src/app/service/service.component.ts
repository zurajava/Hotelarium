import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ServiceService } from './service.service';

import { Observable } from 'rxjs/Rx';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Service } from './model';
import { AuthService } from './../core/auth.service';


@Component({
  selector: 'app-service',
  templateUrl: './service.html',
  styleUrls: ['./service.scss']
})
export class ServiceComponent implements OnInit {
  public type: any[] = [{
    "typeId": "DURATIONALL",
    "typeName": "DURATIONALL"
  },
  {
    "typeId": "QUANTITY",
    "typeName": "QUANTITY"
  }];
  public selectedService: Service;
  public btnText: string;

  public view: GridDataResult;
  public data: Object[];
  public items: Service[];

  public formGroup: FormGroup;
  public editedRowIndex: number;

  public pageSize: number = 10;
  public skip: number = 0;

  public userBranch: Array<any>;
  public brSelectedValue: number;

  constructor(private serviceService: ServiceService, public toastr: ToastsManager, vcr: ViewContainerRef, private router: Router, private authservice: AuthService) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.selectedService = new Service('', '', null, '');
    this.btnText = "ADD"
    this.serviceService.getUserBranch(this.authservice.getUserID()).subscribe(data => {
      if (data.json().success === true) {
        this.userBranch = data.json().branch;
        this.brSelectedValue = this.userBranch[0].id
        this.loadData(this.brSelectedValue);
      } else {
        this.toastr.error(data.json().message);
      }
    });
  }
  public category(id: number): any {
    return this.type.find(x => x.typeId === id);
  }
  public brValueChange(value: any): void {
    this.brSelectedValue = value;
    this.loadData(this.brSelectedValue);
  }

  public loadData(branch_id: number) {
    this.serviceService.getService(branch_id).subscribe(data => {
      if (data.json().success === true) {
        this.items = data.json().service;
      } else {
        this.toastr.error(data.json().message);
      }
    });
  }

  public editService(category: Service) {
    this.btnText = "Update";
    this.selectedService = category;
  }
  public deleteService(category: Service) {
    this.serviceService.deleteService(category.id).subscribe(data => {
      this.loadData(this.brSelectedValue);
    });
  }
  public saveService() {
    this.selectedService.branch_id = this.brSelectedValue.toString();
    if (this.btnText == "ADD") {
      this.serviceService.addService(this.selectedService).subscribe(data => {
        this.loadData(this.brSelectedValue);
        this.toastr.success("Branch Added");
      });
    } else if (this.btnText == "Update") {
      this.serviceService.editService(this.selectedService).subscribe(data => {
        this.loadData(this.brSelectedValue);
        this.toastr.success("Branch Edited");
      });
    }
  }
  public resetService() {
    this.btnText = "ADD";
    this.selectedService = new Service('', '', null, '');
  }

}
