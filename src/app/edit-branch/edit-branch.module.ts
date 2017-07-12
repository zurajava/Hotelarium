import { BranchService } from './../branch/branch.service';
import { EditBranchService } from './edit-branch.service';
import { editOwnerComponent } from './edit-branch.component';
import { editOwnerRouting } from './edit-branch-routing.module';

import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
@NgModule({
    imports: [editOwnerRouting, SharedModule, Ng2SmartTableModule],
    declarations: [editOwnerComponent],
    providers: [EditBranchService, BranchService]
})

export class editOwnerModule {

}