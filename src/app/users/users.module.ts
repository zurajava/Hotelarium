import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { UsersService } from './users.service';
import { UserRoutingModule } from './users-routing.module';
@NgModule({
  imports: [
    CommonModule, UserRoutingModule
  ],
  declarations: [UsersComponent],
  providers: [UsersService]
})
export class UsersModule {

}
