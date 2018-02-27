import { Component, Injectable, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AuthService } from './../core/auth.service';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  moduleId: module.id,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})


export class DashboardComponent implements OnInit, OnDestroy {
  subscription: Subscription;
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
    this.brSelectedValue = this.authservice.getBranchId();
    if (!this.brSelectedValue) {
      this.subscription = this.authservice.getMessage().subscribe(message => {
        this.brSelectedValue = message
        this.dashboardService.getStatistic(this.brSelectedValue.toString()).then(data => {
          var dataTemp = data.data;
          if (dataTemp) {
            for (var i = 0; i < dataTemp.length; i++) {
              this.barChartLabels[i] = dataTemp[i].date;
              this.barChartData[0].data[i] = dataTemp[i].count;
            }
            this.barChartData = this.barChartData.slice();
          }
        });
      });
    } else {
      this.dashboardService.getStatistic(this.brSelectedValue.toString()).then(data => {
        var dataTemp = data.data;
        if (dataTemp) {
          for (var i = 0; i < dataTemp.length; i++) {
            this.barChartLabels[i] = dataTemp[i].date;
            this.barChartData[0].data[i] = dataTemp[i].count;
          }
          this.barChartData = this.barChartData.slice();
        }
      });
    }

  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  public chartClicked(e: any): void {
    this.barChartData = this.barChartData.slice();
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
}
