import { AdminGuard } from './../core/admin-guard.service';
import { Router, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../auth-guard.service';
import { UsersComponent } from './users.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: 'usermanagment', component: UsersComponent, canActivate: [AuthGuard, AdminGuard], data: { roles: ['ADMIN', 'RESIDENT'] } }
    ])],
    exports: [RouterModule]
})
export class UserRoutingModule {


}

