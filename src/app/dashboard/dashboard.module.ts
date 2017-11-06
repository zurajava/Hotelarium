import { NgModule } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from './../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

@NgModule({
  imports: [DashboardRoutingModule, SharedModule, BrowserModule, BrowserAnimationsModule, GridModule, DropDownsModule],
  declarations: [DashboardComponent],
  providers: [DashboardService]
})
export class DashboardModule {

}
