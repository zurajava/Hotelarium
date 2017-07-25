import { AdminGuard } from './../core/admin-guard.service';
import { Router, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../auth-guard.service';
import { ServiceComponent } from './service.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: 'service', component: ServiceComponent, canActivate: [AuthGuard, AdminGuard], data: { roles: ['ADMIN', 'RESIDENT'] } }
    ])],
    exports: [RouterModule]
})
export class ServiceRoutingModule {


}

