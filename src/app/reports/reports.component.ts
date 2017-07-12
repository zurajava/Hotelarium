import { ReportsService } from './reports.service';


import { ToastModule, ToastsManager } from 'ng2-toastr/ng2-toastr';

import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router,RouterModule } from '@angular/router';
import { NgForm } from '@angular/forms';

import * as moment from 'moment';
import {NgbModal, ModalDismissReasons,NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

@Component({
    moduleId:module.id,
    selector:'parking-amenitiesRequest',
    templateUrl: 'reports.html',
    styleUrls: ['./reports.scss']
})

export class ReportsComponent implements OnInit {
      searchString:any = 'BJWXX6U7B';
      requestDetails:any = [];
      private modalRef: NgbModalRef;
        constructor(public toastr: ToastsManager,vcr: ViewContainerRef,private amenitiesrequestservice:ReportsService,private modalService: NgbModal) {
  this.toastr.setRootViewContainerRef(vcr);
        }

        ngOnInit() {
         this.getRequestDetails();
        }

        getRequestDetails() {
          this.amenitiesrequestservice.requestDetails()
          .subscribe(
            res => {
              this.requestDetails = res.data
            },
            error => {
              this.toastr.error(error.message);
            }
          )
        }

    
}