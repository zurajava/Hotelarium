import { successComponent } from './success.component';
import { AuthGuard } from './../auth-guard.service';
import { NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';



@NgModule({
    imports: [RouterModule.forChild([
        { path: 'success', component: successComponent, canActivate: [AuthGuard] }
    ])],
    exports: [RouterModule]
})

export class successRouting {

}