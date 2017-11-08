import { Component, Injectable, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AuthService } from './../core/auth.service';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})


export class DashboardComponent implements OnInit {
  public userBranch: Array<any>;
  public brSelectedValue: number;

  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels: string[] = [];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;
  public barChartData: any[] = [
    { data: [], label: 'Reservations' }
  ];
  constructor(private dashboardService: DashboardService, public toastr: ToastsManager, vcr: ViewContainerRef, private router: Router, private authservice: AuthService) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.dashboardService.getUserBranch(this.authservice.getUserID()).then(data => {
      console.log("ngOnInit");
      if (data.success === true) {
        this.userBranch = data.branch;
        this.brSelectedValue = this.userBranch[0].id
        this.dashboardService.getStatistic(this.brSelectedValue.toString()).then(data => {
          var dataTemp = data.data;
          for (var i = 0; i < dataTemp.length; i++) {
            this.barChartLabels[i] = dataTemp[i].date;
            this.barChartData[0].data[i] = dataTemp[i].count;
          }
          this.barChartData = this.barChartData.slice();
          console.log("ngOnInit", JSON.stringify(this.barChartLabels), JSON.stringify(this.barChartData));
        });
      } else {
        this.toastr.error(data.message);
      }
    });
  }
  public brValueChange(value: any): void {
    this.brSelectedValue = value;
    // TO DO
  }
  public chartClicked(e: any): void {
    console.log(e);
    this.barChartData = this.barChartData.slice();
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
}
