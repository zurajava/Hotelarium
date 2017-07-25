import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { CategoryService } from './category.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router, RouterModule } from '@angular/router';



@Component({
  moduleId: module.id,
  selector: 'app-category',
  templateUrl: './category.html',
  styleUrls: ['./category.scss']
})
export class CategoryComponent implements OnInit {

  constructor(private viewownerservice: CategoryService, public toastr: ToastsManager, vcr: ViewContainerRef, private router: Router) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
  }

}
