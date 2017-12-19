import { SalesRouting } from './sales-routing.module';
import { SalesComponent } from './sales.component';
import { SalesService } from './sales.service';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';

@NgModule({
    imports: [SharedModule, SalesRouting, DateInputsModule],
    declarations: [SalesComponent],
    providers: [SalesService]
})

export class SalesModule {

}