import { AdminGuard } from './../core/admin-guard.service';
import { AuthGuard } from './../auth-guard.service';
import { editOwnerComponent } from './edit-branch.component';
import { Router, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
@NgModule({
    imports: [RouterModule.forChild([
        { path: 'editBranch/:id', component: editOwnerComponent, canActivate: [AuthGuard, AdminGuard], data: { roles: ['ADMIN', 'RESIDENT'] } }
    ])],
    exports: [RouterModule]
})

export class editOwnerRouting {

}