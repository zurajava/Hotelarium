import { ReservationService } from './reservation.service';
import { ReservationComponent } from './reservation.component';
import { ReservationRouting } from './reservation-routing.module';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { DatepickerModule } from 'ngx-bootstrap';


@NgModule({
    imports: [ SharedModule, ReservationRouting, ChartsModule, FormsModule, NgbModule, DatepickerModule.forRoot()],
    declarations: [ReservationComponent],
    providers: [ReservationService]
})

export class ReservationModule {

}