import { ReservationModule } from './reservation/reservation.module';
import { ReportsModule } from './reports/reports.module';
import { AdminGuard } from './core/admin-guard.service';
import { AuthService } from './core/auth.service';
import { AuthGuard } from './auth-guard.service';
import { BranchModule } from './branch/branch.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RoomModule } from './room/room.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { AppComponent } from './app.component';
import { LoginModule } from './login/login.module';
import { PersonsModule } from './persons/persons.module';
import { UsersModule } from './users/users.module';
import { CategoryModule } from './category/category.module';
import { ServiceModule } from './service/service.module';
import { ProfileModule } from './profile/profile.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SalesModule } from './sales/sales.module';
import { FormsModule } from '@angular/forms';

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
    DashboardModule,
    RoomModule,
    BranchModule,
    ReportsModule,
    ReservationModule,
    PersonsModule,
    UsersModule,
    CategoryModule,
    ServiceModule,
    ProfileModule,
    SalesModule,
    FormsModule
  ],
  providers: [AuthGuard, AuthService, AdminGuard],
  bootstrap: [AppComponent]
})
export class AppModule {

}
