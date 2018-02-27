import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile.component';
import { ProfileService } from './profile.service';
import { ProfileRoutingModule } from './profile-routing.module';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  imports: [
    SharedModule, ProfileRoutingModule
  ],
  declarations: [ProfileComponent],
  providers: [ProfileService]
})
export class ProfileModule {

}
