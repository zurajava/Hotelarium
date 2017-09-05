import { NgModule } from '@angular/core';
import { ReservationService } from './reservation.service';
import { ReservationComponent } from './reservation.component';
import { ReservationRouting } from './reservation-routing.module';
import { SharedModule } from './../shared/shared.module';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { IntlModule } from '@progress/kendo-angular-intl';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { HttpModule } from '@angular/http';
import { ComboBoxModule } from '@progress/kendo-angular-dropdowns';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DialogModule } from '@progress/kendo-angular-dialog';

@NgModule({
    imports: [NguiAutoCompleteModule, InputsModule, SharedModule, DialogModule, ReservationRouting, DropDownsModule, DropDownListModule, ChartsModule, FormsModule, NgbModule, BrowserModule, IntlModule, HttpModule, BrowserAnimationsModule, DateInputsModule, ButtonsModule, ComboBoxModule],
    declarations: [ReservationComponent],
    providers: [ReservationService]
})

export class ReservationModule {

}