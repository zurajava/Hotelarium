import { AdminGuard } from './../core/admin-guard.service';
import { BranchComponent } from './branch.component';
import { Router, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import {AuthGuard} from '../auth-guard.service';


@NgModule({
    imports:[RouterModule.forChild([
        {path:'branch',component:BranchComponent,canActivate:[AuthGuard,AdminGuard]}
    ])],
    exports:[RouterModule]
})

export class ViewOwnerRoutingModule {

}