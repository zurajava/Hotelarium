import { BranchService } from './branch.service';
import { BranchComponent } from './branch.component';
import { SharedModule } from './../shared/shared.module';
import { BranchRoutingModule } from './branch-routing.module';
import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
@NgModule({
    imports: [BranchRoutingModule, SharedModule, Ng2SmartTableModule],
    declarations: [BranchComponent],
    providers: [BranchService]
})

export class BranchModule {

}