import { RoomService } from './room.service';
import { RegisterComponent } from './room.component';
import { RegisterRoomgModule } from './room-routing.module';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
@NgModule({
    imports: [RegisterRoomgModule, SharedModule],
    declarations: [RegisterComponent],
    providers: [RoomService]
})

export class RoomModule {
    
 }