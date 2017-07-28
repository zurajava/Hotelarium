import { AdminGuard } from './../core/admin-guard.service';
import { RoomComponent } from './room.component';
import { Router, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../auth-guard.service';
@NgModule({
    imports: [RouterModule.forChild([
        { path: 'createRoom', component: RoomComponent, canActivate: [AuthGuard, AdminGuard], data: { roles: ['ADMIN', 'RESIDENT'] } }
    ])],
    exports: [RouterModule]
})

export class RoomRoutingModule {

}