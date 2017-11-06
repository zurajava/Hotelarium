import { AdminGuard } from './../core/admin-guard.service';
import { DashboardComponent } from './dashboard.component';
import { Router, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../auth-guard.service';


@NgModule({
    imports: [RouterModule.forChild([
        { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard, AdminGuard], data: { roles: ['ADMIN', 'RESIDENT'] } }
    ])],
    exports: [RouterModule]
})

export class DashboardRoutingModule {

}