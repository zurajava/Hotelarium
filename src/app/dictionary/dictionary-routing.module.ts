import { AdminGuard } from './../core/admin-guard.service';
import { DictionaryComponent } from './dictionary.component';
import { AuthGuard } from './../auth-guard.service';


import { NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';



@NgModule({
    imports: [RouterModule.forChild([
        { path: 'dictionary', component: DictionaryComponent, canActivate: [AuthGuard, AdminGuard], data: { roles: ['ADMIN'] } }
    ])],
    exports: [RouterModule]
})

export class DictionaryRouting {

}