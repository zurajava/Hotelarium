import { ReservationModule } from './reservation/reservation.module';
import { DictionaryModule } from './dictionary/dictionary.module';
import { ReportsModule } from './reports/reports.module';
import { AdminGuard } from './core/admin-guard.service';
import { AuthService } from './core/auth.service';
import { AuthGuard } from './auth-guard.service';
import { editOwnerModule } from './edit-branch/edit-branch.module';
import { BranchModule } from './branch/branch.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { RoomModule } from './room/room.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { AppComponent } from './app.component';
import { LoginModule } from './login/login.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    LoginModule,
    RoomModule,
    BranchModule,
    editOwnerModule,
    ReportsModule,
    DictionaryModule,
    ReservationModule

  ],
  providers: [AuthGuard, AuthService, AdminGuard],
  bootstrap: [AppComponent]
})
export class AppModule {

}
