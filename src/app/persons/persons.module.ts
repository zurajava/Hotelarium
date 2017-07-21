import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonsComponent } from './persons.component';
import { PersonRoutingModule } from './person-routing.module';
import { PersonsService } from './persons.service';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';


@NgModule({
  imports: [
    CommonModule, PersonRoutingModule, NguiAutoCompleteModule
  ],
  declarations: [PersonsComponent],
  providers: [PersonsService]
})
export class PersonsModule {

}
