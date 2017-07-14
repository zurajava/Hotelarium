import { AdminGuard } from './../core/admin-guard.service';
import { ReportsComponent } from './reports.component';
import { AuthGuard } from './../auth-guard.service';


import { NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';



@NgModule({
    imports: [RouterModule.forChild([
        { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard, AdminGuard], data: { roles: ['GUEST'] } }
    ])],
    exports: [RouterModule]
})

export class amenitiesRequestRouting {

}