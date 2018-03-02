import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { UsersService } from './users.service';
import { UserRoutingModule } from './users-routing.module';
import { SharedModule } from './../shared/shared.module';

@NgModule({
  imports: [
    CommonModule, UserRoutingModule, SharedModule
  ],
  declarations: [UsersComponent],
  providers: [UsersService]
})
export class UsersModule {

}
