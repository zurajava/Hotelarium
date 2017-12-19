import { AdminGuard } from './../core/admin-guard.service';
import { SalesComponent } from './sales.component';
import { AuthGuard } from './../auth-guard.service';


import { NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';



@NgModule({
    imports: [RouterModule.forChild([
        { path: 'sales', component: SalesComponent, canActivate: [AuthGuard, AdminGuard], data: { roles: ['ADMIN', 'RESIDENT'] } }
    ])],
    exports: [RouterModule]
})

export class SalesRouting {

}