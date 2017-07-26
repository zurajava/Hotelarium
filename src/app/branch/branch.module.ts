import { NgModule } from '@angular/core';
import { BranchService } from './branch.service';
import { BranchComponent } from './branch.component';
import { SharedModule } from './../shared/shared.module';
import { BranchRoutingModule } from './branch-routing.module';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

@NgModule({
    imports: [BranchRoutingModule, SharedModule, BrowserModule, BrowserAnimationsModule, GridModule, DropDownsModule],
    declarations: [BranchComponent],
    providers: [BranchService]
})

export class BranchModule {

}