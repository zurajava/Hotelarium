import { ReservationService } from './reservation.service';
import { ReservationComponent } from './reservation.component';
import { ReservationRouting } from './reservation-routing.module';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [ SharedModule, ReservationRouting, ChartsModule, FormsModule, NgbModule],
    declarations: [ReservationComponent],
    providers: [ReservationService]
})

export class ReservationModule {

}