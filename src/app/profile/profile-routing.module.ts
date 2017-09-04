import { AdminGuard } from './../core/admin-guard.service';
import { Router, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../auth-guard.service';
import { ProfileComponent } from './profile.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard, AdminGuard], data: { roles: ['ADMIN', 'RESIDENT'] } }
    ])],
    exports: [RouterModule]
})
export class ProfileRoutingModule {


}

