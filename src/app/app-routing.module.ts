import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeniedComponent } from './core/denied.component';
const routes: Routes =
    [
        {
            path: '',
            redirectTo: 'login',
            pathMatch: 'full'
        },
        {
            path: 'denied',
            component: DeniedComponent
        }
    ];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}

