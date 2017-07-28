import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceComponent } from './service.component';
import { ServiceRoutingModule } from './service-routing.module';
import { ServiceService } from './service.service';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';


@NgModule({
  imports: [
    CommonModule, ServiceRoutingModule,BrowserModule, BrowserAnimationsModule, GridModule, DropDownsModule
  ],
  declarations: [ServiceComponent],
  providers: [ServiceService]
})
export class ServiceModule {

}
