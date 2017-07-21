import { Component, Injectable, ViewContainerRef, Output, EventEmitter, OnInit } from '@angular/core';
import { PersonsService } from './persons.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/observable/of';

@Component({
  moduleId: module.id,
  selector: 'app-persons',
  templateUrl: './persons.html',
  styleUrls: ['./persons.scss']
})
export class PersonsComponent implements OnInit {
  private selected: any;

  constructor(private personService: PersonsService, public toastr: ToastsManager, vcr: ViewContainerRef, public http: Http) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {

  }
  observableSource = (keyword: any): Observable<any[]> => {
    if (keyword) {
      this.personService.getUsers('Test')
        .subscribe(res => {
          console.log(res);
          console.log(res.users);
          return res.users;

        },
        error => {
          return Observable.of([]);
        }
        )

    } else {
      return Observable.of([]);
    }
  }

}
