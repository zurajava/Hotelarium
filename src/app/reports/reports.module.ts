import { ReportRouting } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { ReportsService } from './reports.service';
import { FilterPipe } from './../core/filter.pipe';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';

@NgModule({
    imports: [SharedModule, ReportRouting, DateInputsModule],
    declarations: [ReportsComponent, FilterPipe],
    providers: [ReportsService]
})

export class ReportsModule {

}