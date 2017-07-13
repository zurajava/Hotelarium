import { ReservationComponent } from './reservation.component';
import { AdminGuard } from './../core/admin-guard.service';

import { AuthGuard } from './../auth-guard.service';


import { NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';



@NgModule({
    imports: [RouterModule.forChild([
        { path: 'reservation', component: ReservationComponent, canActivate: [AuthGuard, AdminGuard], data: { roles: ['ADMIN'] } }
    ])],
    exports: [RouterModule]
})

export class ReservationRouting {

}