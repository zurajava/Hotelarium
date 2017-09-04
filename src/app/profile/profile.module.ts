import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { ProfileService } from './profile.service';
import { ProfileRoutingModule } from './profile-routing.module';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { InputsModule } from '@progress/kendo-angular-inputs';
@NgModule({
  imports: [
    CommonModule, ProfileRoutingModule, ButtonsModule, InputsModule
  ],
  declarations: [ProfileComponent],
  providers: [ProfileService]
})
export class ProfileModule {

}
