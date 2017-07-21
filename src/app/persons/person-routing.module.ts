import { AdminGuard } from './../core/admin-guard.service';
import { Router, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../auth-guard.service';
import { PersonsComponent } from './persons.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: 'persons', component: PersonsComponent, canActivate: [AuthGuard, AdminGuard], data: { roles: ['ADMIN', 'RESIDENT', 'GUEST'] } }
    ])],
    exports: [RouterModule]
})
export class PersonRoutingModule {


}