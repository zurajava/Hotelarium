import { AdminGuard } from './../core/admin-guard.service';
import { RegisterComponent } from './room.component';
import { Router, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../auth-guard.service';
@NgModule({
    imports: [RouterModule.forChild([
        { path: 'createRoom', component: RegisterComponent, canActivate: [AuthGuard, AdminGuard], data: { roles: ['ADMIN'] } }
    ])],
    exports: [RouterModule]
})

export class RegisterRoomgModule {

}