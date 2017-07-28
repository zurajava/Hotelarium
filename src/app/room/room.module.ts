import { RoomService } from './room.service';
import { RoomComponent } from './room.component';
import { RoomRoutingModule } from './room-routing.module';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';


@NgModule({
    imports: [RoomRoutingModule, SharedModule, BrowserModule, BrowserAnimationsModule, GridModule, DropDownsModule],
    declarations: [RoomComponent],
    providers: [RoomService]
})

export class RoomModule {

}