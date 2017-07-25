import { AdminGuard } from './../core/admin-guard.service';
import { Router, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../auth-guard.service';
import { CategoryComponent } from './category.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: 'category', component: CategoryComponent, canActivate: [AuthGuard, AdminGuard], data: { roles: ['ADMIN', 'RESIDENT'] } }
    ])],
    exports: [RouterModule]
})
export class CategoryRoutingModule {


}

